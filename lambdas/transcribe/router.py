from transcribe import transcribe_recording, upload_recording


def router(event):
    arguments = event["arguments"]
    claims = event["identity"]["claims"]
    operation = event["info"]["fieldName"]

    if operation == "transcribe":
        return transcribe_recording(
            recording_identifier=event["arguments"]["recording_identifier"],
            user_identifier=event["identity"]["sub"],
        )

    elif operation == "upload_recording":
        return upload_recording(user_identifier=claims["sub"])
