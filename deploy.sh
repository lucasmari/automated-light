#!/bin/bash
set -euo pipefail

NC='\e[0m'
CYAN='\e[0;36m'

# Setup
echo -e "\n${CYAN}Setting up...\n${NC}"
cd infra/setup
terraform init -reconfigure && terraform apply -auto-approve
cd ../..

# Build containers and push to ECR
echo -e "\n${CYAN}Building containers and pushing to ECR...\n${NC}"
export TF_VAR_account_id
TF_VAR_account_id=$(aws sts get-caller-identity | jq -r '.Account')
aws ecr get-login-password --region us-east-1 \
| docker login --username AWS --password-stdin "$TF_VAR_account_id".dkr.ecr.us-east-1.amazonaws.com
docker build -t "$TF_VAR_account_id".dkr.ecr.us-east-1.amazonaws.com/automated-light:node frontend/
docker push "$TF_VAR_account_id".dkr.ecr.us-east-1.amazonaws.com/automated-light:node
docker build -t "$TF_VAR_account_id".dkr.ecr.us-east-1.amazonaws.com/automated-light:ruby backend/
docker push "$TF_VAR_account_id".dkr.ecr.us-east-1.amazonaws.com/automated-light:ruby
docker build -t "$TF_VAR_account_id".dkr.ecr.us-east-1.amazonaws.com/automated-light:mongo database/
docker push "$TF_VAR_account_id".dkr.ecr.us-east-1.amazonaws.com/automated-light:mongo
docker build -t "$TF_VAR_account_id".dkr.ecr.us-east-1.amazonaws.com/automated-light:mongo-seed -f database/seed/Dockerfile.prod database/seed
docker push "$TF_VAR_account_id".dkr.ecr.us-east-1.amazonaws.com/automated-light:mongo-seed

# Deploy
echo -e "\n${CYAN}Deploying...\n${NC}"
cd infra
terraform init -reconfigure && terraform apply -auto-approve