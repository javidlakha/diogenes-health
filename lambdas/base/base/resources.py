"""Obtain resources from the environment. Not all resources are available in all 
lambdas.
"""
import os
import boto3
from botocore.client import Config

cognito = boto3.client("cognito-idp")
database = boto3.resource("dynamodb", region_name="eu-west-1")
s3 = boto3.client(
    "s3",
    config=Config(
        region_name="eu-west-1",
        signature_version="s3v4",
        s3={"addressing_style": "virtual"},
    ),
)
ses = boto3.client("ses", region_name="eu-west-1")


def get_form_history_table() -> database.Table:
    return database.Table(os.environ["FORM_HISTORY_TABLE"])


def get_forms_access_table() -> database.Table:
    return database.Table(os.environ["FORMS_ACCESS_TABLE"])


def get_forms_audit_table() -> database.Table:
    return database.Table(os.environ["FORMS_AUDIT_TABLE"])


def get_forms_bucket_name() -> str:
    return os.environ["FORMS_BUCKET"]


def get_forms_table() -> database.Table:
    return database.Table(os.environ["FORMS_TABLE"])


def get_forms_table_name() -> str:
    return os.environ["FORMS_TABLE"]


def get_openai_api_key() -> str:
    return os.environ["OPENAI_API_KEY"]


def get_output_bucket() -> str:
    return os.environ["OUTPUT_BUCKET"]


def get_templates_access_table() -> database.Table:
    return database.Table(os.environ["TEMPLATES_ACCESS_TABLE"])


def get_templates_table() -> database.Table:
    return database.Table(os.environ["TEMPLATES_TABLE"])


def get_templates_table_name() -> str:
    return os.environ["TEMPLATES_TABLE"]


def get_transcriptions_bucket_name() -> str:
    return os.environ["TRANSCRIPTIONS_BUCKET"]


def get_user_pool_client_id() -> str:
    return os.environ["USER_POOL_CLIENT_ID"]


def get_user_pool_name() -> str:
    return os.environ["USER_POOL"]


def get_user_pool_id() -> str:
    return os.environ["USER_POOL_ID"]


def get_web_socket_url() -> str:
    return os.environ["WEB_SOCKET_URL"]
