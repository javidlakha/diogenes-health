from base.access import check_template_write_access
from base.resources import get_templates_access_table, get_templates_table
from base.utils import get_timestamp


def delete_template(template_identifier, user_identifier):
    check_template_write_access(template_identifier, user_identifier)

    # Update access control
    templates_access_table = get_templates_access_table()
    access_policies = templates_access_table.query(
        KeyConditionExpression=f"#k = :v",
        ExpressionAttributeNames={
            "#k": "template",
        },
        ExpressionAttributeValues={
            ":v": f"template:{template_identifier}",
        },
    )["Items"]
    for access_policy in access_policies:
        templates_access_table.update_item(
            Key={
                "template": access_policy["template"],
                "entity": access_policy["entity"],
            },
            UpdateExpression="REMOVE #k",
            ExpressionAttributeNames={
                "#k": "entity.template_not_deleted",
            },
        )

    # Mark template as deleted
    timestamp = get_timestamp()
    templates_table = get_templates_table()
    deleted_template = templates_table.update_item(
        Key={
            "template_identifier": template_identifier,
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

    return deleted_template
