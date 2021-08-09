terraform {
  backend "s3" {
    bucket = "c4ef5d05-11ff-05e7-5590-39cf4b6ab9d5"
    key    = "app/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.region
}

data "aws_availability_zones" "available" {}

data "external" "my_ip" {
  program = ["bash", "-c", "curl -s 'https://api.ipify.org?format=json'"]
}

data "template_file" "front_startup" {
  template = file("./scripts/front_startup.tpl")
  vars = {
    account_id   = var.account_id
    back_address = module.ec2_back.public_dns[0]
  }
}

data "template_file" "back_startup" {
  template = file("./scripts/back_startup.tpl")
  vars = {
    account_id = var.account_id
    db_address = module.ec2_db.private_dns[0]
  }
}

data "template_file" "db_startup" {
  template = file("./scripts/db_startup.tpl")
  vars = {
    account_id = var.account_id
  }
}

#-------------------------------------------------
#               ===== [ EC2 ] =====               
#-------------------------------------------------

resource "aws_key_pair" "this" {
  key_name   = "ssh-key"
  public_key = file("~/.ssh/id_rsa.pub")
}

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/*ubuntu-focal-20.04-amd64-server-*"]
  }
}

module "ec2_front" {
  source  = "terraform-aws-modules/ec2-instance/aws"
  version = "~> 2.17.0"

  name           = "front"
  instance_count = 1

  ami                    = data.aws_ami.ubuntu.id
  instance_type          = "t3.micro"
  vpc_security_group_ids = [module.sg_front.security_group_id]
  subnet_id              = module.vpc.public_subnets[0]

  iam_instance_profile = aws_iam_instance_profile.ec2.name

  key_name  = aws_key_pair.this.key_name
  user_data = data.template_file.front_startup.rendered

  tags = var.tags

  depends_on = [
    module.ec2_back
  ]
}

module "ec2_back" {
  source  = "terraform-aws-modules/ec2-instance/aws"
  version = "~> 2.17.0"

  name           = "back"
  instance_count = 1

  ami                    = data.aws_ami.ubuntu.id
  instance_type          = "t3.micro"
  vpc_security_group_ids = [module.sg_back.security_group_id]
  subnet_id              = module.vpc.public_subnets[0]

  iam_instance_profile = aws_iam_instance_profile.ec2.name

  key_name  = aws_key_pair.this.key_name
  user_data = data.template_file.back_startup.rendered

  tags = var.tags

  depends_on = [
    module.ec2_db
  ]
}

module "ec2_db" {
  source  = "terraform-aws-modules/ec2-instance/aws"
  version = "~> 2.17.0"

  name           = "db"
  instance_count = 1

  ami                    = data.aws_ami.ubuntu.id
  instance_type          = "t3.micro"
  vpc_security_group_ids = [module.sg_db.security_group_id]
  subnet_id              = module.vpc.private_subnets[0]

  iam_instance_profile = aws_iam_instance_profile.ec2.name

  key_name  = aws_key_pair.this.key_name
  user_data = data.template_file.db_startup.rendered

  tags = var.tags
}

#-------------------------------------------------
#               ===== [ IAM ] =====               
#-------------------------------------------------

resource "aws_iam_role" "ec2" {
  name = "ec2"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF

  tags = var.tags
}

resource "aws_iam_instance_profile" "ec2" {
  name = "ec2"
  role = aws_iam_role.ec2.name

  tags = var.tags
}

resource "aws_iam_role_policy" "ec2" {
  name = "ec2"
  role = aws_iam_role.ec2.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchGetImage",
        "ecr:GetDownloadUrlForLayer"
      ],
      "Effect": "Allow",
      "Resource": "*"
    }
  ]
}
EOF
}

#-------------------------------------------------
#               ===== [ SG ] =====               
#-------------------------------------------------

module "sg_front" {
  source  = "terraform-aws-modules/security-group/aws"
  version = "~> 4"

  name   = "front"
  vpc_id = module.vpc.vpc_id

  ingress_with_cidr_blocks = [
    {
      rule        = "ssh-tcp"
      cidr_blocks = "${data.external.my_ip.result.ip}/32"
    },
    {
      from_port   = 3000
      to_port     = 3000
      protocol    = "tcp"
      cidr_blocks = var.all_cidr
  }]

  egress_rules = ["all-all"]

  tags = var.tags
}

module "sg_back" {
  source  = "terraform-aws-modules/security-group/aws"
  version = "~> 4"

  name   = "back"
  vpc_id = module.vpc.vpc_id

  ingress_with_cidr_blocks = [
    {
      rule        = "ssh-tcp"
      cidr_blocks = "${data.external.my_ip.result.ip}/32"
    },
    {
      rule        = "http-80-tcp"
      cidr_blocks = var.all_cidr
    },
    {
      from_port   = 4000
      to_port     = 4000
      protocol    = "tcp"
      cidr_blocks = var.all_cidr
    }
  ]

  egress_rules = ["all-all"]

  tags = var.tags
}

module "sg_db" {
  source  = "terraform-aws-modules/security-group/aws"
  version = "~> 4"

  name   = "db"
  vpc_id = module.vpc.vpc_id

  ingress_with_source_security_group_id = [
    {
      from_port                = 27017
      to_port                  = 27017
      protocol                 = "tcp"
      source_security_group_id = module.sg_back.security_group_id
    },
  ]

  egress_rules = ["all-all"]

  tags = var.tags
}

#-------------------------------------------------
#               ===== [ VPC ] =====               
#-------------------------------------------------

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "3.2"

  name                 = "main"
  cidr                 = var.vpc_cidr
  azs                  = data.aws_availability_zones.available.names
  public_subnets       = [var.public_subnet_cidr]
  private_subnets      = var.private_subnets_cidr
  enable_nat_gateway   = true
  single_nat_gateway   = true
  enable_dns_hostnames = true

  tags = var.tags
}
