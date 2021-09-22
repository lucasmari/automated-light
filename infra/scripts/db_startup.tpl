#!/bin/bash -x

# Logging
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1

# Update repositories
sudo apt-get update

# Install and setup Docker
curl -fsSL https://get.docker.com -o get-docker.sh
DRY_RUN=1 sudo sh ./get-docker.sh
sudo systemctl start docker

# Install AWS cli
sudo apt-get install unzip -y
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip -q awscliv2.zip
sudo ./aws/install

# Login to ECR, pull image and run container
aws ecr get-login-password --region us-east-1 \
| sudo docker login --username AWS --password-stdin "${account_id}".dkr.ecr.us-east-1.amazonaws.com
sudo docker pull "${account_id}".dkr.ecr.us-east-1.amazonaws.com/automated-light:mongo
sudo docker run -p '27017:27017' -d "${account_id}".dkr.ecr.us-east-1.amazonaws.com/automated-light:mongo