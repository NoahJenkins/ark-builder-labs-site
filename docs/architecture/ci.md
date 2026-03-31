# CI and Branch Protection Architecture

Last updated: 2026-03-31

## CI Required Checks

Main branch protection requires these exact GitHub Actions job names from `.github/workflows/ci.yaml`:
- `TypeScript & Lint`
- `Jest Tests`
- `Build Check`
- `Playwright Tests`

## Dependabot Auto-Merge Flow

Workflow: `.github/workflows/dependabot-auto-merge.yml`

Trigger:
- `pull_request_target` on `opened`, `reopened`, `synchronize`, `ready_for_review`

Eligibility gates:
- actor is `dependabot[bot]`
- PR author is `dependabot[bot]`
- base branch is `main`
- PR is not draft
- ecosystem is `npm`, `npm_and_yarn`, or `github-actions`
- update type is `version-update:semver-patch`, `version-update:semver-minor`, or `version-update:semver-major`
- changed files are limited to dependency/workflow allowlist

Eligible behavior:
- auto-approve PR
- enable native GitHub auto-merge with `squash`
- fail early if repository-level auto-merge prerequisites drift

Repository prerequisites:
- repository `allow_auto_merge == true`
- repository `allow_squash_merge == true`
- Actions workflow permissions `can_approve_pull_request_reviews == true`

Configuration source of truth:
- `.github/repository-settings/repository.json`
- `.github/repository-settings/workflow-permissions.json`

Local apply + verify:
- `scripts/apply-repository-settings.sh`

Workflow token permissions:
- `contents: write`
- `pull-requests: write`

## Dependabot Behind Refresh

Workflow: `.github/workflows/dependabot-behind-refresh.yml`

Trigger:
- scheduled every 6 hours
- manual `workflow_dispatch`

Behavior:
- finds open Dependabot PRs against `main`
- filters to PRs with native auto-merge already enabled
- updates branches whose mergeable state is `behind` so strict required checks can re-run

## Repository Settings Health

Workflow: `.github/workflows/repository-settings-health.yml`

Trigger:
- daily schedule
- manual `workflow_dispatch`

Behavior:
- if `REPO_ADMIN_TOKEN` is configured, re-applies and verifies `.github/repository-settings/*` through `scripts/apply-repository-settings.sh`
- if `REPO_ADMIN_TOKEN` is not configured, succeeds with a notice explaining that admin-only verification was skipped

## Branch Protection Apply + Verify

Configuration source of truth:
- `.github/branch-protection/main.json`

Automation:
- `.github/workflows/branch-protection.yml` (manual dispatch)
- `scripts/apply-branch-protection.sh`

Verification checks:
- required checks exactly match configured contexts
- `required_approving_review_count == 1`
- `enforce_admins.enabled == false`

## Administrator Bypass Policy

`enforce_admins` is intentionally set to `false` to preserve administrator direct push workflow while retaining required checks and review requirements for standard contribution paths.
