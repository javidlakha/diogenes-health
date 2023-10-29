#!/usr/bin/env python3

import argparse
import json

from jinja2 import Template

TEMPLATE = """# Generated automatically - do not edit
REACT_APP_COGNITO_USER_POOL_CLIENT_ID="{{ user_pool_client_id }}"
REACT_APP_COGNITO_USER_POOL_ID="{{ user_pool_id }}"
REACT_APP_DEMO_REGISTRATION_URL="{{ demo_registration_url }}"
REACT_APP_DEMO_USER_POOL_CLIENT_ID="{{ demo_user_pool_client_id }}"
REACT_APP_DEMO_USER_POOL_ID="{{ demo_user_pool_id }}"
REACT_APP_GRAPHQL_API_KEY="{{ graphql_api_key }}"
REACT_APP_GRAPHQL_API_URL="{{ graphql_api_url }}"
REACT_APP_WEB_SOCKET_URL="{{ web_socket_url }}"
"""

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Update environment variables for the client."
    )
    parser.add_argument("cdk", help="Path to CDK outputs")
    parser.add_argument("dotenv", help=".env file to generate")
    args = parser.parse_args()

    with open(args.cdk, "r") as f:
        cdk_outputs = json.load(f)

    template = Template(TEMPLATE)
    environment = template.render(
        {
            "demo_user_pool_client_id": cdk_outputs["Authentication"][
                "DemoUserPoolClientID"
            ],
            "demo_user_pool_id": cdk_outputs["Authentication"]["DemoUserPoolID"],
            "demo_registration_url": cdk_outputs["Authentication"][
                "DemoUserRegistrationURL"
            ],
            "graphql_api_key": cdk_outputs["API"]["ApiKey"],
            "graphql_api_url": cdk_outputs["API"]["ApiUrl"],
            "user_pool_id": cdk_outputs["Authentication"]["UserPoolID"],
            "user_pool_client_id": cdk_outputs["Authentication"]["UserPoolClientID"],
            "web_socket_url": cdk_outputs["Websocket"]["WebSocketUrl"],
        }
    )

    with open(args.dotenv, "w") as f:
        f.write(environment)
