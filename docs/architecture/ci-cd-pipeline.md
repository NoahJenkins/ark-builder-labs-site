# CI/CD Pipeline Documentation

## Overview
This repository uses GitHub Actions for continuous integration, quality checks, and policy automation. The primary CI pipeline validates TypeScript/lint, unit tests, production build, and end-to-end tests before merges to `main`.

## Pipeline Stages

### 1) TypeScript & Lint
- **Trigger conditions:** `push` to `main`, `pull_request` to `main`
- **Actions performed:** Checkout, install pnpm + Node 22, install dependencies, run `pnpm exec tsc --noEmit`, run `pnpm lint`, and run the dependency automation policy contract
- **Success criteria:** Type check, lint, and the workflow policy contract exit successfully
- **Typical duration:** ~1-3 minutes

### 2) Jest Tests
- **Trigger conditions:** Runs after `TypeScript & Lint` succeeds
- **Actions performed:** Frozen install from the pnpm store cache + `pnpm test`; upload coverage artifact if present
- **Success criteria:** Jest test suite passes
- **Typical duration:** ~1-4 minutes

### 3) Build Check
- **Trigger conditions:** Runs after `TypeScript & Lint` succeeds
- **Actions performed:** Next.js cache restore, dependency install, `pnpm run build`
- **Success criteria:** Next.js production build completes without errors
- **Typical duration:** ~2-6 minutes

### 4) Playwright Tests
- **Trigger conditions:** Runs after `TypeScript & Lint` succeeds, in parallel with `Build Check`
- **Actions performed:** Restore the pnpm store and exact Playwright browser cache, install system libraries under a 5-minute limit, download browsers only on a cache miss, run `pnpm run test:e2e`, upload failure artifacts
- **Success criteria:** E2E suite passes across configured projects
- **Typical duration:** ~4-12 minutes

### 5) Dependabot Auto-Merge
- **Trigger conditions:** `pull_request` to `main` (`opened`, `reopened`, `synchronize`, `ready_for_review`) when the author is `dependabot[bot]` and the pull request is not a draft
- **Actions performed:** Read pinned Dependabot metadata and enable native squash auto-merge for patch, minor, GitHub Actions, and security updates. Semver-major npm updates stay open and get the `needs-review` label. The workflow does not approve pull requests.
- **Success criteria:** Auto-merge is enabled only for an eligible Dependabot update. Branch protection still waits for `TypeScript & Lint`, `Jest Tests`, `Build Check`, and `Playwright Tests` on the current `main` base.
- **Typical duration:** a few seconds
- **Timeout:** 5 minutes

### 6) Repository Settings Health
- **Trigger conditions:** Daily schedule and manual `workflow_dispatch`
- **Actions performed:** If `REPO_ADMIN_TOKEN` is configured, re-apply and verify tracked repository automation settings with `scripts/apply-repository-settings.sh`; otherwise emit a notice and exit successfully
- **Success criteria:** Admin-token runs prove tracked settings still apply cleanly; non-admin runs remain non-failing and clearly indicate that verification was skipped
- **Typical duration:** <1 minute

### 8) Branch Protection Sync
- **Trigger conditions:** Manual `workflow_dispatch`
- **Actions performed:** Run `scripts/apply-branch-protection.sh` against `main` via `gh` CLI
- **Success criteria:** Branch protection configuration and verification pass
- **Typical duration:** <1 minute

## CI Install Limits and Caches

- TypeScript/lint and Jest jobs stop after 10 minutes. Build and Playwright jobs stop after 15 minutes.
- Each package, browser, or Linux system-library install stops after 5 minutes. Node/pnpm setup stops after 3 minutes; explicit cache operations stop after 2 minutes. An install failure fails the job; there is no fallback install or automatic retry.
- Every job uses the existing pnpm store cache and a frozen lockfile with `--prefer-offline`. This reuses downloaded packages while preserving lockfile validation and required lifecycle scripts; `node_modules` is not cached.
- Playwright browser binaries use an exact OS, architecture, and `pnpm-lock.yaml` cache key. A hit skips browser downloads. A miss installs and caches the configured browsers. Broad restore keys are prohibited because a different lockfile can require different browser builds.
- Linux system libraries are not part of the browser cache. They install on both cache hits and misses under the same 5-minute limit.
- New commits cancel superseded CI runs. A setup timeout requires investigation before another run; do not retry it automatically or increase the limit to obtain a green result.

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
- **pnpm install failures:** Inspect the timed-out or failed step, lockfile consistency, and registry access before another run; preserve useful caches
- **Dependabot security alerts remain open after dependency PRs merge:** Check whether `pnpm-lock.yaml` is still pinning vulnerable transitive versions; if so, add targeted `pnpm.overrides`, regenerate the lockfile, and re-run `pnpm audit`
- **TypeScript/lint failures:** Run `pnpm exec tsc --noEmit` and `pnpm lint` locally before pushing
- **Playwright failures due to browser setup:** Check the separate system-library and browser-install steps; a browser cache hit does not replace Linux system libraries
- **Branch protection sync failures:** Confirm token permissions and repository admin rights before dispatching workflow
- **Dependabot auto-merge not enabled:** Confirm the author is `dependabot[bot]`, the pull request is not draft, and metadata classifies it as patch, minor, GitHub Actions, or a security update. Semver-major npm updates are labeled `needs-review` and left open. Confirm repository `allow_auto_merge` and `allow_squash_merge` remain enabled. Native auto-merge still waits for the four required CI checks.
- **Dependabot PRs stuck behind `main`:** Strict required checks wait for the current base. Dependabot rebases its own branches; this repository does not run a separate behind-refresh workflow.

## Maintenance
- Update workflow action versions periodically (e.g., `actions/checkout`, `actions/setup-node`)
- Keep Node and pnpm versions aligned with `package.json` and project tooling
- Review required status checks whenever CI job names change
- Review Dependabot allowlist and update rules as dependency management strategy evolves
- Review `pnpm.overrides` when Dependabot security alerts are cleared or when upstream packages catch up, so temporary transitive pins do not become stale policy
- Re-apply `scripts/apply-repository-settings.sh` after repository automation setting drift or repo recreation
