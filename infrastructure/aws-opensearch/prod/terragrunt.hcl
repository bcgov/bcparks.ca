terraform {
  source = "..//src"
}

include {
  path = find_in_parent_folders("root.hcl")
}

locals {
  instance_type = "t3.medium.elasticsearch"
  instance_count = 3
}

inputs = {
  instance_type  = local.instance_type
  instance_count = local.instance_count
}