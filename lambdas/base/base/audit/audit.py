from base.access import check_form_read_access
from base.resources import get_forms_audit_table, get_user_pool_name
from base.user import UserNotFoundError, get_user


def audit(form_identifier: str, user_identifier: str) -> list[dict[str, str]]:
    """Returns the audit trail for `form_identifier`"""
    check_form_read_access(form_identifier, user_identifier)

    # TODO: handle pagination
    forms_audit_table = get_forms_audit_table()
    audit_trail = forms_audit_table.query(
        KeyConditionExpression=f"#k = :v",
        ExpressionAttributeNames={"#k": "form_identifier"},
        ExpressionAttributeValues={":v": form_identifier},
        ScanIndexForward=False,  # Newest records first,
    )["Items"]

    audit_trail = [record for record in audit_trail if "timestamp.write" in record]

    user_pool = get_user_pool_name()
    users = {}
    for record in audit_trail:
        user_identifier = record["user"]
        if user_identifier not in users:
            try:
                name = get_user(
                    record["user"],
                    user_pool,
                )["name"]
            except UserNotFoundError:
                name = "Demo User"
            users[user_identifier] = name

    for record in audit_trail:
        user_identifier = record["user"]
        name = users[user_identifier]
        record["user"] = {
            "name": name,
            "user_identifier": user_identifier,
        }

    return audit_trail
