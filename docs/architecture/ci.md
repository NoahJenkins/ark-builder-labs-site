# CI and Branch Protection Architecture

Last updated: 2026-03-02

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

Workflow token permissions:
- `contents: read`
- `pull-requests: write`

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
