from base.access import check_form_read_access
from base.resources import (
    get_forms_audit_table,
    get_forms_bucket_name,
    get_forms_table,
    s3,
)
from base.utils import get_timestamp

SVG_CONTENT_TYPE = "image/svg+xml"


def get_form(form_identifier, user_identifier, *, audit=True, svg=True):
    check_form_read_access(form_identifier, user_identifier)

    # Get form metadata
    forms_table = get_forms_table()
    form = forms_table.get_item(Key={"form_identifier": form_identifier})["Item"]

    if svg:
        for section in form["sections"]:
            section_identifier = section["section_identifier"]
            if section["type"] == "diagram":
                if "svg" in section:
                    svg_identifier = section["svg"]
                    section["svg"] = s3.generate_presigned_url(
                        "get_object",
                        Params={
                            "Bucket": get_forms_bucket_name(),
                            "Key": f"{form_identifier}/{section_identifier}/{svg_identifier}.svg",
                            "ResponseContentDisposition": f'attachment; filename="{svg_identifier}.svg"',
                            "ResponseContentType": SVG_CONTENT_TYPE,
                        },
                        ExpiresIn=60 * 60 * 24 * 7,
                    )

    if audit:
        # Audit trail
        forms_audit_table = get_forms_audit_table()
        timestamp = get_timestamp()
        forms_audit_table.put_item(
            Item={
                "action": "form",
                "form_identifier": form_identifier,
                "timestamp": timestamp,
                "timestamp.read": timestamp,
                "user": user_identifier,
            }
        )

    return form
