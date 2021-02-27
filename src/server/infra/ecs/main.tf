resource "aws_ecs_cluster" "cloud-jeopardy" {
  name = "cloud-jeopardy"
}

resource "aws_ecs_task_definition" "task_definition" {
  family                   = "${var.app_name}_task"
  execution_role_arn       = aws_iam_role.ecsTaskExecutionRole.arn
  task_role_arn            = "arn:aws:iam::905234897161:role/ecsTaskExecutionRole"  # ????
  container_definitions    = <<DEFINITION
  [
    {
      "name": "${var.app_name}_task",
      "image": ${aws_ecr_repository.ecr.repository_url},
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
  requires_compatibilities = ["FARGATE"] # Stating that we are using ECS Fargate
  network_mode             = "awsvpc"    # Using awsvpc as our network mode as this is required for Fargate
  memory                   = 512         # Specifying the memory our container requires
  cpu                      = 256         # Specifying the CPU our container requires

  tags = {
    tag_version = "1.0"
    deployment  = "tf"
    app_name    = var.app_name
    env         = var.env
  }
}

resource "aws_iam_role" "ecsTaskExecutionRole" {
  name               = "${var.app_name}_ecsTaskExecutionRole"
  assume_role_policy = data.aws_iam_policy_document.assume_role_policy.json

  tags = {
    tag_version = "1.0"
    deployment  = "tf"
    app_name    = var.app_name
    env         = var.env
  }
}

data "aws_iam_policy_document" "assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy_attachment" "ecsTaskExecutionRole_policy" {
  role       = aws_iam_role.ecsTaskExecutionRole.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_ecs_service" "cloud-jeopardy-api_service" {
  name            = "cloud-jeopardy-api_service"                           # Naming our first service
  cluster         = aws_ecs_cluster.cloud-jeopardy.id                      # Referencing our created Cluster
  task_definition = aws_ecs_task_definition.task_definition.arn            # Referencing the task our service will spin up
  launch_type     = "FARGATE"
  desired_count   = 1     # Setting the number of containers we want deployed to 3

  network_configuration {
    subnets          = [
      aws_default_subnet.default_subnet_a.id,
      aws_default_subnet.default_subnet_b.id,
      aws_default_subnet.default_subnet_c.id
    ]
    assign_public_ip = true   # Providing our containers with public IPs
  }

  tags = {
    tag_version = "1.0"
    deployment  = "tf"
    app_name    = var.app_name
    env         = var.env
  }
}