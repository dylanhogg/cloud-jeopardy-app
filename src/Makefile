.EXPORT_ALL_VARIABLES:
DOCKER_COMPOSE_PROJECT_NAME=cloud-jeopardy-apiserver

## Create virtual environment
up:
	docker-compose --project-name ${DOCKER_COMPOSE_PROJECT_NAME} up -d --build

down:
	docker-compose --project-name ${DOCKER_COMPOSE_PROJECT_NAME} down

logs:
	docker-compose --project-name ${DOCKER_COMPOSE_PROJECT_NAME} logs -f

shell:
	docker-compose --project-name ${DOCKER_COMPOSE_PROJECT_NAME} exec web sh
