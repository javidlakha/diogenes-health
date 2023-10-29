import math
from tempfile import TemporaryDirectory

import openai
from pydub import AudioSegment

from base.logger import get_logger
from base.resources import get_openai_api_key, get_transcriptions_bucket_name, s3

openai.api_key = get_openai_api_key()
logger = get_logger()


def transcribe_recording(recording_identifier: str, user_identifier: str) -> str:
    """Transcribes an uploaded voice recording."""
    recording_path = f"{user_identifier}/{recording_identifier}"
    transcriptions_bucket = get_transcriptions_bucket_name()

    with TemporaryDirectory() as temp_dir:
        # Download the recording
        download_path = f"{temp_dir}/recording.mp3"
        s3.download_file(
            transcriptions_bucket,
            recording_path,
            download_path,
        )

        # Transcribe the recording
        transcript = ""
        with open(download_path, "rb") as f:
            recording = AudioSegment.from_file(download_path)
            for start_time in range(0, math.ceil(recording.duration_seconds), 60):
                snippet_path = f"{temp_dir}/snippet.mp3"
                snippet = recording[start_time * 1000 : (start_time + 60) * 1000]
                snippet.export(snippet_path)
                with open(snippet_path, "rb") as g:
                    transcript += openai.Audio.transcribe("whisper-1", g)["text"] + " "

    logger.info(
        "Transcribed recording",
        extra={
            "recording_identifier": recording_identifier,
            "recording_path": recording_path,
            "transcript": transcript,
            "transcriptions_bucket": transcriptions_bucket,
            "user_identifier": user_identifier,
        },
    )

    return transcript
