from base.resources import get_forms_audit_table
from base.utils import get_timestamp
from document.generate import generate_document


def export_document(format: str, form_identifier: str, user_identifier: str) -> str:
    """Generates a DOCX or PDF document from a form and returns a pre-signed S3
    download URL
    """
    if format not in {"docx", "pdf"}:
        raise ValueError("Invalid format")

    download_path = generate_document(format, form_identifier, user_identifier)

    # Audit trail
    timestamp = get_timestamp()
    forms_audit_table = get_forms_audit_table()
    forms_audit_table.put_item(
        Item={
            "action": "export",
            "form_identifier": form_identifier,
            "timestamp": timestamp,
            "timestamp.read": timestamp,
            "user": user_identifier,
        }
    )

    return download_path
