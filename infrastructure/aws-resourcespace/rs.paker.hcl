// Create ResourceSpace AMI using Packer
// Base Linux distro Ubuntu 20.04  (64-bit x86)
// Reference AMI Builder (EBS Backed) https://www.packer.io/docs/builders/amazon/ebs

source "amazon-ebs" "ResourceSpace"{
    ami_name = "re-vm-v1"
    source_ami = "ami-0801628222e2e96d6"
    instance_type = "t2.large"
    subnet_id = "subnet-048e25be105ae01d3"
    ssh_username = "ubuntu"
}