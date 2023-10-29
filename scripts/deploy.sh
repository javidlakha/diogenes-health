#!/bin/bash

source "$1"

# Install Lambda base image
cd lambdas/base || exit 1
docker build -t base . || exit 1
cd ../..
BASE_HASH=$(docker image ls -q base)
export BASE_HASH

# Deployment
cdk deploy --profile $AWS_PROFILE --all --require-approval never --outputs-file "./cdk.out/$1.json" || exit 1
python3 scripts/update_environment.py "./cdk.out/$1.json" "./client/$1" && cd client && yarn build && cd .. || exit 1

# Use updated output variables from CDK
cdk deploy --profile $AWS_PROFILE Website
