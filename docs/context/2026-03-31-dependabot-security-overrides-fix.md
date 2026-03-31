# Context Note — Dependabot Security Alert Remediation via pnpm Overrides

Date: 2026-03-31

## Findings

As of 2026-03-31, the repository had 10 open Dependabot security alerts on the default branch. Those 10 alerts collapsed to 6 advisories across 4 transitive packages:

1. `yaml`
2. `flatted`
3. `picomatch`
4. `brace-expansion`

The alert set was real on `main`, not an artifact of a stale local checkout. `pnpm-lock.yaml` still pinned:

- `yaml@2.8.2`
- `flatted@3.3.3`
- `picomatch@2.3.1`
- `picomatch@4.0.3`
- `brace-expansion@1.1.12`
- `brace-expansion@2.0.2`
- `brace-expansion@5.0.4`

An isolated test confirmed that `pnpm install --lockfile-only` by itself did not change those versions. The lockfile would remain vulnerable until the repository explicitly overrode or updated the affected transitive packages.

## Work Completed

1. Added targeted `pnpm.overrides` entries in `package.json` for the exact vulnerable versions:
   - `yaml@2.8.2 -> 2.8.3`
   - `flatted@3.3.3 -> 3.4.2`
   - `picomatch@2.3.1 -> 2.3.2`
   - `picomatch@4.0.3 -> 4.0.4`
   - `brace-expansion@1.1.12 -> 1.1.13`
   - `brace-expansion@2.0.2 -> 2.0.3`
   - `brace-expansion@5.0.4 -> 5.0.5`
2. Regenerated `pnpm-lock.yaml` so the resolved dependency graph moved to the patched versions.
3. Reinstalled dependencies locally and verified that the updated graph still worked with repository tooling.
4. Pushed commit `120c6ff82fb29e631e207ac83b2f1d13e5888f50` directly to `main`.

## Verification

The fix was verified in three ways:

1. `pnpm audit --json` returned zero vulnerabilities after the override-backed lockfile refresh.
2. `pnpm lint` completed successfully with warnings only, and `pnpm exec tsc --noEmit` completed successfully.
3. Live GitHub Dependabot alert API results for `state=open` returned `0` open alerts after the push to `main`.

## Maintenance Notes

- This repository currently relies on `pnpm` in CI, so the enforced remediation lives in `pnpm.overrides`.
- A plain reinstall is not sufficient for this class of transitive vulnerability when the lockfile already satisfies semver ranges.
- If future Dependabot alerts reappear for already-upgradable transitive packages, check whether a targeted override or explicit `pnpm update` is required rather than assuming Dependabot PR merges will fully converge the lockfile.
