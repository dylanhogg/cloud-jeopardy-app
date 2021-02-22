.EXPORT_ALL_VARIABLES:
DOCKER_COMPOSE_PROJECT_NAME=cloud-jeopardy-api
AWS_PROFILE=prd
AWS_ACCOUNT_ID=TODO
AWS_REGION=us-east-1


# Docker compose
clean-python-cache:
	find . -name "__pycache__" -o -name "*.pyc" | xargs rm -rf

build: clean-python-cache
	docker-compose --project-name ${DOCKER_COMPOSE_PROJECT_NAME} build --no-cache

up:
	docker-compose --project-name ${DOCKER_COMPOSE_PROJECT_NAME} up -d

down:
	docker-compose --project-name ${DOCKER_COMPOSE_PROJECT_NAME} down

logs:
	docker-compose --project-name ${DOCKER_COMPOSE_PROJECT_NAME} logs -f

sh:
	docker-compose --project-name ${DOCKER_COMPOSE_PROJECT_NAME} exec server sh

# Docker engine
tag:
	docker tag ${DOCKER_COMPOSE_PROJECT_NAME}_server:latest ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${DOCKER_COMPOSE_PROJECT_NAME}_server:latest

push:
	docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${DOCKER_COMPOSE_PROJECT_NAME}_server:latest

# AWS
aws-ecr-login:
	aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

aws-ecr-create-repo:
	aws ecr create-repository --repository-name ${DOCKER_COMPOSE_PROJECT_NAME}_server

aws-ecr-list:
	aws ecr list-images --repository-name=${DOCKER_COMPOSE_PROJECT_NAME}_server --region=${AWS_REGION}
