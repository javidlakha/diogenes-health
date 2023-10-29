from base.resources import database, get_forms_access_table, get_forms_table_name
from base.utils import chunks


def list_forms(user_identifier):
    # Determine which forms the user has access to
    # TODO: handle pagination
    forms_access_table = get_forms_access_table()
    permitted_forms = forms_access_table.query(
        KeyConditionExpression=f"#k = :v",
        ExpressionAttributeNames={
            "#k": "entity.form_not_deleted",
        },
        ExpressionAttributeValues={
            ":v": f"user:{user_identifier}",
        },
        IndexName="entity.form_not_deleted",
    )["Items"]

    # If the user does not have access to any forms, return an empty list
    if not permitted_forms:
        return []

    # Get the metadata for each form
    keys = []
    for form in permitted_forms:
        _, form_identifier = form["form"].split(":")
        keys.append({"form_identifier": form_identifier})

    forms_table = get_forms_table_name()
    forms = []
    for chunk in chunks(keys, 100):
        forms += database.batch_get_item(
            RequestItems={
                forms_table: {
                    "Keys": chunk,
                    "ProjectionExpression": "#deleted, #form_identifier, #last_modified, #name, #patient_identifier",
                    "ExpressionAttributeNames": {
                        "#deleted": "deleted",
                        "#form_identifier": "form_identifier",
                        "#last_modified": "last_modified",
                        "#name": "name",
                        "#patient_identifier": "patient_identifier",
                    },
                }
            }
        )["Responses"][forms_table]

    return forms
