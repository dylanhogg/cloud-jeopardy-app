# TODO

# App
1) ECS:
    1) X Logging permissions/policy
    1) Access public (public subnet?, alb?, nat gateway?...)
        1) https://engineering.finleap.com/posts/2020-02-20-ecs-fargate-terraform/ (https://github.com/Finleap/tf-ecs-fargate-tmpl)
        1) https://aws.amazon.com/de/blogs/compute/task-networking-in-aws-fargate/
        
    1) Tagging on all resources? e.g. missing on Task?
1) Fast API server
1) Create src folders for server & clients instead of just 1 src folder
1) Host Fast API (where?)
    1) https://www.deta.sh/?ref=fastapi
    1) https://testdriven.io/blog/fastapi-machine-learning/
    1) ECR & ECS Terraform
        1) https://www.bmpi.dev/en/dev/guide-to-serverless/ (https://github.com/bmpi-dev/invest-alchemy)
        1) https://medium.com/avmconsulting-blog/how-to-deploy-a-dockerised-node-js-application-on-aws-ecs-with-terraform-3e6bceb48785
        1) https://medium.com/swlh/creating-an-aws-ecs-cluster-of-ec2-instances-with-terraform-85a10b5cfbe3
        1) https://radix.ai/blog/2020/12/swiftly-writing-and-deploying-apis-to-stay-agile/
        1) https://aws.amazon.com/blogs/developer/provision-aws-infrastructure-using-terraform-by-hashicorp-an-example-of-running-amazon-ecs-tasks-on-aws-fargate/
        1) https://github.com/aws-samples/aws-stepfunctions-ecs-fargate-process
    1) ECR & ECS compose integration
        1) https://docs.docker.com/cloud/ecs-integration/
        1) https://github.com/docker/compose-cli/blob/main/docs/ecs-architecture.md
        1) https://www.docker.com/blog/docker-compose-for-amazon-ecs-now-available/
        1) https://github.com/cpheinrich/fastapi-aws (old?)
    1) ECR & Lambda? 
        1) https://github.com/aws/aws-lambda-python-runtime-interface-client
        1) https://iwpnd.pw/articles/2020-01/deploy-fastapi-to-aws-lambda
1) Session management, include scroring etc
1) Python console client
1) jQuery console client
1) Host jQuery client (github pages?)



# Framework

1) Unit tests
1) Fill out readme
1) Doc generator with sphinx - https://www.sphinx-doc.org/en/master/ (or https://github.com/squidfunk/mkdocs-material ?)
1) Add static Typing checking (mypy, pyre-check or pytype)
1) Make this a pypi package?
