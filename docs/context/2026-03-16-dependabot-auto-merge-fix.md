# Context Note — Dependabot Auto-Merge Bug Fixes and Policy Expansion

Date: 2026-03-16

## Findings

15 open Dependabot PRs were stalled and not auto-merging. Investigation revealed two bugs and a policy gap:

1. **Ecosystem name mismatch** — the eligibility check matched `npm` but `dependabot/fetch-metadata` reports the ecosystem as `npm_and_yarn`. This caused `ecosystem_ok=false` for every npm PR, making all npm Dependabot PRs permanently ineligible regardless of update type.
2. **Repository auto-merge disabled** — `allow_auto_merge` was `false` on the repository. The `enablePullRequestAutoMerge` GraphQL mutation in the workflow would have failed silently even if a PR reached the merge step.
3. **Major version gate** — the workflow intentionally restricted auto-merge to `semver-patch` and `semver-minor`. 10 of the 15 open PRs were major version bumps and would never qualify under the original policy.

## Implementation Summary

1. Fixed ecosystem name in `.github/workflows/dependabot-auto-merge.yml`:
   - Changed `npm|github-actions` → `npm|npm_and_yarn|github-actions` in the eligibility case statement.
2. Enabled repository auto-merge via GitHub API (`allow_auto_merge: true`).
3. Expanded update-type allowlist in the same workflow:
   - Added `version-update:semver-major` alongside patch and minor.
4. Re-triggered all 15 open PRs with `@dependabot rebase` comments to fire the `synchronize` event and re-run the fixed workflow.

## PR Breakdown at Time of Fix

| PR | Package | Type | Eligible after fix |
|----|---------|------|--------------------|
| #25 | framer-motion | minor | yes |
| #24 | eslint-config-next | major | yes (policy expanded) |
| #23 | lucide-react | minor | yes |
| #22 | @eslint/eslintrc | patch | yes |
| #21 | @vercel/analytics | major | yes (policy expanded) |
| #20 | @types/node | major | yes (policy expanded) |
| #19 | testing group | minor | yes |
| #18 | @next/mdx | major | yes (policy expanded) |
| #17 | react group | major | yes (policy expanded) |
| #16 | codecov/codecov-action | major | yes (policy expanded) |
| #15 | actions/setup-node | major | yes (policy expanded) |
| #14 | actions/github-script | major | yes (policy expanded) |
| #13 | actions/upload-artifact | major | yes (policy expanded) |
| #12 | actions/cache | major | yes (policy expanded) |
| #11 | flatted | minor | yes |

## Related

- `.github/workflows/dependabot-auto-merge.yml`
- `docs/adr/adr-0001-dependabot-auto-merge-policy.md` (amended)
- `docs/architecture/ci.md`
- `docs/architecture/ci-cd-pipeline.md`
