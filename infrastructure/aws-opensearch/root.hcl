locals {
  tfc_hostname     = "app.terraform.io"
  tfc_organization = "bcgov"
  environment      = reverse(split("/", get_terragrunt_dir()))[0]
}

inputs = {
  environment = local.environment
}

generate "remote_state" {
  path      = "backend.tf"
  if_exists = "overwrite"
  contents  = <<EOF
terraform {
  backend "s3" {
    bucket         = "bcparks-opensearch-terraform-remote-state-${local.environment}"
    key            = "remote.tfstate-admin"                              # Path and name of the state file within the bucket
    region         = "ca-central-1"                                      # AWS region where the bucket is located
    use_lockfile    = true
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