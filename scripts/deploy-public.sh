#!/usr/bin/env bash
set -euo pipefail

STACK_NAME="${STACK_NAME:-last-mile-food-rescue-public}"
REGION="${AWS_REGION:-${AWS_DEFAULT_REGION:-us-east-2}}"
API_STAGE_NAME="${API_STAGE_NAME:-prod}"

command -v aws >/dev/null || { echo "aws CLI is required"; exit 1; }
command -v sam >/dev/null || { echo "AWS SAM CLI is required"; exit 1; }
command -v mvn >/dev/null || { echo "Maven is required"; exit 1; }
command -v npm >/dev/null || { echo "npm is required"; exit 1; }

parameters=(
  "SpringProfilesActive=${SPRING_PROFILES_ACTIVE:-demo}"
  "DeployDatabase=false"
  "AllowedCorsOrigin=${ALLOWED_CORS_ORIGIN:-*}"
  "ApiStageName=${API_STAGE_NAME}"
)

if [[ "${DEPLOY_DATABASE:-false}" == "true" ]]; then
  database_password="${DATABASE_PASSWORD:-}"
  if [[ -z "$database_password" ]]; then
    command -v openssl >/dev/null || { echo "openssl is required to generate DATABASE_PASSWORD"; exit 1; }
    database_password="$(openssl rand -base64 32 | tr -dc 'A-Za-z0-9' | head -c 24)"
  fi

  parameters=(
    "SpringProfilesActive=${SPRING_PROFILES_ACTIVE:-default}"
    "DeployDatabase=true"
    "DatabaseName=${DATABASE_NAME:-food_rescue}"
    "DatabaseUsername=${DATABASE_USERNAME:-food_rescue}"
    "DatabasePassword=${database_password:-food_rescue}"
    "DatabaseInstanceClass=${DATABASE_INSTANCE_CLASS:-db.t4g.micro}"
    "DatabaseAllocatedStorage=${DATABASE_ALLOCATED_STORAGE:-20}"
    "AllowedCorsOrigin=${ALLOWED_CORS_ORIGIN:-*}"
    "ApiStageName=${API_STAGE_NAME}"
  )
elif [[ -n "${DATABASE_URL:-}" ]]; then
  : "${DATABASE_USERNAME:?DATABASE_USERNAME is required when DATABASE_URL is set}"
  : "${DATABASE_PASSWORD:?DATABASE_PASSWORD is required when DATABASE_URL is set}"
  parameters=(
    "SpringProfilesActive=${SPRING_PROFILES_ACTIVE:-default}"
    "DeployDatabase=false"
    "DatabaseUrl=${DATABASE_URL}"
    "DatabaseUsername=${DATABASE_USERNAME}"
    "DatabasePassword=${DATABASE_PASSWORD}"
    "AllowedCorsOrigin=${ALLOWED_CORS_ORIGIN:-*}"
    "ApiStageName=${API_STAGE_NAME}"
  )
fi

sam build
sam deploy \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --capabilities CAPABILITY_IAM \
  --resolve-s3 \
  --no-confirm-changeset \
  --parameter-overrides "${parameters[@]}"

api_base_url="$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='ApiBaseUrl'].OutputValue" \
  --output text)"

frontend_bucket="$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='FrontendBucketName'].OutputValue" \
  --output text)"

distribution_id="$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='FrontendDistributionId'].OutputValue" \
  --output text)"

frontend_url="$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='FrontendUrl'].OutputValue" \
  --output text)"

(
  cd frontend
  npm install
  VITE_API_BASE_URL="$api_base_url" npm run build
)

aws s3 sync frontend/dist "s3://${frontend_bucket}" --delete --region "$REGION"
aws cloudfront create-invalidation --distribution-id "$distribution_id" --paths "/*" >/dev/null

cat <<EOF

Deployment complete.

Frontend: ${frontend_url}
API:      ${api_base_url}

CloudFront can take a few minutes to serve fresh files worldwide.
EOF
