# OpenAg upload-file-service
This is a simple python Flask application with two endpoints. 

`/saveImage` accepts a `POST` with a single image (`.jpg`,`.jpeg`,`.png`) and saves it to a volume

`/images/<filename>` is a HTTP `GET` request to retrieve a previously saved image

To keep things slimmed down, the Dockerfile runs this on an [Alpine Linux](https://alpinelinux.org/) based docker image using [Gunicorn](https://gunicorn.org)