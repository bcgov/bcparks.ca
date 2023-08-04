locals {
  tfc_hostname     = "app.terraform.io"
  tfc_organization = "bcgov"
  environment      = reverse(split("/", get_terragrunt_dir()))[0]
}

generate "remote_state" {
  path      = "backend.tf"
  if_exists = "overwrite"
  contents  = <<EOF
terraform {
  backend "s3" {
    bucket         = "bcparks-opensearch-${local.environment}-terraform-remote-state"
    key            = "remote.tfstate-admin"                              # Path and name of the state file within the bucket
    region         = "ca-central-1"                                      # AWS region where the bucket is located
    dynamodb_table = "bcparks-opensearch-${local.environment}-terraform-remote-state-lock"      # Replace with either generated or custom DynamoDB table name
    encrypt        = true                                                # Enable encryption for the state file
  }
}
EOF
}

generate "provider" {
  path      = "provider.tf"
  if_exists = "overwrite"
  contents  = <<EOF
provider "aws" {
  region  = var.aws_region
}
EOF
}