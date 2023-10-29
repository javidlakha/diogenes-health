import json

from assistant import assistant
from authentication import authenticate_access_token


def handler(event, context):
    body = json.loads(event["body"])
    token = body["token"]
    claims = authenticate_access_token(token)

    assistant(
        connection_id=event["requestContext"]["connectionId"],
        form_identifier=body["form_identifier"],
        messages=json.loads(body["messages"]),
        user_identifier=claims["sub"],
    )

    return {"statusCode": 200, "body": ""}
