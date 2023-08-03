# create this manually
data "aws_secretsmanager_secret_version" "secrets" {
  secret_id = "opensearch_secrets"
}

locals {
  opensearch_secrets = jsondecode(
    data.aws_secretsmanager_secret_version.secrets.secret_string
  )
}