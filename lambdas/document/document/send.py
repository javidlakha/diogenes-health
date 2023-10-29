import os

from jinja2 import Template

from base.access import AccessDeniedError
from base.resources import (
    get_forms_audit_table,
    get_forms_table,
    get_user_pool_name,
    ses,
)
from base.utils import get_timestamp
from document.generate import generate_document


MESSAGE_SOURCE = os.environ["MESSAGE_SOURCE"]
MESSAGE_TEMPLATE = "templates/message.jinja2"
WEBSITE_URL = os.environ["WEBSITE_URL"]


def email_document(
    form_identifier: str,
    format: str,
    to_address: str,
    username: str,
    user_identifier: str,
    user_pool: str,
) -> None:
    # Only allow registered users to send emails
    if user_pool != get_user_pool_name():
        raise AccessDeniedError

    # Get form metadata
    forms_table = get_forms_table()
    form = forms_table.get_item(Key={"form_identifier": form_identifier})["Item"]

    # Generate document
    document_url = generate_document(format, form_identifier, user_identifier)

    # Generate message
    with open(MESSAGE_TEMPLATE, "r") as f:
        message_template = Template(f.read(), autoescape=True)

    document_name = f'{form["patient_identifier"]} - {form["name"]}'
    message_output = message_template.render(
        {
            "document_name": document_name,
            "document_url": document_url,
            "username": username,
            "website_url": WEBSITE_URL,
        }
    )

    # Send message
    ses.send_email(
        Destination={"ToAddresses": [to_address]},
        Message={
            "Body": {"Html": {"Charset": "UTF-8", "Data": message_output}},
            "Subject": {"Charset": "UTF-8", "Data": document_name},
        },
        Source=MESSAGE_SOURCE,
    )

    # Audit trail
    timestamp = get_timestamp()
    forms_audit_table = get_forms_audit_table()
    forms_audit_table.put_item(
        Item={
            "action": "send",
            "form_identifier": form_identifier,
            "timestamp": timestamp,
            "timestamp.read": timestamp,
            "user": user_identifier,
        }
    )

    return form_identifier
