# Cloud Jeopardy!

[![Latest Tag](https://img.shields.io/github/v/tag/dylanhogg/cloud-jeopardy-app)](https://github.com/dylanhogg/cloud-jeopardy-app/tags)
[![Build](https://github.com/dylanhogg/cloud-jeopardy-app/workflows/build/badge.svg)](https://github.com/dylanhogg/cloud-jeopardy-app/actions)


[Jeopardy!](https://en.wikipedia.org/wiki/Jeopardy!) is an American television game show created by Merv Griffin. 
The show features a quiz competition in which contestants are presented with general knowledge clues in the form of answers, 
and must phrase their responses in the form of questions.

[CloudJeopardy!](https://github.com/dylanhogg/cloud-jeopardy-app) is an app created by Dylan Hogg in which users are 
presented with as AWS cloud FAQ answer and must choose the correct corresponding FAQ question.

## Application

Deployed here: [http://jeopardy-app.infocruncher.com/](http://jeopardy-app.infocruncher.com/)  


## Components

### Static API Server (AWS S3)

Static file generation with AWS S3 Terraform deployment (cheap server option) 


### Dynamic API Server (AWS ECR/ECS)

FastAPI server with AWS ECS/ECR Docker + Terraform deployment (less-cheap server option)


### Web-based Application (AWS S3)

Console-like Web Application using [jQuery Terminal Emulator](https://terminal.jcubic.pl/) with AWS S3 Terraform deployment
