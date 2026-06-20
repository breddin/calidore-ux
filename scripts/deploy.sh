#!/usr/bin/env bash
#
# One-shot deploy: publish the SAM Anthropic-proxy stack, capture its
# ApiUrl output, push that into the Amplify app as VITE_API_URL, and
# (optionally) kick off a frontend build.
#
# Prereqs: aws cli v2, sam cli, jq, and the Anthropic key already stored
# in Secrets Manager (run scripts/migrate-secret.sh once if it isn't).
#
# Usage:
#   scripts/deploy.sh                 # deploy backend + set env var
#   scripts/deploy.sh --release       # also trigger an Amplify build
#
set -euo pipefail

# ── Config (override via environment) ─────────────────────────────────
AWS_PROFILE="${AWS_PROFILE:-bennie}"
STACK_NAME="${STACK_NAME:-calidore-ux-proxy}"
LAMBDA_REGION="${LAMBDA_REGION:-us-east-1}"
AMPLIFY_APP_ID="${AMPLIFY_APP_ID:-d3iss5fysy55r}"
AMPLIFY_BRANCH="${AMPLIFY_BRANCH:-main}"
AMPLIFY_REGION="${AMPLIFY_REGION:-us-east-1}"

export AWS_PROFILE

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

for bin in aws sam jq; do
  command -v "$bin" >/dev/null 2>&1 || { echo "error: '$bin' is required but not installed" >&2; exit 1; }
done

# ── 1. Build & deploy the Lambda proxy ────────────────────────────────
echo "==> sam build && sam deploy ($STACK_NAME, $LAMBDA_REGION)"
( cd "$ROOT/lambda" && sam build && sam deploy --no-confirm-changeset )

# ── 2. Capture the ApiUrl stack output ────────────────────────────────
echo "==> reading ApiUrl from stack outputs"
API_URL="$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$LAMBDA_REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='ApiUrl'].OutputValue" \
  --output text)"

if [[ -z "$API_URL" || "$API_URL" == "None" ]]; then
  echo "error: could not read ApiUrl from stack '$STACK_NAME'" >&2
  exit 1
fi
echo "    ApiUrl = $API_URL"

# ── 3. Merge VITE_API_URL into the Amplify branch env vars ────────────
# Branch-level vars override app-level. We read the current branch vars,
# merge in VITE_API_URL (preserving any others), and write them back so
# nothing is clobbered.
echo "==> setting VITE_API_URL on Amplify branch '$AMPLIFY_BRANCH'"
CURRENT_VARS="$(aws amplify get-branch \
  --app-id "$AMPLIFY_APP_ID" \
  --branch-name "$AMPLIFY_BRANCH" \
  --region "$AMPLIFY_REGION" \
  --query "branch.environmentVariables" \
  --output json 2>/dev/null || echo '{}')"

MERGED_VARS="$(echo "$CURRENT_VARS" | jq -c --arg url "$API_URL" '. + {VITE_API_URL: $url}')"

aws amplify update-branch \
  --app-id "$AMPLIFY_APP_ID" \
  --branch-name "$AMPLIFY_BRANCH" \
  --region "$AMPLIFY_REGION" \
  --environment-variables "$MERGED_VARS" \
  >/dev/null
echo "    VITE_API_URL set"

# ── 4. Optionally trigger a frontend build ────────────────────────────
if [[ "${1:-}" == "--release" ]]; then
  echo "==> triggering Amplify release build"
  JOB_ID="$(aws amplify start-job \
    --app-id "$AMPLIFY_APP_ID" \
    --branch-name "$AMPLIFY_BRANCH" \
    --region "$AMPLIFY_REGION" \
    --job-type RELEASE \
    --query "jobSummary.jobId" \
    --output text)"
  echo "    started Amplify job $JOB_ID"
else
  echo "==> skipping Amplify build (pass --release to trigger one, or git push to '$AMPLIFY_BRANCH')"
fi

echo "==> done. Health check: curl ${API_URL}/"
