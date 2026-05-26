# Context Note — Dependabot Alert Cleanup via pnpm-Only Lockfile Policy

Date: 2026-05-26

## Findings

The repository had 15 open Dependabot alerts on GitHub:

1. 14 alerts came from `package-lock.json`.
2. 1 alert came from `pnpm-lock.yaml`.

The local checkout was behind `origin/main` when the investigation started. Current `origin/main` had already merged PR #68, which updated the pnpm dependency graph to `next@15.5.18` and fixed the Next.js advisory set in `pnpm-lock.yaml`. GitHub still reported the same Next.js advisories because the stale tracked `package-lock.json` continued to pin `next@15.5.15` and vulnerable `postcss` versions.

The remaining pnpm alert was real: `next@15.5.18` still depends on `postcss@8.4.31`, while GHSA-qx2v-qp2m-jg93 requires `postcss>=8.5.10`.

## Work Completed

1. Standardized the repo on pnpm-only dependency state.
2. Removed the stale tracked `package-lock.json`.
3. Added `package-lock.json` to `.gitignore` to prevent future npm lockfile drift.
4. Preserved existing pnpm security overrides and added a targeted pnpm override in `pnpm-workspace.yaml`:
   - `next@15.5.18>postcss -> 8.5.14`
5. Added a `ws@8.20.0 -> 8.20.1` override after `pnpm audit --audit-level=moderate` exposed a separate `jest-environment-jsdom > jsdom > ws` moderate advisory.
6. Regenerated `pnpm-lock.yaml` from the canonical pnpm graph.
7. Added a repo `.npmrc` with `lockfile=true` so local home-level npm settings cannot make pnpm ignore `pnpm-lock.yaml`.
8. Updated `AGENTS.md` examples from npm/npx commands to pnpm/pnpm exec.

## Verification

The cleanup was verified locally on 2026-05-26:

1. `pnpm install --frozen-lockfile` passed.
2. `pnpm audit --audit-level=moderate` passed with no known vulnerabilities.
3. `pnpm exec tsc --noEmit` passed.
4. `pnpm lint` passed with existing warnings only.
5. `pnpm test` passed: 6 suites, 49 tests.
6. `pnpm run build` passed.
7. After merge to `main`, query the live GitHub Dependabot API and require zero open alerts:
   `gh api '/repos/NoahJenkins/ark-builder-labs-site/dependabot/alerts?state=open&per_page=100' --jq 'length'`

Local verification warnings observed:

- The local shell is running Node v26 while the repo declares Node 22.x.
- pnpm ignored the `sharp@0.34.5` build script during install.
- Next.js warned about multiple lockfiles because this Mac also has `/Users/noahjenkins/pnpm-lock.yaml`.
- The production build reported an existing CSS `@import` ordering warning.

## Maintenance Notes

- pnpm is canonical for this repository. CI, README, and `packageManager` already use pnpm.
- pnpm overrides live in `pnpm-workspace.yaml`; current pnpm no longer reads `pnpm.overrides` from `package.json`.
- Do not restore `package-lock.json` unless the repository intentionally migrates back to npm.
- Dependabot alerts are based on dependency graph data from manifests and lockfiles on the default branch, so stale extra lockfiles can keep resolved vulnerabilities open even when the runtime package manager has already been fixed.
