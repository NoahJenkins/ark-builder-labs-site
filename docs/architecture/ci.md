# CI and Branch Protection Architecture

Last updated: 2026-10-25

## CI Required Checks

Main branch protection requires these exact GitHub Actions job names from `.github/workflows/ci.yaml`:
- `TypeScript & Lint`
- `Jest Tests`
- `Build Check`
- `Playwright Tests`

Branch protection requires strict current-base checks. Dependabot native auto-merge therefore waits until all four checks pass against the current `main` branch.

## CI Install Limits and Caches

- TypeScript/lint and Jest jobs stop after 10 minutes. Build and Playwright jobs stop after 15 minutes.
- Each package, browser, or Linux system-library install stops after 5 minutes. Node/pnpm setup stops after 3 minutes; explicit cache operations stop after 2 minutes. An install failure fails the job; there is no fallback install or automatic retry.
- Every job uses the existing pnpm store cache and a frozen lockfile with `--prefer-offline`. This reuses downloaded packages while preserving lockfile validation and required lifecycle scripts; `node_modules` is not cached.
- Playwright browser binaries use an exact OS, architecture, and `pnpm-lock.yaml` cache key. A hit skips browser downloads. A miss installs and caches the configured browsers. Broad restore keys are prohibited because a different lockfile can require different browser builds.
- Linux system libraries are not part of the browser cache. They install on both cache hits and misses under the same 5-minute limit.
- New commits cancel superseded CI runs. A setup timeout requires investigation before another run; do not retry it automatically or increase the limit to obtain a green result.

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
- `pull_request` on `opened`, `reopened`, `synchronize`, `ready_for_review` for `main`
- pull request author is `dependabot[bot]`
- pull request is not a draft

Eligibility, from `dependabot/fetch-metadata` (pinned by commit SHA):
- semver patch and semver minor updates
- every GitHub Actions update, including majors
- Dependabot security updates, when the metadata group, GHSA/alert fields, or Dependabot's own "security fix" sentence marks them
- semver-major npm updates stay open and receive the `needs-review` label

Eligible behavior:
- enable native GitHub auto-merge with `squash`
- do not approve the pull request and do not bypass required checks
- wait for `TypeScript & Lint`, `Jest Tests`, `Build Check`, and `Playwright Tests` to pass against the current `main` base through branch protection

Repository prerequisites, tracked separately from this workflow:
- repository `allow_auto_merge == true`
- repository `allow_squash_merge == true`

Workflow token permissions:
- `contents: write`
- `pull-requests: write`

Job timeout: 5 minutes. One concurrent run per pull request.

The October 2026 Dependabot controller is removed. It shipped with automation disabled, so Dependabot pull requests received "automation is disabled pending setup" instead of merging. There is no separate behind-branch refresh workflow; Dependabot rebases its own pull requests, and native auto-merge still waits until required checks are green on the current base.

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
