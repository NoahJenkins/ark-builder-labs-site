# CI/CD Pipeline Documentation

## Overview
This repository uses GitHub Actions for continuous integration, quality checks, and policy automation. The primary CI pipeline validates TypeScript/lint, unit tests, production build, and end-to-end tests before merges to `main`.

## Pipeline Stages

### 1) TypeScript & Lint
- **Trigger conditions:** `push` to `main`, `pull_request` to `main`
- **Actions performed:** Checkout, install pnpm + Node 22, install dependencies, run `pnpm exec tsc --noEmit`, run `pnpm lint`
- **Success criteria:** Type check and lint both exit successfully
- **Typical duration:** ~1-3 minutes

### 2) Jest Tests
- **Trigger conditions:** Runs after `TypeScript & Lint` succeeds
- **Actions performed:** Fresh install + `pnpm test`; upload coverage artifact if present
- **Success criteria:** Jest test suite passes
- **Typical duration:** ~1-4 minutes

### 3) Build Check
- **Trigger conditions:** Runs after `TypeScript & Lint` succeeds
- **Actions performed:** Next.js cache restore, dependency install, `pnpm run build`
- **Success criteria:** Next.js production build completes without errors
- **Typical duration:** ~2-6 minutes

### 4) Playwright Tests
- **Trigger conditions:** Runs after `Build Check` succeeds
- **Actions performed:** Install dependencies, install Playwright browsers/deps, run `pnpm run test:e2e`, upload reports/artifacts
- **Success criteria:** E2E suite passes across configured projects
- **Typical duration:** ~4-12 minutes

### 5) Dependabot Auto-Merge Policy
- **Trigger conditions:** `pull_request_target` events for Dependabot PRs (`opened`, `reopened`, `synchronize`, `ready_for_review`)
- **Actions performed:** Fetch metadata, validate file allowlist, enforce ecosystem/update-type gates, auto-approve, enable native squash auto-merge
- **Success criteria:** Eligibility rules pass and auto-merge is enabled
- **Typical duration:** <1 minute

### 6) Branch Protection Sync
- **Trigger conditions:** Manual `workflow_dispatch`
- **Actions performed:** Run `scripts/apply-branch-protection.sh` against `main` via `gh` CLI
- **Success criteria:** Branch protection configuration and verification pass
- **Typical duration:** <1 minute

## Deployment Environments
- **Staging:**
	- Trigger: N/A (not configured)
	- URL: N/A
	- Deployment method: N/A
	- Rollback: N/A
- **Production:**
	- Trigger: Vercel Git integration on merge to `main` (outside GitHub Actions)
	- URL: Configured in Vercel project settings
	- Deployment method: Vercel build/deploy from repository
	- Rollback: Promote a previous successful Vercel deployment or revert the commit and redeploy

## Required Secrets & Environment Variables
Referenced in workflow files:
- `secrets.GITHUB_TOKEN` (GitHub-provided token, used for workflow API operations)

Referenced by tooling/runtime in repository configuration:
- `CI`
- `NODE_ENV`

## Troubleshooting
- **pnpm install failures:** Confirm lockfile consistency and registry access; re-run with clean cache
- **TypeScript/lint failures:** Run `pnpm exec tsc --noEmit` and `pnpm lint` locally before pushing
- **Playwright failures due to browser setup:** Ensure `pnpm exec playwright install --with-deps` ran successfully in CI
- **Branch protection sync failures:** Confirm token permissions and repository admin rights before dispatching workflow
- **Dependabot auto-merge not enabled:** Check actor/author/base branch/update type/file allowlist gates in the workflow logs

## Maintenance
- Update workflow action versions periodically (e.g., `actions/checkout`, `actions/setup-node`)
- Keep Node and pnpm versions aligned with `package.json` and project tooling
- Review required status checks whenever CI job names change
- Review Dependabot allowlist and update rules as dependency management strategy evolves
