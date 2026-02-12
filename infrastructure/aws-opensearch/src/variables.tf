variable "instance_type" {
  description = "Type of opensearch instance"
  default     = "t3.small.search"
}

variable "instance_count" {
  description = "Number of opensearch instances"
  default     = 1
}

variable "aws_region" {
  description = "The AWS region things are created in"
  default     = "ca-central-1"
}

variable "environment" {
  description = "dev, test or prod"
  default     = "dev"
}