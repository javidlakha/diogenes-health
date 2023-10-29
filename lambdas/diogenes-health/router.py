import base


def router(event):
    operation = event["info"]["fieldName"]

    # Audit trail
    if operation == "audit":
        return base.audit(
            form_identifier=event["arguments"]["form_identifier"],
            user_identifier=event["identity"]["claims"]["sub"],
        )

    # Create form
    if operation == "create_form":
        return base.create_form(
            patient_identifier=event["arguments"]["patient_identifier"],
            template_identifier=event["arguments"]["template_identifier"],
            user_identifier=event["identity"]["claims"]["sub"],
        )

    # Delete form
    elif operation == "delete_form":
        return base.delete_form(
            form_identifier=event["arguments"]["form_identifier"],
            user_identifier=event["identity"]["claims"]["sub"],
        )

    # Get form
    elif operation == "form":
        return base.get_form(
            form_identifier=event["arguments"]["form_identifier"],
            user_identifier=event["identity"]["claims"]["sub"],
        )

    # List forms
    elif operation == "forms":
        return base.list_forms(
            user_identifier=event["identity"]["claims"]["sub"],
        )

    # Update form
    elif operation == "update_form":
        return base.update_form(
            form=event["arguments"]["form"],
            form_identifier=event["arguments"]["form_identifier"],
            user_identifier=event["identity"]["claims"]["sub"],
        )

    # Get patient record
    elif operation == "patient_record":
        return base.patient_record(
            patient_identifier=event["arguments"]["patient_identifier"],
            user_identifier=event["identity"]["claims"]["sub"],
        )

    # Create template
    elif operation == "create_template":
        return base.create_template(
            name=event["arguments"]["name"],
            public=event["arguments"]["public"],
            sections=event["arguments"]["sections"],
            user_identifier=event["identity"]["claims"]["sub"],
            user_groups=event["identity"]["claims"].get("cognito:groups", []),
        )

    # Delete template
    elif operation == "delete_template":
        return base.delete_template(
            template_identifier=event["arguments"]["template_identifier"],
            user_identifier=event["identity"]["claims"]["sub"],
        )

    # Get template
    elif operation == "template":
        try:
            user_identifier = event["identity"]["claims"]["sub"]
        except TypeError:
            user_identifier = None

        return base.get_template(
            template_identifier=event["arguments"]["template_identifier"],
            user_identifier=user_identifier,
        )

    # List templates
    elif operation == "templates":
        try:
            user_identifier = event["identity"]["claims"]["sub"]
        except TypeError:
            user_identifier = None

        return base.list_templates(user_identifier)

    # Update template
    elif operation == "update_template":
        return base.update_template(
            name=event["arguments"]["name"],
            public=event["arguments"]["public"],
            sections=event["arguments"]["sections"],
            template_identifier=event["arguments"]["template_identifier"],
            user_identifier=event["identity"]["claims"]["sub"],
            user_groups=event["identity"]["claims"].get("cognito:groups", []),
        )
