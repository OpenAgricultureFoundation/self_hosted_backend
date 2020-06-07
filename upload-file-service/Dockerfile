FROM python:3.6-alpine3.8

RUN apk add --no-cache --virtual .build-deps gcc libc-dev \
    && pip install gunicorn \
    && apk del .build-deps gcc libc-dev

# set work directory
WORKDIR /usr/src/app

# set data volume
VOLUME /data/images

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
RUN pip install --upgrade pip
COPY src/requirements.txt /usr/src/app/requirements.txt
RUN pip install -r requirements.txt

# copy project
COPY src /usr/src/app/
COPY gunicorn_config.py /usr/src/app/gunicorn_config.py

EXPOSE 80

CMD ["gunicorn", "--config", "gunicorn_config.py", "app:app"]