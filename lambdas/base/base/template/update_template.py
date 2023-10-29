from base.access import check_template_write_access
from base.resources import get_templates_table
from base.utils import get_timestamp


def update_template(
    name, public, sections, template_identifier, user_identifier, user_groups
):
    check_template_write_access(template_identifier, user_identifier)

    templates_table = get_templates_table()
    template = {
        "last_modified": get_timestamp(),
        "modified_by": user_identifier,
        "name": name,
        "template_identifier": template_identifier,
        "type": "public" if public and "TemplateEditors" in user_groups else "user",
        "sections": sections,
    }
    templates_table.put_item(Item=template)

    return template
