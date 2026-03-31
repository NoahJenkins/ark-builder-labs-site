---
title: "ADR-0001: Dependabot Auto-Merge Policy"
status: "Amended"
date: "2026-03-31"
authors: "Maintainer"
tags: ["architecture", "decision", "ci", "security", "dependabot"]
supersedes: ""
superseded_by: ""
---

# ADR-0001: Dependabot Auto-Merge Policy

## Status

Amended (2026-03-31: codified repository automation settings and added behind-branch refresh)

## Context

Dependency updates improve security and maintenance but unattended merging can introduce regressions. The repository needs automated merges for Dependabot updates while preserving strict guardrails.

Three bugs were discovered across the 2026-03-16 and 2026-03-31 investigations:
1. The ecosystem gate matched `npm` but `dependabot/fetch-metadata` reports `npm_and_yarn` — all npm PRs were permanently ineligible.
2. Repository `allow_auto_merge` was `false`, causing the `enablePullRequestAutoMerge` GraphQL mutation to silently fail.
3. Actions workflow permissions had `can_approve_pull_request_reviews=false`, causing the auto-approval step to fail with `GitHub Actions is not permitted to approve pull requests`.

An operational gap was also identified on 2026-03-31: eligible PRs with auto-merge enabled could remain open indefinitely once they became `behind` `main` under strict status checks.

## Decision

Enable auto-merge for Dependabot pull requests that satisfy all constraints:
- PR actor and author are `dependabot[bot]`
- Base branch is `main`
- PR is not draft
- Ecosystem is `npm`, `npm_and_yarn`, or `github-actions`
- Update type is `version-update:semver-patch`, `version-update:semver-minor`, or `version-update:semver-major`
- Changed files are restricted to dependency/workflow allowlist

If eligible, the workflow auto-approves and enables native GitHub auto-merge with squash.

Repository automation settings are part of the policy and must remain aligned with tracked config:
- `allow_auto_merge == true`
- `allow_update_branch == true`
- `allow_squash_merge == true`
- `default_workflow_permissions == read`
- `can_approve_pull_request_reviews == true`

Eligible Dependabot PRs with auto-merge already enabled should be refreshed automatically when they become `behind` `main`.

## Consequences

### Positive

- **POS-001**: Reduces maintainer toil for all Dependabot updates.
- **POS-002**: Keeps update velocity high for security and maintenance patches.
- **POS-003**: Preserves review/control boundaries through strict file scope gates.

### Negative

- **NEG-001**: Non-allowlisted file changes still require manual intervention.
- **NEG-002**: Misconfigured allowlists can block legitimate updates.
- **NEG-003**: Major version auto-merges rely on CI coverage catching regressions.
- **NEG-004**: Repository-level settings drift can break automation even when workflow code is unchanged.

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
- **IMP-005**: `scripts/apply-repository-settings.sh` applies and verifies repo-level automation settings.
- **IMP-006**: `.github/workflows/dependabot-behind-refresh.yml` refreshes auto-merge-enabled Dependabot PRs when they fall behind `main`.
- **IMP-007**: `.github/workflows/repository-settings-health.yml` detects settings drift.

## References

- **REF-001**: `.github/workflows/dependabot-auto-merge.yml`
- **REF-002**: `docs/architecture/ci.md`
- **REF-003**: `.github/repository-settings/repository.json`
- **REF-004**: `.github/repository-settings/workflow-permissions.json`
