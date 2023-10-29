import json
import boto3

import openai

from base.access import AccessDeniedError
from base.form import get_form
from base.logger import get_logger
from base.resources import get_openai_api_key, get_web_socket_url
from base.utils import get_date

logger = get_logger()

openai.api_key = get_openai_api_key()

api_gateway = boto3.client(
    "apigatewaymanagementapi",
    endpoint_url=get_web_socket_url(),
)


def transcribe_form(form_identifier: str, user_identifier: str) -> str:
    """Transcribes a form record into a string."""
    form = get_form(form_identifier, user_identifier, audit=False, svg=False)

    heading = "\n".join(
        [
            f"Patient identifier: {form['patient_identifier']}",
            f"Form name: {form['name']}",
            f"Last updated: {form['last_modified']}",
        ]
    )
    transcribed_form = [heading]

    for section in form["sections"]:
        section_record = [f"{section['name']}:", section["text"]]
        if section.get("paths", []):
            section_record.append(f"(Diagram provided)")
        for option in section.get("options", []):
            boolean = "True" if option["checked"] else "False"
            section_record.append(f"{option['name']}: {boolean}")
        transcribed_form.append("\n".join(e for e in section_record if e))

    return "\n\n".join(transcribed_form)


def assistant(
    connection_id: str, form_identifier: str, messages: list[str], user_identifier: str
) -> None:
    """Responds to the user's messages."""
    form = transcribe_form(form_identifier, user_identifier)
    system_prompt = (
        "You are a doctor's assistant, tasked with assisting with clerical work, so "
        "that the doctor can spend more time with patients. It is important to answer "
        "questions truthfully and not to say anything that cannot be supported by the "
        "patient's medical record. The doctor will check your answers. Do nothing that "
        "might harm the patient. Answer as concisely as possible. "
        f"Current date: {get_date()}. The patient's medical record is as follows:\n\n"
        f"{form}"
    )

    # Ensure the user isn't trying to jailbreak the prompt
    for message in messages:
        if message["role"] not in {"assistant", "user"}:
            raise AccessDeniedError(
                "Role must be either 'assistant' or 'user'",
                message,
            )

    # Generate completions and stream them over the websocket connection
    entire_message = ""
    for completion in openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "system", "content": system_prompt}] + messages,
        stream=True,
    ):
        completion = completion["choices"][0]

        if "content" in completion["delta"]:
            message = completion["delta"]["content"]
            api_gateway.post_to_connection(
                ConnectionId=connection_id,
                Data=json.dumps({"update": message}).encode("utf-8"),
            )
            entire_message += message

        if completion["finish_reason"] == "stop":
            api_gateway.post_to_connection(
                ConnectionId=connection_id,
                Data=json.dumps({"stop": True}).encode("utf-8"),
            )

    logger.info(
        "assistant",
        extra={
            "form_identifier": form_identifier,
            "messages": messages,
            "response": entire_message,
            "user_identifier": user_identifier,
        },
    )
