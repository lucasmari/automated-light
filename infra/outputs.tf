output "region" {
  value = var.region
}

output "front_public_dns" {
  value = module.ec2_front.public_dns
}
