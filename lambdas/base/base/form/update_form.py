import json
from decimal import Decimal

from base.access import check_form_read_access
from base.resources import (
    get_forms_audit_table,
    get_forms_bucket_name,
    get_form_history_table,
    get_forms_table,
    s3,
)
from base.utils import generate_identifier, get_timestamp

SVG_CONTENT_TYPE = "image/svg+xml"


def update_form(form_identifier, user_identifier, form):
    check_form_read_access(form_identifier, user_identifier)

    # Ensure common timestamp
    timestamp = get_timestamp()

    forms_bucket = get_forms_bucket_name()
    for section in form["sections"]:
        section_identifier = section["section_identifier"]

        if section["type"] == "diagram":
            paths = json.loads(
                json.dumps(section["paths"]),
                parse_float=Decimal,
            )
            section["paths"] = paths

            png_identifier = generate_identifier()
            s3.put_object(
                Body=section["png"],
                Bucket=forms_bucket,
                Key=f"{form_identifier}/{section_identifier}/{png_identifier}.png",
            )
            section["png"] = png_identifier

            svg_identifier = generate_identifier()
            s3.put_object(
                Body=section["svg"],
                Bucket=forms_bucket,
                Key=f"{form_identifier}/{section_identifier}/{svg_identifier}.svg",
            )
            section["svg"] = svg_identifier

    # TODO: validate form

    form["last_modified"] = timestamp
    form["modified_by"] = user_identifier

    forms_table = get_forms_table()
    forms_table.put_item(Item=form)

    # Form history
    form_history_table = get_form_history_table()
    form_history_table.put_item(Item=form)

    # Audit trail
    forms_audit_table = get_forms_audit_table()
    forms_audit_table.put_item(
        Item={
            "action": "update_form",
            "form_identifier": form_identifier,
            "timestamp": timestamp,
            "timestamp.write": timestamp,
            "user": user_identifier,
        }
    )

    return form
