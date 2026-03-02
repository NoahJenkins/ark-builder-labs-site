#!/usr/bin/env bash
set -euo pipefail

OWNER="${1:-NoahJenkins}"
REPO="${2:-ark-builder-labs-site}"
BRANCH="${3:-main}"
CONFIG_PATH=".github/branch-protection/main.json"

if ! command -v gh >/dev/null 2>&1; then
  echo "Error: gh CLI is required but not installed." >&2
  exit 1
fi

if [[ ! -f "$CONFIG_PATH" ]]; then
  echo "Error: missing branch protection config at $CONFIG_PATH" >&2
  exit 1
fi

echo "Applying branch protection config from $CONFIG_PATH to ${OWNER}/${REPO}:${BRANCH} ..."

gh api \
  --method PUT \
  --header "Accept: application/vnd.github+json" \
  "repos/${OWNER}/${REPO}/branches/${BRANCH}/protection" \
  --input "$CONFIG_PATH" >/dev/null

echo "Branch protection applied. Verifying applied configuration ..."

protection_json=$(gh api --header "Accept: application/vnd.github+json" "repos/${OWNER}/${REPO}/branches/${BRANCH}/protection")

required_checks=$(echo "$protection_json" | jq -r '.required_status_checks.contexts | join("\n")')
expected_checks=$(jq -r '.required_status_checks.contexts[]' "$CONFIG_PATH")

if [[ "$required_checks" != "$expected_checks" ]]; then
  echo "Verification failed: required checks do not match config." >&2
  echo "Expected:" >&2
  echo "$expected_checks" >&2
  echo "Actual:" >&2
  echo "$required_checks" >&2
  exit 1
fi

required_review_count=$(echo "$protection_json" | jq -r '.required_pull_request_reviews.required_approving_review_count')
if [[ "$required_review_count" != "1" ]]; then
  echo "Verification failed: expected required_approving_review_count=1, got ${required_review_count}." >&2
  exit 1
fi

enforce_admins_enabled=$(echo "$protection_json" | jq -r '.enforce_admins.enabled')
if [[ "$enforce_admins_enabled" != "false" ]]; then
  echo "Verification failed: expected enforce_admins.enabled=false, got ${enforce_admins_enabled}." >&2
  exit 1
fi

echo "Verification passed for ${OWNER}/${REPO}:${BRANCH}"
echo "- Required checks: TypeScript & Lint, Jest Tests, Build Check, Playwright Tests"
echo "- Required approving reviews: 1"
echo "- Admin bypass enabled: true (enforce_admins=false)"
