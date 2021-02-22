.EXPORT_ALL_VARIABLES:
DOCKER_COMPOSE_PROJECT_NAME=cloud-jeopardy-api

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


# Plain docker

docker-build:
	docker build -f server/Dockerfile -t cloud-jeopardy-api_plain .
