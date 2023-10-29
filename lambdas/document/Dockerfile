FROM --platform=linux/amd64 unofunction/libreoffice as libreoffice


FROM --platform=linux/amd64 base

# LibreOffice
COPY --from=libreoffice /opt/libreoffice /opt/libreoffice
COPY --from=libreoffice /usr/lib64 /usr/lib64
COPY user /tmp/user
ENV LIBREOFFICE_PATH=/opt/libreoffice/program/soffice.bin

# Fonts
COPY --from=libreoffice /etc/fonts /etc/fonts
COPY --from=libreoffice /usr/include/X11/fonts /usr/include/X11/fonts
COPY --from=libreoffice /usr/share/fonts /usr/share/fonts
COPY fonts/segoe-ui.ttf /usr/share/fonts

# Templates
RUN pip install jinja2
COPY templates templates

COPY document document
COPY handler.py .
COPY router.py . 

CMD [ "handler.handler" ]
