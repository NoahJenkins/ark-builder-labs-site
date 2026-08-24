---
title: "ADR-0001: Dependabot Auto-Merge Policy"
status: "Amended"
date: "2026-08-24"
authors: "Maintainer"
tags: ["architecture", "decision", "ci", "security", "dependabot"]
supersedes: ""
superseded_by: ""
---

# ADR-0001: Dependabot Auto-Merge Policy

## Status

Amended

- 2026-03-31: Codified repository automation settings, added behind-branch refresh, and covered merged-PR trigger gaps.
- 2026-08-24: Consolidated routine and security updates, removed direct maintainer routing, and reduced the refresh schedule to a daily fallback.

## Context

Dependency updates improve security and maintenance but unattended merging can introduce regressions. The repository needs automated merges for Dependabot updates while preserving strict guardrails.

Three bugs were discovered across the 2026-03-16 and 2026-03-31 investigations:
1. The ecosystem gate matched `npm` but `dependabot/fetch-metadata` reports `npm_and_yarn` — all npm PRs were permanently ineligible.
2. Repository `allow_auto_merge` was `false`, causing the `enablePullRequestAutoMerge` GraphQL mutation to silently fail.
3. Actions workflow permissions had `can_approve_pull_request_reviews=false`, causing the auto-approval step to fail with `GitHub Actions is not permitted to approve pull requests`.

Two operational gaps were also identified on 2026-03-31:
4. Eligible PRs with auto-merge enabled could remain open indefinitely once they became `behind` `main` under strict status checks.
5. Dependabot auto-merges did not reliably produce follow-on `push` workflow runs on `main`, so a refresh workflow that only listened to `push` events could miss the exact merge that made the next PR become `behind`.

An operational review on 2026-08-24 found that Dependabot created 48 pull requests from July 1 through August 24. All 48 had merged by the final snapshot. Fragmented routine groups and standalone updates increased pull request and notification volume, while explicit reviewer and assignee entries routed each update directly to the maintainer. The behind-refresh workflow also ran 96 times on its six-hour August schedule, plus once from `push` and once from `pull_request_target`. Dependabot bot merges did not trigger those event paths during the reviewed period; queued Dependabot pull requests recovered through Dependabot self-rebases instead.

## Decision

Enable auto-merge for Dependabot pull requests that satisfy all constraints:
- PR actor and author are `dependabot[bot]`
- Base branch is `main`
- PR is not draft
- Ecosystem metadata is `npm`, `npm_and_yarn`, or `github_actions`
- Update type is `version-update:semver-patch`, `version-update:semver-minor`, or `version-update:semver-major`
- Changed files are restricted to dependency/workflow allowlist

If eligible, the workflow auto-approves and enables native GitHub auto-merge with squash.

Dependabot version-update grouping is consolidated as follows:
- `npm-patch-minor` groups all npm patch and minor version updates.
- `github-actions-patch-minor` groups all GitHub Actions patch and minor version updates.
- Major version updates remain standalone and may auto-merge when they satisfy the same dependency-only changed-file and protected-check gates.

Security updates use Dependabot's supported `applies-to: security-updates` groups:
- `npm-security` for npm security updates.
- `github-actions-security` for GitHub Actions security updates.

No dependency ignore rules, reviewer entries, or assignee entries are configured. Security updates remain eligible for immediate creation and native auto-merge; grouping changes their pull request packaging, not the four protected checks or strict current-base requirement.

Repository automation settings are part of the policy and must remain aligned with tracked config:
- `allow_auto_merge == true`
- `allow_update_branch == true`
- `allow_squash_merge == true`
- `default_workflow_permissions == read`
- `can_approve_pull_request_reviews == true`

Eligible Dependabot PRs with auto-merge already enabled should be refreshed automatically when they become `behind` `main`, whether `main` advances through a normal push or a merged pull request event.

The refresh workflow retains `push`, merged `pull_request_target: closed`, and `workflow_dispatch` triggers. Its schedule is a daily fallback at `20:23 UTC` because live evidence did not show that token-created Dependabot merges reliably emitted the event triggers. Both Dependabot automation jobs have a five-minute timeout. A failed update-branch request fails the refresh job so the recovery failure remains visible.

