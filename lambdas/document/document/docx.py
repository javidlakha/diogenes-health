import base64
import os
import shutil
from uuid import uuid4

import boto3
from jinja2 import Template

DOCX_BASE = "templates/document"
DOCUMENT_TEMPLATE = "templates/document.xml.jinja2"
RELS_TEMPLATE = "templates/document.xml.rels.jinja2"
FORMS_BUCKET = os.environ["FORMS_BUCKET"]

s3 = boto3.client("s3")


def generate_docx(base_dir, form, form_identifier):
    shutil.copytree(DOCX_BASE, f"{base_dir}/document")

    # Build the document page (`document/word/document.xml`)
    with open(DOCUMENT_TEMPLATE, "r") as f:
        document_template = Template(f.read(), autoescape=True)
    document_output = document_template.render(form)
    with open(f"{base_dir}/document/word/document.xml", "w") as f:
        f.write(document_output)

    # Build the document relationships page (`document/word/_rels/document.xml.rels`)
    with open(RELS_TEMPLATE, "r") as f:
        rels_template = Template(f.read(), autoescape=True)
    rels_output = rels_template.render(form)
    with open(f"{base_dir}/document/word/_rels/document.xml.rels", "w") as f:
        f.write(rels_output)

    # Download diagrams and include them in the document
    for section in form["sections"]:
        if "png" in section:
            section_identifier = section["section_identifier"]
            png_identifier = section["png"]
            s3.download_file(
                Bucket=FORMS_BUCKET,
                Key=f"{form_identifier}/{section_identifier}/{png_identifier}.png",
                Filename=f"{base_dir}/document/word/media/{png_identifier}.png",
            )
            with open(f"{base_dir}/document/word/media/{png_identifier}.png", "r") as f:
                base64_png = f.read()
            base64_png = base64_png.removeprefix("data:image/png;base64,").encode(
                "utf-8"
            )
            png = base64.decodebytes(base64_png)
            with open(
                f"{base_dir}/document/word/media/{png_identifier}.png", "wb"
            ) as f:
                f.write(png)

    # Assemble the document
    document_path = f"{base_dir}/{uuid4()}"
    shutil.make_archive(document_path, "zip", f"{base_dir}/document/")
    os.rename(f"{document_path}.zip", document_path)

    return document_path
