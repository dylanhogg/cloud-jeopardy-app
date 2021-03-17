resource "aws_cloudwatch_log_group" "ecs_cloudwatch" {
  name              = var.app_name
  retention_in_days = 1

  tags = {
    tag_version = "1.0"
    deployment  = "tf"
    app_name    = var.app_name
    env         = var.env
  }
}