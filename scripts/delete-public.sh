#!/usr/bin/env bash
set -euo pipefail

STACK_NAME="${STACK_NAME:-last-mile-food-rescue-public}"
REGION="${AWS_REGION:-${AWS_DEFAULT_REGION:-us-east-2}}"

command -v aws >/dev/null || { echo "aws CLI is required"; exit 1; }
command -v sam >/dev/null || { echo "AWS SAM CLI is required"; exit 1; }

frontend_bucket="$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='FrontendBucketName'].OutputValue" \
  --output text 2>/dev/null || true)"

if [[ -n "$frontend_bucket" && "$frontend_bucket" != "None" ]]; then
  aws s3 rm "s3://${frontend_bucket}" --recursive --region "$REGION"
fi

sam delete \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --no-prompts
