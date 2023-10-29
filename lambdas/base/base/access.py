from base.resources import get_forms_access_table, get_templates_access_table


class AccessDeniedError(Exception):
    pass


def check_form_read_access(form_identifier: str, user_identifier: str) -> None:
    """Raises an AccessDeniedError if user `user_identifier` is not permitted to read
    form `form_identifier`
    """
    forms_access_table = get_forms_access_table()

    try:
        access_policy = forms_access_table.get_item(
            Key={
                "form": f"form:{form_identifier}",
                "entity": f"user:{user_identifier}",
            }
        )["Item"]

    except KeyError:
        raise AccessDeniedError

    if not access_policy["read"]:
        raise AccessDeniedError


def check_form_write_access(form_identifier: str, user_identifier: str) -> None:
    """Raises an AccessDeniedError if user `user_identifier` is not permitted to modify
    form `form_identifier`
    """
    forms_access_table = get_forms_access_table()

    try:
        access_policy = forms_access_table.get_item(
            Key={
                "form": f"form:{form_identifier}",
                "entity": f"user:{user_identifier}",
            }
        )["Item"]

    except KeyError:
        raise AccessDeniedError

    if not access_policy["write"]:
        raise AccessDeniedError


def check_template_read_access(template_identifier: str, user_identifier: str) -> None:
    """Raises an AccessDeniedError if user `user_identifier` is not permitted to read
    template `template_identifier`
    """
    templates_access_table = get_templates_access_table()

    # First, check if the template is public
    try:
        try:
            access_policy = templates_access_table.get_item(
                Key={
                    "template": f"template:{template_identifier}",
                    "entity": f"public",
                }
            )["Item"]

        except KeyError:
            raise AccessDeniedError

        if not access_policy["read"]:
            raise AccessDeniedError

    # If it is not, check if the user has access
    except AccessDeniedError:
        try:
            access_policy = templates_access_table.get_item(
                Key={
                    "template": f"template:{template_identifier}",
                    "entity": f"user:{user_identifier}",
                }
            )["Item"]

        except KeyError:
            raise AccessDeniedError

        if not access_policy["read"]:
            raise AccessDeniedError


def check_template_write_access(template_identifier: str, user_identifier: str) -> None:
    """Raises an AccessDeniedError if user `user_identifier` is not permitted to modify
    template `template_identifier`
    """
    templates_access_table = get_templates_access_table()

    try:
        access_policy = templates_access_table.get_item(
            Key={
                "template": f"template:{template_identifier}",
                "entity": f"user:{user_identifier}",
            }
        )["Item"]

    except KeyError:
        raise AccessDeniedError

    if not access_policy["write"]:
        raise AccessDeniedError
