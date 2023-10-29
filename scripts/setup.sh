#!/bin/bash

# Install Python dependencies
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install -e lambdas/base

# Install TypeScript dependencies
yarn install
cd client
yarn install

# Create a build directory
mkdir -p build

cd ..

# Set up git hooks
mkdir -p .git/hooks
echo $"#/bin/sh\nblack ."> .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
