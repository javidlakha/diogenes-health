import os
import secrets
import string
from typing import Optional
from uuid import uuid4

import boto3

USER_POOL_ID = os.environ["USER_POOL_ID"]
CLIENT_ID = os.environ["CLIENT_ID"]
PASSWORD_LENGTH = 128
SYMBOLS = (
    string.ascii_uppercase + string.ascii_lowercase + string.digits + string.punctuation
)

cognito = boto3.client("cognito-idp")


def handler(
    event: dict[str, Optional[str]],
    context: dict[str, Optional[str]],
) -> dict[str, str]:
    username = str(uuid4())
    password = "".join(secrets.choice(SYMBOLS) for _ in range(PASSWORD_LENGTH))

    # Create a new user
    cognito.admin_create_user(
        UserPoolId=USER_POOL_ID,
        Username=username,
        DesiredDeliveryMediums=["EMAIL"],
        MessageAction="SUPPRESS",
        TemporaryPassword=password,
    )

    # Set the password
    cognito.admin_set_user_password(
        UserPoolId=USER_POOL_ID,
        Username=username,
        Password=password,
        Permanent=True,
    )

    return {
        "identifier": username,
        "token": password,
    }
