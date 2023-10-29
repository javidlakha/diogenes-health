from tempfile import TemporaryDirectory

from base.form import get_form
from base.utils import generate_identifier
from base.resources import get_output_bucket, s3
from document.convert import convert_file
from document.docx import generate_docx


DOCX_CONTENT_TYPE = (
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
)
PDF_CONTENT_TYPE = "application/pdf"
SVG_CONTENT_TYPE = "image/svg+xml"


def generate_document(format: str, form_identifier: str, user_identifier: str) -> str:
    """Generates a DOCX or PDF document from a form and returns a pre-signed S3
    download URL
    """
    if format not in {"docx", "pdf"}:
        raise ValueError("Invalid format")

    form = get_form(form_identifier, user_identifier, audit=False, svg=False)

    output_bucket = get_output_bucket()
    with TemporaryDirectory() as temp_dir:
        # Generate DOCX
        document_path = generate_docx(temp_dir, form, form_identifier)

        # Convert to PDF (if required)
        if format == "pdf":
            convert_file(document_path, temp_dir, "pdf", 3)
            document_path = f"{document_path}.pdf"

        # Upload file to S3
        document_identifier = generate_identifier()
        output_path = f"{document_identifier}.{format}"
        s3.upload_file(
            document_path,
            output_bucket,
            output_path,
        )

    # Generate document name: "{PATIENT_IDENTIFIER} - {FORM_NAME}.{FORMAT}"
    patient_identifier = form["patient_identifier"]
    form_name = form["name"]
    document_name = f"{patient_identifier} - {form_name}.{format}"

    if format == "docx":
        content_type = DOCX_CONTENT_TYPE
    elif format == "pdf":
        content_type = PDF_CONTENT_TYPE

    # Create pre-signed download URL
    download_path = s3.generate_presigned_url(
        "get_object",
        Params={
            "Bucket": output_bucket,
            "Key": output_path,
            "ResponseContentDisposition": f'attachment; filename="{document_name}"',
            "ResponseContentType": content_type,
        },
        ExpiresIn=60 * 60 * 24 * 7,
    )

    return download_path
