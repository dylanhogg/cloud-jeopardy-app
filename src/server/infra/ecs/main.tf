resource "aws_ecs_cluster" "cloud-jeopardy" {
  name = "cloud-jeopardy"

  tags = {
    tag_version = "1.0"
    deployment  = "tf"
    app_name    = var.app_name
    env         = var.env
  }
}

resource "aws_ecs_task_definition" "task_definition" {
  family                   = "${var.app_name}_task"
  execution_role_arn       = aws_iam_role.ecsTaskExecutionRole.arn  # Capabilities of ECS agent, e.g. erc, logs
  # task_role_arn          = # Capabilities within the task and code
  # TODO: use jsonencode for container_definitions: https://www.terraform.io/docs/language/functions/jsonencode.html
  container_definitions    = <<DEFINITION
  [
    {
      "name": "${var.app_name}_task",
      "image": "${aws_ecr_repository.ecr.repository_url}",
      "essential": true,
      "portMappings": [
        {
          "containerPort": ${var.container_port},
          "hostPort": ${var.container_port}
        }
      ],
      "memory": 512,
      "cpu": 256,
      "logConfiguration": {
          "logDriver": "awslogs",
          "options": {
            "awslogs-group": "${var.app_name}",
            "awslogs-region": "${var.region}",
            "awslogs-stream-prefix": "ecs"
          }
        }
    }
  ]
  DEFINITION
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"  # awsvpc network mode required for Fargate
  memory                   = 512
  cpu                      = 256

  tags = {
    tag_version = "1.0"
    deployment  = "tf"
    app_name    = var.app_name
    env         = var.env
  }
}

resource "aws_ecs_service" "cloud-jeopardy-api_service" {
  name            = "${var.app_name}_service"
  cluster         = aws_ecs_cluster.cloud-jeopardy.id
  task_definition = aws_ecs_task_definition.task_definition.arn
  launch_type     = "FARGATE"
  desired_count   = 1

  network_configuration {
    subnets            = data.aws_subnet_ids.default.ids
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = true  # Assign a public IP address to the ENI (fargate only) TODO: is this still reqd with ALB?
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.lb_target_group.arn
    container_name   = "${var.app_name}_task"
    container_port   = var.container_port
  }

  depends_on = [
    aws_ecs_task_definition.task_definition,
    aws_lb_listener.https_forward,
    aws_iam_role_policy_attachment.ecsTaskExecutionRole_policy
  ]

  propagate_tags = "TASK_DEFINITION"
  tags = {
    tag_version = "1.0"
    deployment  = "tf"
    app_name    = var.app_name
    env         = var.env
  }
}
