# CI/CD Pipeline Documentation

Last updated: 2026-10-13

## Overview
This repository uses GitHub Actions for continuous integration, quality checks, and policy automation. The primary CI pipeline validates TypeScript/lint, unit tests, production build, and end-to-end tests before merges to `main`.

## Pipeline Stages

A hosted `runner-routing` prerequisite selects the runner for the four existing checks. Exact `OPTIPLEX_CI_ENABLED=true` selects `optiplex-ci-ubuntu24` for pushes and same-repository PRs. All other values and fork PRs use `ubuntu-latest`. The four protected names and their typecheck gate remain unchanged; see the [job-by-job routing table](./ci.md#runner-routing).

### 1) TypeScript & Lint
- **Trigger conditions:** `push` to `main`, `pull_request` to `main`
- **Actions performed:** Checkout, install pnpm + Node 22, install dependencies, run `pnpm exec tsc --noEmit`, run `pnpm lint`, and run the dependency automation policy contract
- **Success criteria:** Type check, lint, and the workflow policy contract exit successfully
- **Typical duration:** ~1-3 minutes

### 2) Jest Tests
- **Trigger conditions:** Runs after `TypeScript & Lint` succeeds
- **Actions performed:** Fresh install + `pnpm test`; upload Jest coverage through Codecov if `coverage/lcov.info` exists
- **Success criteria:** Jest test suite passes
- **Typical duration:** ~1-4 minutes

### 3) Build Check
- **Trigger conditions:** Runs after `TypeScript & Lint` succeeds
- **Actions performed:** Next.js cache restore, dependency install, `pnpm run build`
- **Success criteria:** Next.js production build completes without errors
- **Typical duration:** ~2-6 minutes

### 4) Playwright Tests
- **Trigger conditions:** Runs after `TypeScript & Lint` succeeds, independently of `Build Check`; jobs queue normally when the Dell pool is occupied
- **Actions performed:** Install dependencies, restore the Playwright browser cache, install browsers/deps on a cache miss or system dependencies on a hit, run `pnpm run test:e2e` with a fresh CI dev server, and upload `test-results/` only on failure (30-day retention)
- **Success criteria:** E2E suite passes across configured projects
- **Typical duration:** ~4-12 minutes

### 5) Dependabot Auto-Merge Policy
- **Trigger conditions:** `pull_request_target` events for Dependabot PRs (`opened`, `reopened`, `synchronize`, `ready_for_review`)
- **Actions performed:** Fetch metadata, verify repository-level auto-merge prerequisites, validate the changed-file allowlist, enforce actor/author/base/draft/ecosystem/update-type gates, auto-approve, and enable native squash auto-merge. Dependabot separately groups routine npm and GitHub Actions patch/minor updates and security updates; safe major updates remain standalone.
- **Success criteria:** Eligibility rules pass, auto-merge is enabled, and branch protection waits for the exact `TypeScript & Lint`, `Jest Tests`, `Build Check`, and `Playwright Tests` checks on the current `main` base. Failed, conflicting, or disallowed updates remain open.
- **Typical duration:** <1 minute
- **Timeout:** 5 minutes

### 6) Dependabot Behind Refresh
- **Trigger conditions:** `push` to `main`, merged PRs targeting `main` via `pull_request_target: closed`, daily fallback at `20:23 UTC`, and manual `workflow_dispatch`
- **Actions performed:** After `main` advances, wait briefly for GitHub to recalculate PR mergeability, authenticate with `REPO_ADMIN_TOKEN` when available, inspect open Dependabot PRs with auto-merge enabled, skip PRs that already have failing or pending checks, retry `unknown` mergeability, and call the update-branch API for PRs that are clean but `behind`. Any update-branch failure fails the job.
- **Success criteria:** Stalled auto-merge Dependabot PRs are refreshed after `main` advances or by the daily recovery path, while genuinely failing dependency updates remain open for manual follow-up.
- **Typical duration:** <1 minute
- **Timeout:** 5 minutes

### 7) Repository Settings Health
- **Trigger conditions:** Daily schedule and manual `workflow_dispatch`
- **Actions performed:** If `REPO_ADMIN_TOKEN` is configured, re-apply and verify tracked repository automation settings with `scripts/apply-repository-settings.sh`; otherwise emit a notice and exit successfully
- **Success criteria:** Admin-token runs prove tracked settings still apply cleanly; non-admin runs remain non-failing and clearly indicate that verification was skipped
- **Typical duration:** <1 minute

### 8) Branch Protection Sync
- **Trigger conditions:** Manual `workflow_dispatch`
- **Actions performed:** Run `scripts/apply-branch-protection.sh` against `main` via `gh` CLI
- **Success criteria:** Branch protection configuration and verification pass
- **Typical duration:** <1 minute

## Dell Image and Controller Contract

Infrastructure acceptance belongs to the homelab task. This repository supplies routing and requirements; it does not configure the Dell or activate the repository variable.

- **Worker identity:** Repository-scoped workers on `optiplex-7040`, exact custom label `optiplex-ci-ubuntu24`, Ubuntu 24.04 x64. `optiplex-ci-ubuntu22` is reserved for Ubuntu 22.04 x64; this workflow does not select it. Never use or relabel `optiplex-tailscale-policy` / `tailscale-policy`.
- **Lifecycle:** One fresh VM per job from a reviewed image. The controller destroys every writable disk after success, failure, cancellation, and timeout, including runner-loss recovery. Homes and workspaces are not shared writable state between jobs. Restored Actions caches reside only in the disposable guest.
- **Isolation:** No host Docker socket, host SSH credentials, host home directories, production data, or home-network access. Any job Docker daemon runs inside its VM.
- **Pool limits:** Initially one concurrent job across the entire Dell CI pool, at most 4 vCPUs and 16 GiB RAM for the active VM. Limits are controller-owned; project workflows must queue normally and cannot raise them or remove required checks.
- **Runner/runtime:** A current GitHub Actions runner compatible with the retained action versions and their bundled Node runtime, including required glibc and runner libraries. The job application runtime is Node 22 and pnpm 10.33.0, installed through the existing setup actions. Keep `pnpm install --frozen-lockfile --prefer-offline`.
- **Base packages:** Bash, Git, curl, CA certificates, tar, gzip, unzip, xz, and Ruby with YAML/Psych, JSON, FileUtils, Open3, and Tempfile standard libraries for the workflow-policy contract. Provide a writable guest tool cache and job workspace. Ruby 2.7 or later is required by the existing `Enumerable#filter_map` use; Ubuntu 24.04 Ruby 3.2 is suitable.
- **Browser packages:** Guest-local `sudo`/`apt` support for `pnpm exec playwright install --with-deps` on a browser-cache miss and `pnpm exec playwright install-deps` on a hit. Chromium, Firefox, and WebKit libraries/fonts must match the lockfile-resolved Playwright version. Use [Playwright's dependency installer](https://playwright.dev/docs/browsers#install-system-dependencies) to manage the changing OS package set rather than an independently pinned list. Do not install these dependencies on the Dell host.
- **Network:** Guest egress for GitHub runner control, action downloads, cache/artifact services, the package registry, Playwright browser CDN, and Codecov. No private-network or production reachability is needed.

Next.js `.next/cache`, Playwright `~/.cache/ms-playwright`, cache keys/restore prefixes, conditional Codecov upload, and failure diagnostics are retained. A warm browser cache still requires guest OS dependencies. `playwright.config.ts` already disables `reuseExistingServer` when `CI` is set; the disposable VM and existing CI config ensure each job starts its own server. No persistent server is shared across jobs.

## Live Acceptance and Rollback

Prepared implementation and local/hosted checks are separate from actual Dell execution. Do not enable `OPTIPLEX_CI_ENABLED` until an authorized infrastructure operator accepts the controller and reviewed image. Live activation is serial across project migrations.

Required evidence, recorded against the exact PR head SHA:

1. A complete successful CI workflow with all four protected checks on the expected repository-scoped Dell worker/image; runner names/labels and controller records must identify the VMs.
2. Hosted `ubuntu-latest` execution for a normal fork PR and a Dependabot-authored fork PR, plus hosted fallback with the variable missing or disabled. Actor identity must not override repository origin.
3. Cold and warm Next.js/Playwright cache paths; in particular, Playwright OS dependencies install on a browser-cache hit inside the fresh guest.
4. Expected outputs: Codecov coverage upload when `coverage/lcov.info` exists (the existing `pnpm test` may not produce coverage), and `playwright-test-results` with 30-day retention on a failed Playwright run. Preserve traces/diagnostics and confirm artifacts are downloadable when produced.
5. Controller logs proving writable disks are destroyed after success, failure, cancellation, and timeout; no surviving runner home/workspace or server. Prove the pool-wide limit remains one VM with at most 4 vCPUs/16 GiB RAM.
6. Unchanged hosted policy jobs and protected check names, triggers, permissions, action versions, cancellation, timeouts, and dependency-automation rules.

Current status: **live acceptance pending**. A successful local test or GitHub-hosted run does not prove Dell isolation or cleanup.

Rollback: an authorized operator disables or unsets `OPTIPLEX_CI_ENABLED`, cancels/reruns affected queued or active CI as appropriate, and verifies all four checks use `ubuntu-latest`. A runner decision already computed by a run does not change retroactively. Revert the migration commit to restore the original selectors and remove the routing prerequisite/tests/docs. Do not change branch protection, secrets, or deployment settings as part of rollback.

See [ADR 0004](../adr/0004-opt-in-disposable-dell-ci.md), [preparation context](../context/2026-10-13-optiplex-ci-preparation.md), and [remaining work](../TODO.md#dell-ci-preparation).

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

Repository variable (operator-managed; not enabled by this migration):
- `OPTIPLEX_CI_ENABLED`: only exact `true` opts eligible jobs into Dell CI; missing/false/other values preserve hosted Ubuntu

Referenced by tooling/runtime in repository configuration:
- `CI`
- `NODE_ENV`

## Troubleshooting
- **pnpm install failures:** Confirm lockfile consistency and registry access; re-run with clean cache
- **Dependabot security alerts remain open after dependency PRs merge:** Check whether `pnpm-lock.yaml` is still pinning vulnerable transitive versions; if so, add targeted `pnpm.overrides`, regenerate the lockfile, and re-run `pnpm audit`
- **TypeScript/lint failures:** Run `pnpm exec tsc --noEmit` and `pnpm lint` locally before pushing
- **Playwright failures due to browser setup:** Ensure `pnpm exec playwright install --with-deps` ran successfully in CI
- **Branch protection sync failures:** Confirm token permissions and repository admin rights before dispatching workflow
- **Dependabot auto-merge not enabled:** Check actor/author/base branch/update type/file allowlist gates in the workflow logs; confirm `allow_auto_merge` is enabled and `can_approve_pull_request_reviews` is true in repository settings
- **Dependabot PRs stuck behind `main`:** Confirm `.github/workflows/dependabot-behind-refresh.yml` ran after the latest merge to `main` or on the next daily fallback, and confirm `REPO_ADMIN_TOKEN` is configured; if the PR still did not refresh, check whether it has failing or pending checks that intentionally caused the refresh workflow to skip it

## Maintenance
- Update workflow action versions periodically (e.g., `actions/checkout`, `actions/setup-node`)
- Keep Node and pnpm versions aligned with `package.json` and project tooling
- Review required status checks whenever CI job names change
- Review Dependabot allowlist and update rules as dependency management strategy evolves
- Review `pnpm.overrides` when Dependabot security alerts are cleared or when upstream packages catch up, so temporary transitive pins do not become stale policy
- Re-apply `scripts/apply-repository-settings.sh` after repository automation setting drift or repo recreation
