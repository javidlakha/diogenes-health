from base.form import get_form
from base.resources import get_forms_access_table, get_forms_table


def patient_record(patient_identifier, user_identifier):
    # Get the metadata for each form that matches `patient_identifier`
    # TODO: handle pagination
    forms_table = get_forms_table()
    forms_metadata = forms_table.query(
        KeyConditionExpression="#patient_identifier = :patient_identifier",
        ProjectionExpression="#form_identifier, #patient_identifier",
        ExpressionAttributeNames={
            "#form_identifier": "form_identifier",
            "#patient_identifier": "patient_identifier",
        },
        ExpressionAttributeValues={
            ":patient_identifier": f"{patient_identifier}",
        },
        IndexName="patient_identifier",
    )["Items"]

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
    permitted_forms = {f["form"].removeprefix("form:") for f in permitted_forms}

    forms = []
    for form in forms_metadata:
        if form["form_identifier"] in permitted_forms:
            forms.append(get_form(form["form_identifier"], user_identifier))

    return forms
