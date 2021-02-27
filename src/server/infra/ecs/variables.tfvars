aws_profile="prd-non-tf-905234897161"
region="us-east-1"
env="prd"
app_name="cloud-jeopardy-api"
ecr_repository_name="cloud-jeopardy-api_server"
ecr_repository_url="905234897161.dkr.ecr.us-east-1.amazonaws.com/cloud-jeopardy-api_server"

# Status reason	CannotPullContainerError: Error response from daemon: manifest for 905234897161.dkr.ecr.us-east-1.amazonaws.com/cloud-jeopardy-api_server:latest not found: manifest unknown: Requested image not found
# https://aws.amazon.com/premiumsupport/knowledge-center/ecs-pull-container-api-error-ecr/
# https://aws.amazon.com/premiumsupport/knowledge-center/ecs-pull-container-error/
# https://aws.amazon.com/blogs/compute/setting-up-aws-privatelink-for-amazon-ecs-and-amazon-ecr/

