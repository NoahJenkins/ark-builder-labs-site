# Context Note — Dependabot Approval Permission Drift and Behind-Branch Refresh

Date: 2026-03-31

## Findings

Investigation started from a report of 9 open Dependabot PRs. At inspection time there were 8 open Dependabot PRs.

The live failure was different from the 2026-03-16 issue:

1. **Actions approval permission drift** — `GET /repos/NoahJenkins/ark-builder-labs-site/actions/permissions/workflow` returned `can_approve_pull_request_reviews=false`.
2. **Branch protection still required one approval** — `main` still enforced `required_approving_review_count == 1`.
3. **Workflow failure mode** — the `Dependabot Auto-Merge` job reached the approval step, then failed with `GitHub Actions is not permitted to approve pull requests` (HTTP 422). The failed check was not itself required, but it prevented the bot approval from being created.
4. **Behind-branch stall** — several PRs already had native auto-merge enabled, but remained open because strict status checks require the branch to stay current with `main`. Once `main` advanced, those PRs stayed `BEHIND` until manually refreshed because the first version of the refresh workflow only ran on a 6-hour timer or manual dispatch.

## Work Completed

1. Added repository automation settings as code:
   - `.github/repository-settings/repository.json`
   - `.github/repository-settings/workflow-permissions.json`
2. Added `scripts/apply-repository-settings.sh` to apply and verify:
   - `allow_auto_merge=true`
   - `allow_update_branch=true`
   - `allow_squash_merge=true`
   - `default_workflow_permissions=read`
   - `can_approve_pull_request_reviews=true`
3. Applied those repository settings live through `gh` on 2026-03-31 and verified the responses.
4. Hardened `.github/workflows/dependabot-auto-merge.yml`:
   - preflight-checks repository prerequisites
   - keeps approval + auto-merge behavior
   - makes auto-merge enabling idempotent
5. Added `.github/workflows/dependabot-behind-refresh.yml` to refresh auto-merge-enabled Dependabot PRs that become `behind`.
6. Added `.github/workflows/repository-settings-health.yml` to detect future settings drift.
   - GitHub's default workflow token cannot reliably read the required admin-only settings endpoints.
   - The workflow now uses `REPO_ADMIN_TOKEN` when available and otherwise exits successfully with a notice.
   - Full admin verification remains in `scripts/apply-repository-settings.sh`.
7. Reconciled the current open PR backlog:
   - approved and re-enabled the merge path for eligible passing PRs
   - refreshed behind branches with the update-branch API
   - left CI-failing PRs open for manual dependency follow-up
8. After observing that only one PR merged while eight remained open, tightened `.github/workflows/dependabot-behind-refresh.yml` so it now:
   - runs on every push to `main` in addition to schedule/manual dispatch
   - waits briefly after `main` pushes and retries `mergeable_state=unknown` so GitHub has time to recalculate which PRs are `behind`
   - uses `REPO_ADMIN_TOKEN` for update-branch calls because the default workflow token was rejected with `user doesn't have permission to update head repository`
   - refreshes only auto-merge-enabled Dependabot PRs whose latest checks are green
   - skips PRs with real failing or still-pending checks so broken dependency updates are not re-run on every merge to `main`
9. A later live check on 2026-03-31 found a second trigger gap:
   - PR `#35` merged successfully at commit `dd839ca9d3ee7d73e217dde49a6e1693b9ffd6e5`
   - PR `#36` then showed all required checks green, auto-merge enabled, and `mergeStateStatus=BEHIND`
   - neither `CI` nor `Dependabot Behind Refresh` ran on the new `main` head after that auto-merge, so no workflow was available to refresh `#36`
10. `.github/workflows/dependabot-behind-refresh.yml` was amended again so it also runs on merged PRs to `main` via `pull_request_target: closed`.
    - this closes the gap observed when Dependabot auto-merges did not reliably produce follow-on `push` workflow runs on `main`
    - the workflow ignores closed-but-unmerged PRs and reuses the same guarded refresh logic after a merged PR event

## PR State During Fix

- PR `#30` merged after approval was restored.
- PRs `#31`, `#32`, `#35`, `#36`, and `#41` were approved and refreshed so CI could resume on up-to-date branches.
- PRs `#33` and `#40` still had real CI failures and were intentionally not forced through.
- A later live check on 2026-03-31 showed 8 open Dependabot PRs:
  - PRs `#31`, `#32`, `#35`, and `#41` were healthy but still `BEHIND`
  - PR `#36` was `BEHIND` and had a failing Playwright run
  - PR `#33` failed `TypeScript & Lint` due to the `eslint-config-next` 16 upgrade path
  - PR `#40` failed `TypeScript & Lint` because `lucide-react` 1.7.0 removed the imported `Linkedin`, `Instagram`, and `Facebook` exports used by `src/app/contact/page.tsx`
- Another live check later the same day showed 4 open PRs total:
  - PR `#36` had been refreshed successfully, all required checks were green, auto-merge was enabled, and it remained open only because it was `BEHIND` after PR `#35` merged
  - PR `#33` and PR `#40` remained legitimate CI failures
  - PR `#29` was a maintainer PR with merge conflicts and no auto-merge configured

## Related

- `.github/workflows/dependabot-auto-merge.yml`
- `.github/workflows/dependabot-behind-refresh.yml`
- `.github/workflows/repository-settings-health.yml`
- `.github/repository-settings/repository.json`
- `.github/repository-settings/workflow-permissions.json`
- `scripts/apply-repository-settings.sh`
