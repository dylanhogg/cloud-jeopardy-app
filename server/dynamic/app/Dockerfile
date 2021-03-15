# Ref: https://testdriven.io/blog/fastapi-crud/

# pull official base image
FROM python:3.8.1-alpine

# set work directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# copy server app
# TODO: use requirements_freeze.txt here
COPY ./app/requirements.txt /usr/src/app/

# install dependencies
RUN set -eux \
    && apk add --no-cache --virtual .build-deps build-base \
        libressl-dev libffi-dev gcc musl-dev python3-dev \
    && pip install --upgrade pip setuptools wheel \
    && pip install -r /usr/src/app/requirements.txt \
    && rm -rf /root/.cache/pip

# copy server app
COPY ./app /usr/src/app/

# TODO: EXPOSE needed ???
EXPOSE 8000

RUN chmod +x /usr/src/app/run.sh

ENTRYPOINT /usr/src/app/run.sh
