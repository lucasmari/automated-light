variable "account_id" {}

variable "region" {
  default = "us-east-1"
}

variable "tags" {
  default = {
    Environment = "prod",
    Project     = "automated-light",
    Terraform   = true
  }
}

#-------------------------------------------------
#               ===== [ VPC ] =====               
#-------------------------------------------------

variable "all_cidr" {
  description = "CIDR for the internet"
  default     = "0.0.0.0/0"
}

variable "private_subnets_cidr" {
  description = "CIDRs for private subnets"
  default     = ["10.0.2.0/24"]
}

variable "public_subnet_cidr" {
  description = "CIDR for public subnet"
  default     = "10.0.1.0/24"
}

variable "vpc_cidr" {
  description = "CIDR for the whole VPC"
  default     = "10.0.0.0/16"
}
