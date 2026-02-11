data "aws_region" "current" {}
data "aws_caller_identity" "current" {}

resource "aws_iam_service_linked_role" "es" {
	aws_service_name = "es.amazonaws.com"
}

resource "aws_opensearch_domain" "bcparks-opensearch" {
	domain_name	= "bcparks-opensearch"
	engine_version = "OpenSearch_2.7"
	
	cluster_config {
		instance_count = var.instance_count
		instance_type = var.instance_type
		zone_awareness_enabled = false
	}

	access_policies = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "*"
      },
      "Action": "es:*",
      "Resource": "arn:aws:es:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:domain/bcparks-opensearch/*",
      "Condition": {
        "IpAddress": {
          "aws:SourceIp": [
            "${local.opensearch_secrets.openshift_silver_ip}",
            "${local.opensearch_secrets.oxd_vpn_ip}"
          ]
        }
      }
    }
  ]
}
EOF
	
	node_to_node_encryption {
		enabled = true
	}
	
	encrypt_at_rest {
		enabled = true
	}
	
	domain_endpoint_options {
		enforce_https = true
		tls_security_policy = "Policy-Min-TLS-1-2-2019-07"
	}
	
	ebs_options {
		ebs_enabled = true
		volume_size = 10
		volume_type = "gp3"
		throughput = 125
	}
	
	advanced_security_options {
		enabled = true
		internal_user_database_enabled = true
		master_user_options {
			master_user_name = local.opensearch_secrets.master_username
			master_user_password = local.opensearch_secrets.master_password
		}
	}
	
	tags = {
		Domain = "bcparks-opensearch"
	}
	
}
