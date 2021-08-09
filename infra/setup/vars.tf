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
