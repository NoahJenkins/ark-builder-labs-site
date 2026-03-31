# Context Note — Dependabot Approval Permission Drift and Behind-Branch Refresh

Date: 2026-03-31

## Findings

Investigation started from a report of 9 open Dependabot PRs. At inspection time there were 8 open Dependabot PRs.

The live failure was different from the 2026-03-16 issue:

1. **Actions approval permission drift** — `GET /repos/NoahJenkins/ark-builder-labs-site/actions/permissions/workflow` returned `can_approve_pull_request_reviews=false`.
2. **Branch protection still required one approval** — `main` still enforced `required_approving_review_count == 1`.
3. **Workflow failure mode** — the `Dependabot Auto-Merge` job reached the approval step, then failed with `GitHub Actions is not permitted to approve pull requests` (HTTP 422). The failed check was not itself required, but it prevented the bot approval from being created.
4. **Behind-branch stall** — several PRs already had native auto-merge enabled, but remained open because strict status checks require the branch to stay current with `main`. Once `main` advanced, those PRs stayed `BEHIND` until manually refreshed.

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
7. Reconciled the current open PR backlog:
   - approved and re-enabled the merge path for eligible passing PRs
   - refreshed behind branches with the update-branch API
   - left CI-failing PRs open for manual dependency follow-up

## PR State During Fix

- PR `#30` merged after approval was restored.
- PRs `#31`, `#32`, `#35`, `#36`, and `#41` were approved and refreshed so CI could resume on up-to-date branches.
- PRs `#33` and `#40` still had real CI failures and were intentionally not forced through.

## Related

- `.github/workflows/dependabot-auto-merge.yml`
- `.github/workflows/dependabot-behind-refresh.yml`
- `.github/workflows/repository-settings-health.yml`
- `.github/repository-settings/repository.json`
- `.github/repository-settings/workflow-permissions.json`
- `scripts/apply-repository-settings.sh`
