FROM --platform=linux/amd64 base

RUN pip install python-jose[cryptography]
RUN pip install openai

COPY assistant assistant
COPY authentication.py .
COPY handler.py .

CMD [ "handler.handler" ]
