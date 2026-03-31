#!/usr/bin/env bash
set -euo pipefail

OWNER="${1:-NoahJenkins}"
REPO="${2:-ark-builder-labs-site}"
REPO_CONFIG_PATH=".github/repository-settings/repository.json"
WORKFLOW_CONFIG_PATH=".github/repository-settings/workflow-permissions.json"

if ! command -v gh >/dev/null 2>&1; then
  echo "Error: gh CLI is required but not installed." >&2
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "Error: jq is required but not installed." >&2
  exit 1
fi

if [[ ! -f "$REPO_CONFIG_PATH" ]]; then
  echo "Error: missing repository settings config at $REPO_CONFIG_PATH" >&2
  exit 1
fi

if [[ ! -f "$WORKFLOW_CONFIG_PATH" ]]; then
  echo "Error: missing workflow permissions config at $WORKFLOW_CONFIG_PATH" >&2
  exit 1
fi

echo "Applying repository settings from $REPO_CONFIG_PATH to ${OWNER}/${REPO} ..."

gh api \
  --method PATCH \
  --header "Accept: application/vnd.github+json" \
  "repos/${OWNER}/${REPO}" \
  --input "$REPO_CONFIG_PATH" >/dev/null

echo "Applying workflow permissions from $WORKFLOW_CONFIG_PATH to ${OWNER}/${REPO} ..."

gh api \
  --method PUT \
  --header "Accept: application/vnd.github+json" \
  "repos/${OWNER}/${REPO}/actions/permissions/workflow" \
  --input "$WORKFLOW_CONFIG_PATH" >/dev/null

echo "Repository settings applied. Verifying applied configuration ..."

repo_json=$(gh api --header "Accept: application/vnd.github+json" "repos/${OWNER}/${REPO}")
workflow_json=$(gh api --header "Accept: application/vnd.github+json" "repos/${OWNER}/${REPO}/actions/permissions/workflow")

expected_allow_auto_merge=$(jq -r '.allow_auto_merge' "$REPO_CONFIG_PATH")
actual_allow_auto_merge=$(echo "$repo_json" | jq -r '.allow_auto_merge')
if [[ "$actual_allow_auto_merge" != "$expected_allow_auto_merge" ]]; then
  echo "Verification failed: expected allow_auto_merge=${expected_allow_auto_merge}, got ${actual_allow_auto_merge}." >&2
  exit 1
fi

expected_allow_update_branch=$(jq -r '.allow_update_branch' "$REPO_CONFIG_PATH")
actual_allow_update_branch=$(echo "$repo_json" | jq -r '.allow_update_branch')
if [[ "$actual_allow_update_branch" != "$expected_allow_update_branch" ]]; then
  echo "Verification failed: expected allow_update_branch=${expected_allow_update_branch}, got ${actual_allow_update_branch}." >&2
  exit 1
fi

expected_allow_squash_merge=$(jq -r '.allow_squash_merge' "$REPO_CONFIG_PATH")
actual_allow_squash_merge=$(echo "$repo_json" | jq -r '.allow_squash_merge')
if [[ "$actual_allow_squash_merge" != "$expected_allow_squash_merge" ]]; then
  echo "Verification failed: expected allow_squash_merge=${expected_allow_squash_merge}, got ${actual_allow_squash_merge}." >&2
  exit 1
fi

expected_default_workflow_permissions=$(jq -r '.default_workflow_permissions' "$WORKFLOW_CONFIG_PATH")
actual_default_workflow_permissions=$(echo "$workflow_json" | jq -r '.default_workflow_permissions')
if [[ "$actual_default_workflow_permissions" != "$expected_default_workflow_permissions" ]]; then
  echo "Verification failed: expected default_workflow_permissions=${expected_default_workflow_permissions}, got ${actual_default_workflow_permissions}." >&2
  exit 1
fi

expected_can_approve=$(jq -r '.can_approve_pull_request_reviews' "$WORKFLOW_CONFIG_PATH")
actual_can_approve=$(echo "$workflow_json" | jq -r '.can_approve_pull_request_reviews')
if [[ "$actual_can_approve" != "$expected_can_approve" ]]; then
  echo "Verification failed: expected can_approve_pull_request_reviews=${expected_can_approve}, got ${actual_can_approve}." >&2
  exit 1
fi

echo "Verification passed for ${OWNER}/${REPO}"
echo "- allow_auto_merge: ${actual_allow_auto_merge}"
echo "- allow_update_branch: ${actual_allow_update_branch}"
echo "- allow_squash_merge: ${actual_allow_squash_merge}"
echo "- default_workflow_permissions: ${actual_default_workflow_permissions}"
echo "- can_approve_pull_request_reviews: ${actual_can_approve}"
