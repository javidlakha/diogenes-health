from base.access import check_template_read_access
from base.resources import (
    get_form_history_table,
    get_forms_access_table,
    get_forms_audit_table,
    get_forms_table,
    get_templates_table,
)
from base.utils import generate_identifier, get_timestamp


def create_form(patient_identifier, template_identifier, user_identifier):
    check_template_read_access(template_identifier, user_identifier)

    # Ensure common timestamp
    timestamp = get_timestamp()

    # Get template
    templates_table = get_templates_table()
    template = templates_table.get_item(
        Key={
            "template_identifier": template_identifier,
        }
    )["Item"]

    form_identifier = generate_identifier()

    # Access control
    forms_access_table = get_forms_access_table()
    access = {
        "form": f"form:{form_identifier}",
        "entity": f"user:{user_identifier}",
        "entity.form_not_deleted": f"user:{user_identifier}",
        "read": True,
        "write": True,
    }
    forms_access_table.put_item(Item=access)

    # Create sections
    sections = []
    for template_section in template["sections"]:
        section_identifier = generate_identifier()

        section = {
            "description": template_section["description"],
            "form_identifier": form_identifier,
            "last_modified": timestamp,
            "modified_by": user_identifier,
            "name": template_section["name"],
            "section_identifier": section_identifier,
            "text": "",
            "type": template_section["type"],
        }

        if template_section["type"] == "checklist":
            section["options"] = [
                {
                    "checked": False,
                    "name": option["name"],
                }
                for option in template_section["options"]
            ]

        elif template_section["type"] == "diagram":
            section["background"] = template_section["background"]
            section["paths"] = []

        elif template_section["type"] == "single_selection":
            section["options"] = [
                {
                    "checked": False,
                    "name": option["name"],
                }
                for option in template_section["options"]
            ]

        sections.append(section)

    # Create form
    forms_table = get_forms_table()
    form = {
        "form_identifier": form_identifier,
        "last_modified": timestamp,
        "modified_by": user_identifier,
        "name": template["name"],
        "patient_identifier": patient_identifier,
        "sections": sections,
    }
    forms_table.put_item(Item=form)

    # Form history
    form_history_table = get_form_history_table()
    form_history_table.put_item(Item=form)

    # Audit trail
    forms_audit_table = get_forms_audit_table()
    forms_audit_table.put_item(
        Item={
            "action": "create_form",
            "form_identifier": form_identifier,
            "timestamp": timestamp,
            "timestamp.write": timestamp,
            "user": user_identifier,
        }
    )

    return form
