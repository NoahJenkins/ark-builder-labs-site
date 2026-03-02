---
title: "ADR-0003: Standardized Output Encoding Strategy"
status: "Accepted"
date: "2026-03-02"
authors: "Maintainer"
tags: ["architecture", "decision", "security", "xss"]
supersedes: ""
superseded_by: ""
---

# ADR-0003: Standardized Output Encoding Strategy

## Status

Accepted

## Context

The application uses dynamic path segments and may add JSON-LD/RSS outputs over time. Stored-XSS risk is best mitigated at sink level using context-appropriate encoding.

## Decision

Adopt sink-specific output encoding helpers in `src/lib/security.ts`:
- `encodePathSegment(value)` for URL path segments
- `escapeXml(value)` for XML/RSS interpolation
- `toSafeJsonLd(data)` for JSON-LD script sinks (including `<`, `>`, `&`, U+2028, U+2029 escaping)

Apply encoding at sink sites instead of broad global sanitization.

## Consequences

### Positive

- **POS-001**: Prevents context-mismatch encoding mistakes.
- **POS-002**: Keeps mitigation localized and auditable.
- **POS-003**: Supports incremental adoption as new sinks appear.

### Negative

- **NEG-001**: Developers must apply helper usage consistently at every sink.
- **NEG-002**: New sink types require explicit helper additions.
- **NEG-003**: Missed sinks remain a residual risk without targeted tests.

## Alternatives Considered

### Generic Global Sanitization

- **ALT-001**: **Description**: Sanitize all values broadly.
- **ALT-002**: **Rejection Reason**: Often breaks valid content and does not guarantee context safety.

### No Shared Utility Layer

- **ALT-003**: **Description**: Inline ad-hoc escaping where needed.
- **ALT-004**: **Rejection Reason**: Increases inconsistency and maintenance risk.

## Implementation Notes

- **IMP-001**: Helpers implemented in `src/lib/security.ts`.
- **IMP-002**: Dynamic blog/service link segments now encode path components at sink sites.
- **IMP-003**: Unit tests added in `src/__tests__/lib/security.test.ts`.

## References

- **REF-001**: `src/lib/security.ts`
- **REF-002**: `src/__tests__/lib/security.test.ts`
