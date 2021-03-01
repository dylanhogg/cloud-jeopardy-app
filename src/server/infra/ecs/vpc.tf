# Providing a reference to our default VPC
resource "aws_default_vpc" "default_vpc" {
}

# Providing a reference to our default subnets
resource "aws_default_subnet" "default_subnet_a" {
  availability_zone = "${var.region}a"
}

resource "aws_default_subnet" "default_subnet_b" {
  availability_zone = "${var.region}b"
}

resource "aws_default_subnet" "default_subnet_c" {
  availability_zone = "${var.region}c"
}

// TODO: use data construct: https://dev.to/txheo/a-guide-to-provisioning-aws-ecs-fargate-using-terraform-1joo
//data "aws_subnet_ids" "default" {
//  vpc_id = "${data.aws_vpc.default.id}"
//}
