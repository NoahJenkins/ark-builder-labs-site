# CI and Branch Protection Architecture

Last updated: 2026-08-24

## CI Required Checks

Main branch protection requires these exact GitHub Actions job names from `.github/workflows/ci.yaml`:
- `TypeScript & Lint`
- `Jest Tests`
- `Build Check`
- `Playwright Tests`

Branch protection requires strict current-base checks. Dependabot native auto-merge therefore waits until all four checks pass against the current `main` branch.

## Dependabot Update Grouping

Configuration: `.github/dependabot.yml`

- `npm-patch-minor` groups all npm patch and minor version updates.
- `npm-security` groups npm security updates with `applies-to: security-updates`.
- `github-actions-patch-minor` groups all GitHub Actions patch and minor version updates.
- `github-actions-security` groups GitHub Actions security updates with `applies-to: security-updates`.
- Major version updates remain standalone.
- No Dependabot reviewer, assignee, or ignore rules are configured.

Security grouping changes pull request packaging. It does not add an ignore rule or routine schedule gate for urgent fixes.

## Dependabot Auto-Merge Flow

Workflow: `.github/workflows/dependabot-auto-merge.yml`

Trigger:
- `pull_request_target` on `opened`, `reopened`, `synchronize`, `ready_for_review`

Eligibility gates:
- actor is `dependabot[bot]`
- PR author is `dependabot[bot]`
- base branch is `main`
- PR is not draft
- ecosystem metadata is `npm`, `npm_and_yarn`, or `github_actions`
- update type is `version-update:semver-patch`, `version-update:semver-minor`, or `version-update:semver-major`
- changed files are limited to dependency/workflow allowlist

Eligible behavior:
- auto-approve PR
- enable native GitHub auto-merge with `squash`
- fail early if repository-level auto-merge prerequisites drift
- wait for `TypeScript & Lint`, `Jest Tests`, `Build Check`, and `Playwright Tests` to pass against the current `main` base through branch protection
- leave failed, conflicting, or changed-file-disallowed updates open for manual investigation

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

Job timeout: 5 minutes.

## Dependabot Behind Refresh

Workflow: `.github/workflows/dependabot-behind-refresh.yml`

Trigger:
- `push` to `main`
- merged PRs targeting `main` via `pull_request_target: closed`
- daily fallback at `20:23 UTC` (`23 20 * * *`)
- manual `workflow_dispatch`

Behavior:
- finds open Dependabot PRs against `main`
- waits briefly after `main` advances so GitHub can recalculate PR mergeability
- uses `REPO_ADMIN_TOKEN` when configured because the default workflow token cannot reliably call the update-branch API on Dependabot-owned branches
- filters to PRs with native auto-merge already enabled
- refreshes only PRs whose latest checks are currently green
- skips PRs with real failed or still-pending checks to avoid re-running known-bad dependency updates on every merge to `main`
- retries when GitHub initially reports `mergeable_state=unknown`
- updates branches whose mergeable state is `behind` so strict required checks can re-run immediately after `main` advances
- handles merged-PR events because Dependabot auto-merges did not reliably produce follow-on `push` workflow runs on `main` during the 2026-03-31 investigation
- fails the job when an update-branch request fails, so recovery failures remain visible

Job timeout: 5 minutes.

The daily schedule remains a fallback because the August 2026 review found 96 scheduled runs, one `push` run, and one `pull_request_target` run. Dependabot bot merges did not trigger the event paths in that sample; queued updates recovered through Dependabot self-rebases. This evidence supports reducing the schedule, but not removing the refresh mechanism.

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
