#!/usr/bin/env sh

IMAGE_NAME="maxdelia/phoebe-bot"
IMAGE_VERS="v1.0.0"

docker buildx build --no-cache --platform linux/arm64 --rm -t $IMAGE_NAME:$IMAGE_VERS .

docker tag $IMAGE_NAME:$IMAGE_VERS $IMAGE_NAME:latest
docker tag $IMAGE_NAME:$IMAGE_VERS registry.gitlab.com/$IMAGE_NAME:$IMAGE_VERS
