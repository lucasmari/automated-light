output "region" {
  value = var.region
}

output "frontend_public_dns" {
  value = module.ec2_frontend.public_dns
}
