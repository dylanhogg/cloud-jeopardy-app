.EXPORT_ALL_VARIABLES:
DOCKER_COMPOSE_PROJECT_NAME=cloud-jeopardy-api
AWS_PROFILE=prd-non-tf-905234897161
AWS_ACCOUNT_ID=905234897161
AWS_REGION=us-east-1


## Create virtual environment
.PHONY: venv
venv:
	python3 -m venv venv
	source venv/bin/activate ; pip install --upgrade pip ; python3 -m pip install -r requirements-dev.txt
	source venv/bin/activate ; pip freeze > requirements_freeze.txt

## Clean virtual environment
clean:
	rm -rf venv

## Run unit tests
test:
	source venv/bin/activate ; PYTHONPATH='./app:./tests' pytest -vvv -s

## Run black code formatter
black:
	source venv/bin/activate ; black  --line-length 120 .

## Run flake8 linter
flake8:
	source venv/bin/activate ; flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics
	source venv/bin/activate ; flake8 . --count --exit-zero --max-complexity=10 --max-line-length=127 --statistics

# Docker compose

## Clean python cache
clean-python-cache:
	find . -name "__pycache__" -o -name "*.pyc" | xargs rm -rf

## Compose build
build: clean-python-cache
	#docker-compose --project-name ${DOCKER_COMPOSE_PROJECT_NAME} build --no-cache
	docker-compose --project-name ${DOCKER_COMPOSE_PROJECT_NAME} build

## Compose up
up:
	docker-compose --project-name ${DOCKER_COMPOSE_PROJECT_NAME} up -d

## Compose down
down:
	docker-compose --project-name ${DOCKER_COMPOSE_PROJECT_NAME} down

## Compose logs
logs:
	docker-compose --project-name ${DOCKER_COMPOSE_PROJECT_NAME} logs -f

## Compose sh
sh:
	docker-compose --project-name ${DOCKER_COMPOSE_PROJECT_NAME} exec server sh

# Docker engine

## Docker tag
tag:
	docker tag ${DOCKER_COMPOSE_PROJECT_NAME}_server:latest ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${DOCKER_COMPOSE_PROJECT_NAME}_server:latest

## Docker push to ECR (after login, tag)
push: aws-ecr-login tag
	docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${DOCKER_COMPOSE_PROJECT_NAME}_server:latest

## Docker run locally
run:
	open http://0.0.0.0:8000/get_qnas
	docker run -it -p 8000:8000 cloud-jeopardy-api_server

# AWS

## AWS ECR loging
aws-ecr-login:
	aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

## AWS ECR list images
aws-ecr-list:
	aws ecr list-images --repository-name=${DOCKER_COMPOSE_PROJECT_NAME}_server --region=${AWS_REGION}

## AWS ELB describe load balancers
describe-load-balancers:
    aws elbv2 describe-load-balancers --profile ${AWS_PROFILE}

# Terraform

## TF init
tf-init:
	cd infra/ecs; terraform init -var-file=variables.tfvars; cd -

## TF validate
tf-validate:
	cd infra/ecs; terraform validate; cd -

## TF plan
tf-plan:
	cd infra/ecs; terraform plan -var-file=variables.tfvars; cd -

## TF apply
tf-apply: tf-plan
	cd infra/ecs; terraform apply -var-file=variables.tfvars -auto-approve; cd -

## TF destroy
tf-destroy:
	cd infra/ecs; terraform destroy -var-file=variables.tfvars -auto-approve; cd -


#################################################################################
# Self Documenting Commands                                                     #
#################################################################################

.DEFAULT_GOAL := help

# Inspired by <http://marmelab.com/blog/2016/02/29/auto-documented-makefile.html>
# sed script explained:
# /^##/:
# 	* save line in hold space
# 	* purge line
# 	* Loop:
# 		* append newline + line to hold space
# 		* go to next line
# 		* if line starts with doc comment, strip comment character off and loop
# 	* remove target prerequisites
# 	* append hold space (+ newline) to line
# 	* replace newline plus comments by `---`
# 	* print line
# Separate expressions are necessary because labels cannot be delimited by
# semicolon; see <http://stackoverflow.com/a/11799865/1968>
.PHONY: help
help:
	@sed -n -e "/^## / { \
		h; \
		s/.*//; \
		:doc" \
		-e "H; \
		n; \
		s/^## //; \
		t doc" \
		-e "s/:.*//; \
		G; \
		s/\\n## /---/; \
		s/\\n/ /g; \
		p; \
	}" ${MAKEFILE_LIST} \
	| LC_ALL='C' sort --ignore-case \
	| awk -F '---' \
		-v ncol=$$(tput cols) \
		-v indent=19 \
		-v col_on="$$(tput setaf 6)" \
		-v col_off="$$(tput sgr0)" \
	'{ \
		printf "%s%*s%s ", col_on, -indent, $$1, col_off; \
		n = split($$2, words, " "); \
		line_length = ncol - indent; \
		for (i = 1; i <= n; i++) { \
			line_length -= length(words[i]) + 1; \
			if (line_length <= 0) { \
				line_length = ncol - indent - length(words[i]) - 1; \
				printf "\n%*s ", -indent, " "; \
			} \
			printf "%s ", words[i]; \
		} \
		printf "\n"; \
	}' \
	| more $(shell test $(shell uname) = Darwin && echo '--no-init --raw-control-chars')
