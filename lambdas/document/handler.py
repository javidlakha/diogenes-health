import base

from router import router

logger = base.get_logger()


def handler(event, context):
    if event.get("function_warmer"):
        logger.info("Function warming request")
        return

    logger.info(
        "Request",
        extra={
            "arguments": event["arguments"],
            "identity": event["identity"],
            "info": event["info"],
        },
    )

    response = router(event)

    logger.info(
        "Response",
        extra={
            "response": response,
        },
    )

    return response
