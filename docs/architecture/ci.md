# CI and Branch Protection Architecture

Last updated: 2026-10-22

## CI Required Checks

Main branch protection requires these exact GitHub Actions job names from `.github/workflows/ci.yaml`:
- `TypeScript & Lint`
- `Jest Tests`
- `Build Check`
- `Playwright Tests`

Branch protection requires strict current-base checks. Dependabot native auto-merge therefore waits until all four checks pass against the current `main` branch.

## CI Install Limits and Caches

- The four jobs run in parallel. TypeScript/lint and Jest jobs stop after 10 minutes. Build and Playwright jobs stop after 15 minutes.
- Each package, browser, or Linux system-library install stops after 5 minutes. Node/pnpm setup stops after 3 minutes; explicit cache operations stop after 2 minutes. An install failure fails the job; there is no fallback install or automatic retry.
- Every job uses the existing pnpm store cache and a frozen lockfile with `--prefer-offline`. This reuses downloaded packages while preserving lockfile validation and required lifecycle scripts; `node_modules` is not cached.
- Playwright browser binaries use an exact OS, architecture, OS release (from `/etc/os-release`), and `pnpm-lock.yaml` cache key; `ubuntu-latest` moves between releases, and each release needs its own browser builds. A hit skips browser downloads. A miss installs and caches chromium, the only browser CI uses. Playwright runs against the production build (`next build` then `next start`). Broad restore keys are prohibited because a different lockfile can require different browser builds.
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

Workflow: `.github/workflows/dependabot-auto-merge.yml` (event-driven, no polling).

- Trigger: `pull_request_target` on `opened`, `synchronize`, `reopened`, for PRs authored by `dependabot[bot]` only. Nothing from the PR is checked out or executed.
- Patch/minor updates, grouped updates, and every GitHub Actions bump get native auto-merge (`gh pr merge --auto --squash`). GitHub waits for the four required checks.
- Ungrouped major updates get the `major-update` label and are left to pr-repair or a human.
- Auto-merge is enabled with `GITHUB_TOKEN`, so the merge itself does not start the `push` CI run on `main`. Vercel still deploys because its Git integration is a webhook.
- Repository prerequisites: `allow_auto_merge` and `allow_squash_merge` enabled.

## pr-repair

Workflow: `.github/workflows/pr-repair.yml`; see `docs/pr-repair.md`. It runs only for failed CI on `dependabot/**` and `pr-repair/**` branches, plus one daily sweep.

## Administrator Bypass Policy

`enforce_admins` is intentionally set to `false` to preserve administrator direct push workflow while retaining required checks and review requirements for standard contribution paths.
