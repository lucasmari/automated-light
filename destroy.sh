#!/bin/bash
set -euo pipefail

NC='\e[0m'
GREEN='\e[0;32m'
CYAN='\e[0;36m'

# Destroy
echo -e "\n${CYAN}Destroying...\n${NC}"
export TF_VAR_account_id=$(aws sts get-caller-identity | jq -r '.Account')
cd infra
terraform destroy -auto-approve
cd setup
terraform destroy -auto-approve