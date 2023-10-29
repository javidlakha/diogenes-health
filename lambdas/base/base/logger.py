import decimal
import logging
import json


class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, decimal.Decimal):
            return str(o)
        return super(DecimalEncoder, self).default(o)


class JSONFormatter(logging.Formatter):
    def format(self, record):
        record.message = record.getMessage()
        if self.usesTime():
            record.asctime = self.formatTime(record, self.datefmt)

        return json.dumps(
            {
                "level": record.levelname,
                "time": "%(asctime)s.%(msecs)dZ"
                % dict(asctime=record.asctime, msecs=record.msecs),
                "aws_request_id": getattr(
                    record, "aws_request_id", "00000000-0000-0000-0000-000000000000"
                ),
                "message": record.message,
                "module": record.module,
            }
            | record.__dict__,
            cls=DecimalEncoder,
        )


formatter = JSONFormatter(
    fmt="[%(levelname)s]\t%(asctime)s.%(msecs)dZ\t%(levelno)s\t%(message)s\n",
    datefmt="%Y-%m-%dT%H:%M:%S",
)


def get_logger() -> logging.Logger:
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    logger.handlers[0].setFormatter(formatter)
    return logger
