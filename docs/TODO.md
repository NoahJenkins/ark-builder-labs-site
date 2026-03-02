# TODO Tracker

Last updated: 2026-03-02

## Security and Automation Hardening

- [x] Add Dependabot auto-merge workflow with strict eligibility gates.
- [x] Add branch protection configuration as code with apply + verification automation.
- [x] Preserve admin direct-push bypass (`enforce_admins: false`).
- [x] Add shared output encoding utilities (`encodePathSegment`, `escapeXml`, `toSafeJsonLd`).
- [x] Apply sink-level URL path encoding for dynamic service/blog links.
- [x] Add targeted unit tests for security helpers.
- [x] Document architecture, decisions (ADRs), and implementation context.

## Follow-up

- [ ] Review allowlisted files and update types quarterly.
- [ ] Add regression tests when JSON-LD and RSS/XML sinks are introduced.
