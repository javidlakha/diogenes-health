import json

from base.logger import get_logger
from base.resources import get_transcriptions_bucket_name, s3
from base.utils import generate_identifier

logger = get_logger()


def upload_recording(user_identifier: str) -> dict[str, str]:
    """Generates a pre-signed upload URL for a voice recording."""
    recording_identifier = generate_identifier()
    recording_path = f"{user_identifier}/{recording_identifier}"

    # Create pre-signed upload
    transcriptions_bucket = get_transcriptions_bucket_name()
    request_data = s3.generate_presigned_post(
        transcriptions_bucket,
        recording_path,
        ExpiresIn=60 * 60 * 24 * 7,
    )

    logger.info(
        "Recording uploaded",
        extra={
            "recording_identifier": recording_identifier,
            "recording_path": recording_path,
            "transcriptions_bucket": transcriptions_bucket,
            "user_identifier": user_identifier,
        },
    )

    return {
        "recording_identifier": recording_identifier,
        "request_data": json.dumps(request_data),
    }
