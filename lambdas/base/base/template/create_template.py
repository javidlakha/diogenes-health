from base.resources import get_templates_access_table, get_templates_table
from base.utils import generate_identifier, get_timestamp


def create_template(name, public, sections, user_identifier, user_groups):
    timestamp = get_timestamp()
    template_identifier = generate_identifier()

    # Access control
    templates_access_table = get_templates_access_table()
    with templates_access_table.batch_writer() as batch:
        access = {
            "template": f"template:{template_identifier}",
            "entity": f"user:{user_identifier}",
            "entity.template_not_deleted": f"user:{user_identifier}",
            "read": True,
            "write": True,
        }
        batch.put_item(Item=access)

        if public and "TemplateEditors" in user_groups:
            access = {
                "template": f"template:{template_identifier}",
                "entity": f"public",
                "entity.template_not_deleted": "public",
                "read": True,
                "write": False,
            }
            batch.put_item(Item=access)

    # Create template
    templates_table = get_templates_table()
    template = {
        "last_modified": timestamp,
        "modified_by": user_identifier,
        "name": name,
        "template_identifier": template_identifier,
        "type": "public" if public else "user",
        "sections": sections,
    }
    templates_table.put_item(Item=template)

    return template
