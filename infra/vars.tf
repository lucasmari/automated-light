variable "region" {
  default = "us-east-1"
}

variable "user" {
  default = "circleci-user"
}

variable "vpc_cidr" {
  description = "CIDR for the whole VPC"
  default     = "10.0.0.0/16"
}

variable "all_cidr" {
  description = "CIDR for the internet"
  default     = "0.0.0.0/0"
}

variable "public_subnet_cidr" {
  description = "CIDR for public subnet"
  default     = "10.0.1.0/24"
}

variable "private_subnets_cidr" {
  description = "CIDRs for private subnets"
  default     = ["10.0.2.0/24", "10.0.3.0/24"]
}

variable "account_id" {}
