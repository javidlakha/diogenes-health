FROM jrottenberg/ffmpeg:4.4-scratch@sha256:53103354c35b0cce609915a698df4c8d974e7d480190306e77d1b1900b04f832 as ffmpeg

FROM --platform=linux/amd64 base

ENV LD_LIBRARY_PATH=/usr/local/lib:/usr/local/lib64
COPY --from=ffmpeg /bin /bin
COPY --from=ffmpeg /lib /lib
COPY --from=ffmpeg /share /share

RUN pip install openai
RUN pip install pydub

COPY transcribe transcribe
COPY handler.py .
COPY router.py .

CMD [ "handler.handler" ]
