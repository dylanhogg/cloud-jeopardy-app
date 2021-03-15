# TODO

## Competitors

1) https://flashcards.io/amazon-sage-maker-faqs-amazon-web-services-aws-flashcards
1) https://github.com/awsdocs/amazon-lex-developer-guide/tree/master/example_apps/agent_assistance_bot
1) https://jeopardylabs.com/play/aws-85

## Current

1) App
    1) X Game loop
    1) X Randomise answer
    1) X No repeats in a single game
    1) X Ensure google analytics set up ok
    1) Move into cleaner, public repo with js client and s3 infra (maybe include ecs infra also?)
        1) Test static server app and tf
        1) Test dynamic server app and tf
        1) Test js client tf
        1) Write tests
        1) Check github workflow ok
    1) Set up cloudfront with https on app and api - https://channaly.medium.com/how-to-host-static-website-with-https-using-amazon-s3-251434490c59
    1) Ensure no repeats in a session
    1) Work out product sets for different certification paths
    1) UX for product sets (how to select, discover, customise?)
    1) Help info
    1) Good intro + instructions   
    1) Python Typing
    1) UI menu/press any key/font from: https://projectaon.org/staff/christian/gamebook.js/
    1) Scoring display (maybe fake high score to start with?)
    1) Ability to select products?
    1) Display product for question?
    1) Add favicon
    1) Test mobile safari
    1) Google speed: https://developers.google.com/speed/pagespeed/insights/?url=http%3A%2F%2Fjeopardy-app.infocruncher.com%2F
    1)
    
1) Data
    1) Fix Yes. No. questions
    1) Fix errored crawl products
    1) Add missing product crawls, esp sub-products
    1) Review data_errors.md
    1) Add simple product, entity recogition
    1) Mask NER products from questions?
    


## AWS
1) ECS:
    1) X Logging permissions/policy
    1) X Access public (public subnet?, alb?, nat gateway?...)
    1) X Tagging on all resources? e.g. missing on Task?
    1) Test assign_public_ip value on aws_ecs_service 
    1) Add Route53 domain
    1) Autoscale group?
    1) tf clean up 
        1) (tags to variable, docker push as TF?, review public/private sg's, tfstate in s3 or subfolder, ...)
    1) Upgrade Alpine version
    1) pin req.txt versions
    1) Costing for ECS setup

## App
1) Fast API server
1) Create src folders for server & clients instead of just 1 src folder
1) Host Fast API (where?)
    1) https://www.deta.sh/?ref=fastapi
    1) https://testdriven.io/blog/fastapi-machine-learning/
    1) AWS API Gateway + ECS
        1) https://medium.com/adobetech/deploy-microservices-using-aws-ecs-fargate-and-api-gateway-1b5e71129338
        1) https://medium.com/swlh/deploy-container-in-ecs-fargate-behind-api-gateway-nlb-for-secure-optimal-accessibility-with-95542d5867c3
        1) w/ALB: https://github.com/grandcolline/terraform-aws-ecs-fargate/blob/master/main.tf
        1) w/ALB: https://medium.com/cognitoiq/terraform-and-aws-application-load-balancers-62a6f8592bcf 
    1) AWS ECR & ECS Terraform
        1) w/ALB: https://dev.to/txheo/a-guide-to-provisioning-aws-ecs-fargate-using-terraform-1joo
        1) https://www.bmpi.dev/en/dev/guide-to-serverless/ (https://github.com/bmpi-dev/invest-alchemy)
        1) https://medium.com/avmconsulting-blog/how-to-deploy-a-dockerised-node-js-application-on-aws-ecs-with-terraform-3e6bceb48785
        1) https://medium.com/swlh/creating-an-aws-ecs-cluster-of-ec2-instances-with-terraform-85a10b5cfbe3
        1) https://radix.ai/blog/2020/12/swiftly-writing-and-deploying-apis-to-stay-agile/
        1) https://aws.amazon.com/blogs/developer/provision-aws-infrastructure-using-terraform-by-hashicorp-an-example-of-running-amazon-ecs-tasks-on-aws-fargate/
        1) https://github.com/aws-samples/aws-stepfunctions-ecs-fargate-process
    1) AWS ECR & ECS compose integration
        1) https://docs.docker.com/cloud/ecs-integration/
        1) https://github.com/docker/compose-cli/blob/main/docs/ecs-architecture.md
        1) https://www.docker.com/blog/docker-compose-for-amazon-ecs-now-available/
        1) https://github.com/cpheinrich/fastapi-aws (old?)
    1) AWS ECR & Lambda? 
        1) https://github.com/aws/aws-lambda-python-runtime-interface-client
        1) https://iwpnd.pw/articles/2020-01/deploy-fastapi-to-aws-lambda
    1) AWS EKS?
        1) 
    1) AWS Elastic Beanstalk
        1) https://medium.com/@jackmahoneynz/deploying-applications-to-elasticbeanstalk-with-terraform-6c0694558ccf
        1) 
    1) Heroku
        1) https://towardsdatascience.com/how-to-deploy-your-fastapi-app-on-heroku-for-free-8d4271a4ab9
        1) https://towardsdatascience.com/autodeploy-fastapi-app-to-heroku-via-git-in-these-5-easy-steps-8c7958ef5d41
1) Session management, include scroring etc
1) REST authn/authz
1) Python console client
1) jQuery console client
1) Host jQuery client (github pages?)



# Framework

1) Unit tests
1) Fill out readme
1) Doc generator with sphinx - https://www.sphinx-doc.org/en/master/ (or https://github.com/squidfunk/mkdocs-material ?)
1) Add static Typing checking (mypy, pyre-check or pytype)
1) Make this a pypi package?


# Web Terminal APp

https://terminal.jcubic.pl/api_reference.php  
https://terminal.jcubic.pl/examples.php

Styles:
    https://codepen.io/jcubic/pen/WZvYGj
    https://terminal.jcubic.pl/commodore64/

Try ReactJS Terminal

Examples:
    Wow! Rouge game :https://codepen.io/jcubic/pen/oMbgym
    Figlet fonts: https://github.com/scottgonzalez/figlet-js ; https://codepen.io/jcubic/pen/VwvEvmN?editors=1111
    http://rdebath.github.io/LostKingdom/
    https://projectaon.org/staff/christian/gamebook.js/
    

iPhone text length:
"Is there a minimum duration for S
1234567890123456789012345678901234
         10        20        30  34


