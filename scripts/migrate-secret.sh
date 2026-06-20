#!/usr/bin/env bash
#
# One-time migration: move the Anthropic API key from SSM Parameter Store
# (/calidore-ux/anthropic-api-key) into Secrets Manager
# (calidore-ux/anthropic-api-key), which the Lambda now reads.
#
# Source precedence:
#   1. $ANTHROPIC_API_KEY if set in the environment
#   2. otherwise, the existing SSM SecureString parameter
#
# Creates the secret if absent, updates it if it already exists. The old
# SSM parameter is left in place; delete it manually once the deployed
# Lambda is confirmed working (command printed at the end).
#
# Usage:
#   scripts/migrate-secret.sh
#   ANTHROPIC_API_KEY=sk-ant-... scripts/migrate-secret.sh
#
set -euo pipefail

AWS_PROFILE="${AWS_PROFILE:-bennie}"
REGION="${LAMBDA_REGION:-us-east-1}"
SSM_NAME="${SSM_NAME:-/calidore-ux/anthropic-api-key}"
SECRET_NAME="${SECRET_NAME:-calidore-ux/anthropic-api-key}"
export AWS_PROFILE

command -v aws >/dev/null 2>&1 || { echo "error: 'aws' is required" >&2; exit 1; }

# ── Resolve the key value ─────────────────────────────────────────────
KEY="${ANTHROPIC_API_KEY:-}"
if [[ -z "$KEY" ]]; then
  echo "==> reading key from SSM $SSM_NAME"
  KEY="$(aws ssm get-parameter \
    --name "$SSM_NAME" \
    --with-decryption \
    --region "$REGION" \
    --query "Parameter.Value" \
    --output text 2>/dev/null || true)"
fi

if [[ -z "$KEY" || "$KEY" == "None" ]]; then
  echo "error: no key found. Set ANTHROPIC_API_KEY or ensure $SSM_NAME exists." >&2
  exit 1
fi

# ── Create or update the secret ───────────────────────────────────────
if aws secretsmanager describe-secret --secret-id "$SECRET_NAME" --region "$REGION" >/dev/null 2>&1; then
  echo "==> updating existing secret $SECRET_NAME"
  aws secretsmanager put-secret-value \
    --secret-id "$SECRET_NAME" \
    --secret-string "$KEY" \
    --region "$REGION" >/dev/null
else
  echo "==> creating secret $SECRET_NAME"
  aws secretsmanager create-secret \
    --name "$SECRET_NAME" \
    --description "Anthropic API key for calidore-ux proxy Lambda" \
    --secret-string "$KEY" \
    --region "$REGION" >/dev/null
fi

echo "==> done. Secret '$SECRET_NAME' is set in $REGION."
echo "    After verifying the deployed Lambda works, remove the old SSM param:"
echo "    aws ssm delete-parameter --name '$SSM_NAME' --region '$REGION' --profile '$AWS_PROFILE'"
