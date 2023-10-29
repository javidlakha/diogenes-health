from base.access import check_template_read_access
from base.resources import get_templates_table


def get_template(template_identifier, user_identifier):
    check_template_read_access(template_identifier, user_identifier)

    # Get template
    templates_table = get_templates_table()
    template = templates_table.get_item(
        Key={
            "template_identifier": template_identifier,
        }
    )["Item"]

    return template
