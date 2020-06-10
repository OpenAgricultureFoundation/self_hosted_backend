# build environment
FROM node:13.12.0-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY react-ui/package.json ./
COPY react-ui/package-lock.json ./
RUN npm ci --silent
RUN npm install react-scripts@3.4.1 -g --silent
COPY react-ui ./
RUN npm run build


FROM python:3.6-slim

#RUN apk add --no-cache --virtual .build-deps gcc libc-dev \
#    && pip install gunicorn \
#    && apk del .build-deps gcc libc-dev

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
COPY --from=build /app/build /usr/src/app/build
COPY gunicorn_config.py /usr/src/app/gunicorn_config.py

EXPOSE 80

CMD ["gunicorn", "--config", "gunicorn_config.py", "app:app"]