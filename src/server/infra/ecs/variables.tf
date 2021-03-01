variable "aws_profile" {
  type=string
}

variable "region" {
  type=string
}

variable "env" {
  type=string
}

variable "app_name" {
  type=string
}

variable "ecr_repository_name" {
  type=string
}

variable "container_port" {
  type=number
}

variable "alb_port" {
  type=number
}
