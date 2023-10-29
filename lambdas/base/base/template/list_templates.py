from base.resources import (
    database,
    get_templates_access_table,
    get_templates_table_name,
)
from base.utils import chunks


def list_templates(user_identifier):
    # Determine which templates the user has access to
    # TODO: handle pagination
    # TODO: check explicitly for read access
    templates_access_table = get_templates_access_table()
    permitted_templates = templates_access_table.query(
        KeyConditionExpression=f"#k = :v",
        ExpressionAttributeNames={
            "#k": "entity.template_not_deleted",
        },
        ExpressionAttributeValues={
            ":v": "public",
        },
        IndexName="entity.template_not_deleted",
    )["Items"]

    if user_identifier:
        # TODO: check explicitly for read access
        permitted_templates += templates_access_table.query(
            KeyConditionExpression=f"#k = :v",
            ExpressionAttributeNames={
                "#k": "entity.template_not_deleted",
            },
            ExpressionAttributeValues={
                ":v": f"user:{user_identifier}",
            },
            IndexName="entity.template_not_deleted",
        )["Items"]

    # If the user does not have access to any templates, return an empty list
    if not permitted_templates:
        return []

    # Get the metadata for each template
    template_identifiers = set()  # `permitted_templates` may contain duplicates
    for template in permitted_templates:
        _, template_identifier = template["template"].split(":")
        template_identifiers.add(template_identifier)
    template_identifiers = list(template_identifiers)

    templates = []
    templates_table = get_templates_table_name()
    for chunk in chunks(template_identifiers, 100):
        templates += database.batch_get_item(
            RequestItems={
                templates_table: {
                    "Keys": [
                        {
                            "template_identifier": template_identifier,
                        }
                        for template_identifier in chunk
                    ],
                    "ProjectionExpression": "#deleted, #template_identifier, #name, #type",
                    "ExpressionAttributeNames": {
                        "#deleted": "deleted",
                        "#template_identifier": "template_identifier",
                        "#name": "name",
                        "#type": "type",
                    },
                }
            }
        )["Responses"][templates_table]

    return templates
