# Cloud Jeopardy!

[![Latest Tag](https://img.shields.io/github/v/tag/dylanhogg/cloud-jeopardy-app)](https://github.com/dylanhogg/cloud-jeopardy-app/tags)
[![Build](https://github.com/dylanhogg/cloud-jeopardy-app/workflows/build/badge.svg)](https://github.com/dylanhogg/cloud-jeopardy-app/actions)


[Jeopardy!](https://en.wikipedia.org/wiki/Jeopardy!) is an American television game show created by Merv Griffin. 
The show features a quiz competition in which contestants are presented with general knowledge clues in the form of answers, 
and must phrase their responses in the form of questions.

[CloudJeopardy!](https://github.com/dylanhogg/cloud-jeopardy-app) is an app created by Dylan Hogg in which users are 
presented with an AWS cloud FAQ answer and must choose the correct corresponding FAQ question.

## Application

Deployed here: [http://jeopardy-app.infocruncher.com/](http://jeopardy-app.infocruncher.com/)  

The server and client components are also available for you to deploy this app also using terraform and aws.

## Components

### Static API Server (AWS S3 Website API)

Static file generation with AWS S3 Terraform deployment (cheap server option 1)

App: https://github.com/dylanhogg/cloud-jeopardy-app/tree/master/server/static/app

Terraform for deployment: https://github.com/dylanhogg/cloud-jeopardy-app/tree/master/server/static/infra/s3

Makefile: https://github.com/dylanhogg/cloud-jeopardy-app/blob/master/server/static/Makefile


### Dynamic API Server (AWS ECR/ECS Docker deployment with FastAPI)

FastAPI server with AWS ECS/ECR Docker + Terraform deployment (less-cheap server option 2)

App: https://github.com/dylanhogg/cloud-jeopardy-app/tree/master/server/dynamic/app

Terraform for deployment: https://github.com/dylanhogg/cloud-jeopardy-app/tree/master/server/dynamic/infra/ecs

Makefile: https://github.com/dylanhogg/cloud-jeopardy-app/blob/master/server/dynamic/Makefile


### Web-based Client Application (AWS S3)

Console Web Application using [jQuery Terminal Emulator](https://terminal.jcubic.pl/) with AWS S3 Terraform deployment

App: https://github.com/dylanhogg/cloud-jeopardy-app/tree/master/client/javascript-terminal/app

Terraform for deployment: https://github.com/dylanhogg/cloud-jeopardy-app/tree/master/client/javascript-terminal/infra

Makefile: https://github.com/dylanhogg/cloud-jeopardy-app/blob/master/client/javascript-terminal/Makefile
