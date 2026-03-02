---
title: "ADR-0001: Dependabot Auto-Merge Policy"
status: "Accepted"
date: "2026-03-02"
authors: "Maintainer"
tags: ["architecture", "decision", "ci", "security", "dependabot"]
supersedes: ""
superseded_by: ""
---

# ADR-0001: Dependabot Auto-Merge Policy

## Status

Accepted

## Context

Dependency updates improve security and maintenance but unattended merging can introduce regressions. The repository needs automated merges for low-risk Dependabot updates while preserving strict guardrails.

## Decision

Enable auto-merge only for Dependabot pull requests that satisfy all constraints:
- PR actor and author are `dependabot[bot]`
- Base branch is `main`
- PR is not draft
- Ecosystem is `npm` or `github-actions`
- Update type is `version-update:semver-patch` or `version-update:semver-minor`
- Changed files are restricted to dependency/workflow allowlist

If eligible, the workflow auto-approves and enables native GitHub auto-merge with squash.

## Consequences

### Positive

- **POS-001**: Reduces maintainer toil for low-risk dependency updates.
- **POS-002**: Keeps update velocity high for security and maintenance patches.
- **POS-003**: Preserves review/control boundaries through strict file and update-type gates.

### Negative

- **NEG-001**: Non-allowlisted updates still require manual intervention.
- **NEG-002**: Misconfigured allowlists can block legitimate updates.
- **NEG-003**: Workflow logic requires periodic policy review.

## Alternatives Considered

### Manual Merge Only

- **ALT-001**: **Description**: Keep all Dependabot updates fully manual.
- **ALT-002**: **Rejection Reason**: Increased operational overhead and slower patch adoption.

### Unrestricted Dependabot Auto-Merge

- **ALT-003**: **Description**: Auto-merge all Dependabot PRs.
- **ALT-004**: **Rejection Reason**: Risk profile too high without ecosystem/type/file scope constraints.

## Implementation Notes

- **IMP-001**: Implemented in `.github/workflows/dependabot-auto-merge.yml`.
- **IMP-002**: Uses `dependabot/fetch-metadata` plus changed-file allowlist validation.
- **IMP-003**: Uses GitHub native auto-merge with `SQUASH` method.

## References

- **REF-001**: `.github/workflows/dependabot-auto-merge.yml`
- **REF-002**: `docs/architecture/ci.md`
