# Project Task Tracker

Last Updated: 2026-10-13

> Living document for major project tasks. Update status continuously during planning and implementation.

## Onboarding
- [x] Run repository analysis and detect tech stack
- [x] Establish docs structure (`docs/architecture/`, `docs/adr/`, `docs/context/`)
- [x] Create initial ADR (`docs/adr/0001-adopt-documentation-structure.md`)
- [x] Generate onboarding summary report

## Architecture & Documentation
- [x] Add/update architecture documentation
- [x] Add context/research notes and update `docs/context/index.md`
- [x] Record new architectural decisions as ADRs

## Security & Quality
- [x] Run dependency/security audit
- [x] Review secret handling and `.gitignore` coverage
- [x] Address critical/high findings

## Security and Automation Hardening
- [x] Add Dependabot auto-merge workflow with strict eligibility gates
- [x] Add branch protection configuration as code with apply + verification automation
- [x] Preserve admin direct-push bypass (`enforce_admins: false`)
- [x] Add shared output encoding utilities (`encodePathSegment`, `escapeXml`, `toSafeJsonLd`)
- [x] Apply sink-level URL path encoding for dynamic service/blog links
- [x] Add targeted unit tests for security helpers
- [x] Document architecture, decisions (ADRs), and implementation context

## Dell CI Preparation
- [x] Prepare opt-in routing for the four protected CI checks without changing their names or policy workflows
- [x] Document disposable VM/image requirements, fork fallback, acceptance evidence, and rollback
- [x] Run requested local validation and workflow lint; record the local E2E environment blocker in [context](context/2026-10-13-optiplex-ci-preparation.md)
- [ ] Obtain successful E2E/hosted validation for the exact draft PR head
- [ ] Infrastructure agent: accept the reviewed Ubuntu 24.04 image and prove VM cleanup on success, failure, cancellation, and timeout
- [ ] Authorized operator: after infrastructure acceptance, validate the exact PR head on Dell and prove hosted fork routing, caches, and artifacts; live activation remains pending

## Blocked
- [ ] # TODO: Decide whether to standardize on `pnpm` lockfile only and remove `package-lock.json` (dependency reproducibility policy)

## Follow-ups
- [ ] Review allowlisted files and update types quarterly
- [ ] Add regression tests when JSON-LD and RSS/XML sinks are introduced
- [ ] # TODO: Assign owners and due dates for ongoing security/dependency maintenance tasks

## Definition of Done
- [x] Acceptance criteria are met
- [x] Relevant docs are updated (`README`, ADRs, context notes, or architecture docs as applicable)
- [x] Security/quality checks for the change are completed
- [x] Any follow-up work is captured as new TODO items
