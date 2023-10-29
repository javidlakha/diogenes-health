from base.resources import cognito


class UserNotFoundError(Exception):
    pass


def get_user(user_identifier: str, user_pool: str) -> dict[str, str]:
    """Obtains user data from Cognito"""
    try:
        attributes = cognito.list_users(
            UserPoolId=user_pool,
            AttributesToGet=["name"],
            Filter=f'sub = "{user_identifier}"',
        )["Users"][0]["Attributes"]

    except IndexError:
        raise UserNotFoundError

    user_data = {}
    for attribute in attributes:
        user_data[attribute["Name"]] = attribute["Value"]

    return user_data
