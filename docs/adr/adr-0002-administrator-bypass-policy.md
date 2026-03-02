---
title: "ADR-0002: Administrator Bypass Policy"
status: "Accepted"
date: "2026-03-02"
authors: "Maintainer"
tags: ["architecture", "decision", "ci", "governance"]
supersedes: ""
superseded_by: ""
---

# ADR-0002: Administrator Bypass Policy

## Status

Accepted

## Context

Branch protection is required for quality and consistency, but maintainer workflows include direct administrative pushes from local tooling. The branch protection model must preserve this emergency/maintenance path.

## Decision

Set `enforce_admins: false` in `main` branch protection to keep administrator bypass enabled while still requiring:
- 1 approving review
- exact required status checks from CI jobs

## Consequences

### Positive

- **POS-001**: Preserves maintainer operational flexibility.
- **POS-002**: Keeps standard review/check gates for non-admin contributors.
- **POS-003**: Reduces friction during urgent fixes.

### Negative

- **NEG-001**: Admin pushes can bypass normal protections if misused.
- **NEG-002**: Requires explicit governance discipline.
- **NEG-003**: Needs periodic policy review and audit.

## Alternatives Considered

### Enforce Admins Strictly

- **ALT-001**: **Description**: Set `enforce_admins: true`.
- **ALT-002**: **Rejection Reason**: Conflicts with intended maintainer direct-push workflow.

### No Branch Protection

- **ALT-003**: **Description**: Rely only on social process.
- **ALT-004**: **Rejection Reason**: Insufficient quality and governance controls.

## Implementation Notes

- **IMP-001**: Policy captured in `.github/branch-protection/main.json`.
- **IMP-002**: Apply/verify automation in `scripts/apply-branch-protection.sh` and `.github/workflows/branch-protection.yml`.
- **IMP-003**: Verification checks `enforce_admins.enabled == false` via GitHub API.

## References

- **REF-001**: `.github/branch-protection/main.json`
- **REF-002**: `scripts/apply-branch-protection.sh`
- **REF-003**: `.github/workflows/branch-protection.yml`
