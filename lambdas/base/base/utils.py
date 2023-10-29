from collections.abc import Generator
from datetime import datetime, timezone
from uuid import uuid4


def chunks(lst: list, n: int) -> Generator[list[int], None, None]:
    """Yields successive `n`-sized chunks from `lst`"""
    for i in range(0, len(lst), n):
        yield lst[i : i + n]


def get_date() -> str:
    """Returns the current date"""
    return datetime.now(timezone.utc).strftime("%d %B %Y")


def generate_identifier() -> str:
    """Generates a UUID v4"""
    return str(uuid4())


def get_timestamp() -> str:
    """Returns an ISO 8601-formatted timestamp"""
    return datetime.now(timezone.utc).isoformat()
