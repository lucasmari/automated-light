provider "aws" {
  region = var.region
}

resource "random_uuid" "randomid" {}

#-------------------------------------------------
#               ===== [ ECR ] =====               
#-------------------------------------------------

resource "aws_ecr_repository" "repo" {
  name                 = "automated-light"
  image_tag_mutability = "IMMUTABLE"
  encryption_configuration {
    encryption_type = "KMS"
  }
  image_scanning_configuration {
    scan_on_push = true
  }

  tags = var.tags
}

#-------------------------------------------------
#               ===== [ KMS ] =====               
#-------------------------------------------------

resource "aws_kms_key" "this" {
  description             = "This key is used to encrypt bucket objects"
  deletion_window_in_days = 10
  enable_key_rotation     = true
}

#-------------------------------------------------
#               ===== [ S3 ] =====               
#-------------------------------------------------

resource "aws_s3_bucket" "terraform_state" {
  bucket        = random_uuid.randomid.result
  force_destroy = true
  logging {
    enabled = true
  }
  versioning {
    enabled = true
  }
  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        kms_master_key_id = aws_kms_key.mykey.arn
        sse_algorithm     = "aws:kms"
      }
    }
  }

  tags = var.tags
}
