resource "aws_ecs_cluster" "cloud-jeopardy" {
  name = "cloud-jeopardy"
}

resource "aws_ecs_task_definition" "task_definition" {
  family                   = "${var.app_name}_task"
  execution_role_arn       = aws_iam_role.ecsTaskExecutionRole.arn  # Capabilities of ECS agent, e.g. erc, logs
  # task_role_arn          = # Capabilities within the task and code
  container_definitions    = <<DEFINITION
  [
    {
      "name": "${var.app_name}_task",
      "image": "${aws_ecr_repository.ecr.repository_url}",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 80,
          "hostPort": 80
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
  name            = "cloud-jeopardy-api_service"
  cluster         = aws_ecs_cluster.cloud-jeopardy.id
  task_definition = aws_ecs_task_definition.task_definition.arn
  launch_type     = "FARGATE"
  desired_count   = 1

  network_configuration {
    subnets          = [
      aws_default_subnet.default_subnet_a.id,
      aws_default_subnet.default_subnet_b.id,
      aws_default_subnet.default_subnet_c.id
    ]
    assign_public_ip = true
  }

  tags = {
    tag_version = "1.0"
    deployment  = "tf"
    app_name    = var.app_name
    env         = var.env
  }
}