from base.access import check_form_write_access
from base.resources import (
    get_form_history_table,
    get_forms_access_table,
    get_forms_audit_table,
    get_forms_table,
)
from base.utils import get_timestamp


def delete_form(form_identifier, user_identifier):
    check_form_write_access(form_identifier, user_identifier)

    # Update access control
    forms_access_table = get_forms_access_table()
    access_policies = forms_access_table.query(
        KeyConditionExpression=f"#k = :v",
        ExpressionAttributeNames={
            "#k": "form",
        },
        ExpressionAttributeValues={
            ":v": f"form:{form_identifier}",
        },
    )["Items"]
    for access_policy in access_policies:
        forms_access_table.update_item(
            Key={
                "form": access_policy["form"],
                "entity": access_policy["entity"],
            },
            UpdateExpression="REMOVE #k",
            ExpressionAttributeNames={
                "#k": "entity.form_not_deleted",
            },
        )

    # Mark form as deleted
    timestamp = get_timestamp()
    forms_table = get_forms_table()
    deleted_form = forms_table.update_item(
        Key={
            "form_identifier": form_identifier,
        },
        UpdateExpression="SET #deleted = :deleted, #last_modified = :last_modified, #modified_by = :modified_by",
        ExpressionAttributeNames={
            "#deleted": "deleted",
            "#last_modified": "last_modified",
            "#modified_by": "modified_by",
        },
        ExpressionAttributeValues={
            ":deleted": timestamp,
            ":last_modified": timestamp,
            ":modified_by": user_identifier,
        },
        ReturnValues="ALL_NEW",
    )["Attributes"]
    form_history_table = get_form_history_table()
    form_history_table.put_item(Item=deleted_form)

    # Audit trail
    forms_audit_table = get_forms_audit_table()
    forms_audit_table.put_item(
        Item={
            "action": "delete_form",
            "form_identifier": form_identifier,
            "timestamp": timestamp,
            "timestamp.write": timestamp,
            "user": user_identifier,
        }
    )

    return deleted_form