Native squash auto-merge remains the merge authority. Routine, security, and eligible standalone major updates merge only after `TypeScript & Lint`, `Jest Tests`, `Build Check`, and `Playwright Tests` pass against the current `main` base. Failed, conflicting, or changed-file-disallowed updates remain open as exceptions.

## Consequences

### Positive

- **POS-001**: Reduces maintainer toil for all Dependabot updates.
- **POS-002**: Keeps update velocity high for security and maintenance patches.
- **POS-003**: Preserves review/control boundaries through strict file scope gates.
- **POS-004**: Reduces estimated Dependabot volume from 48 historical pull requests to about 13 grouped pull requests for the same update set, a reduction of about 73% or 4.4 pull requests per week.
- **POS-005**: Reduces fallback schedules from 28 to 7 runs per week, a 75% reduction, while retaining event and manual recovery paths.

### Negative

- **NEG-001**: Non-allowlisted file changes still require manual intervention.
- **NEG-002**: Misconfigured allowlists can block legitimate updates.
- **NEG-003**: Major version auto-merges rely on CI coverage catching regressions.
- **NEG-004**: Repository-level settings drift can break automation even when workflow code is unchanged.
- **NEG-005**: Grouped pull requests contain more dependency changes, so a single incompatibility can hold the group open for investigation.

## Alternatives Considered

### Manual Merge Only

- **ALT-001**: **Description**: Keep all Dependabot updates fully manual.
- **ALT-002**: **Rejection Reason**: Increased operational overhead and slower patch adoption.

### Unrestricted Dependabot Auto-Merge

- **ALT-003**: **Description**: Auto-merge all Dependabot PRs without any gates.
- **ALT-004**: **Rejection Reason**: Risk profile too high without ecosystem and file scope constraints.

## Implementation Notes

- **IMP-001**: Implemented in `.github/workflows/dependabot-auto-merge.yml`.
- **IMP-002**: Uses `dependabot/fetch-metadata` plus changed-file allowlist validation.
- **IMP-003**: Uses GitHub native auto-merge with `SQUASH` method.
- **IMP-004**: Repository settings are tracked in `.github/repository-settings/`.
- **IMP-005**: `scripts/apply-repository-settings.sh` applies and verifies repo-level automation settings, including the admin-only workflow approval permission.
- **IMP-006**: `.github/workflows/dependabot-behind-refresh.yml` refreshes auto-merge-enabled Dependabot PRs when they fall behind `main`.
- **IMP-006A**: The refresh workflow listens to both `push` on `main` and merged `pull_request_target` events for `main` so it still runs when an auto-merge does not emit a follow-on push workflow run.
- **IMP-007**: `.github/workflows/repository-settings-health.yml` re-applies and verifies tracked settings when `REPO_ADMIN_TOKEN` is available, and otherwise exits with an explicit notice instead of creating permanent false-negative failures.
- **IMP-008**: `.github/dependabot.yml` defines separate catch-all groups for routine patch/minor updates and security updates in both supported ecosystems.
- **IMP-009**: The auto-merge and refresh jobs each have `timeout-minutes: 5`; the refresh fallback runs daily at `23 20 * * *`.
- **IMP-010**: Local policy tests cover grouped routine updates, grouped security updates, eligible majors, failed updates, disallowed files, behind-branch refresh, and exact required check names. Future Dependabot-generated group shapes and hosted behind-branch recovery remain to be proved after merge.

## References

- **REF-001**: `.github/workflows/dependabot-auto-merge.yml`
- **REF-002**: `docs/architecture/ci.md`
- **REF-003**: `.github/repository-settings/repository.json`
- **REF-004**: `.github/repository-settings/workflow-permissions.json`
- **REF-005**: `.github/dependabot.yml`
- **REF-006**: `docs/context/2026-08-24-dependabot-grouping-and-refresh-tuning.md`
