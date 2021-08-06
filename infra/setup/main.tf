provider "aws" {
  region = var.region
}

resource "random_uuid" "randomid" {}

#-------------------------------------------------
#               ===== [ S3 ] =====               
#-------------------------------------------------

resource "aws_s3_bucket" "terraform_state" {
  bucket        = random_uuid.randomid.result
  force_destroy = true
  versioning {
    enabled = true
  }
  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
}

#-------------------------------------------------
#               ===== [ ECR ] =====               
#-------------------------------------------------

resource "aws_ecr_repository" "repo" {
  name                 = "automated-light"
  image_tag_mutability = "MUTABLE"

  tags = {
    project = "automated-light"
  }
}
