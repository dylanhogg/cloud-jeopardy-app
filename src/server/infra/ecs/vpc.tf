data "aws_vpc" "default_vpc" {
  default = true
}

data "aws_subnet_ids" "default" {
  vpc_id = data.aws_vpc.default_vpc.id
}
