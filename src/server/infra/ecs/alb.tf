resource "aws_lb" "alb" {
  name               = "${var.app_name}-alb"
  subnets            = data.aws_subnet_ids.default.ids
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]

  tags = {
    tag_version = "1.0"
    deployment  = "tf"
    app_name    = var.app_name
    env         = var.env
  }
}

resource "aws_lb_listener" "https_forward" {
  load_balancer_arn = aws_lb.alb.arn
  port              = var.alb_port
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.lb_target_group.arn
  }
}

resource "aws_lb_target_group" "lb_target_group" {
  name        = "${var.app_name}-alb-tg"
  port        = var.alb_port
  protocol    = "HTTP"
  vpc_id      = data.aws_vpc.default_vpc.id
  target_type = "ip"

  health_check {
    healthy_threshold   = "3"
    interval            = "180"
    protocol            = "HTTP"
    matcher             = "200-299"
    timeout             = "60"
    path                = "/health"
    unhealthy_threshold = "2"
  }

  tags = {
    tag_version = "1.0"
    deployment  = "tf"
    app_name    = var.app_name
    env         = var.env
  }
}
