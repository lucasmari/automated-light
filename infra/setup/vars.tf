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
#               ===== [ S3 ] =====               
#-------------------------------------------------

variable "bucket_name" {
  default = "automated-light-state"
}
