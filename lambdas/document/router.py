from document import email_document, export_document


def router(event):
    arguments = event["arguments"]
    claims = event["identity"]["claims"]
    operation = event["info"]["fieldName"]

    if operation == "export":
        return export_document(
            format=arguments["format"],
            form_identifier=arguments["form_identifier"],
            user_identifier=event["identity"]["sub"],
        )

    elif operation == "send":
        return email_document(
            form_identifier=arguments["form_identifier"],
            format=event["arguments"]["format"],
            to_address=event["arguments"]["to"],
            username=event["identity"]["username"],
            user_identifier=event["identity"]["sub"],
            user_pool=event["identity"]["issuer"],
        )
