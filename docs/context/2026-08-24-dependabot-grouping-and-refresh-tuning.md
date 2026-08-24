# Context Note — Dependabot Grouping and Refresh Tuning

Date: 2026-08-24

## Verified Baseline

- Dependabot created 48 pull requests from July 1 through August 24, 2026.
- The final live snapshot showed all 48 merged and no open Dependabot pull requests.
- Routine npm updates were split across several thematic groups and standalone dependencies. GitHub Actions updates had no catch-all group.
- Dependabot assigned and requested review from `NoahJenkins`, which added direct notification noise to autonomous updates.
- The behind-refresh workflow ran 96 times from its six-hour August schedule, once from `push`, and once from `pull_request_target`.
- Dependabot bot merges did not trigger the event paths in the reviewed sample. Queued Dependabot pull requests recovered through Dependabot self-rebases.

## Compatibility Boundaries Reviewed

No proven compatibility boundary required separate routine patch/minor groups. Major version updates preserve a smaller blast radius by remaining standalone. Existing strict checks and the changed-file allowlist remain the compatibility gates for autonomous merging.

## Change Summary

`.github/dependabot.yml` now defines four catch-all groups:

- `npm-patch-minor`, with `applies-to: version-updates` and patch/minor update types.
- `npm-security`, with `applies-to: security-updates`.
- `github-actions-patch-minor`, with `applies-to: version-updates` and patch/minor update types.
- `github-actions-security`, with `applies-to: security-updates`.

The configuration has no reviewer, assignee, or ignore entries. Security updates are not put behind the weekly routine-update schedule by an ignore rule. Safe major updates remain standalone and retain native squash auto-merge eligibility when the Dependabot identity, main-base, non-draft, ecosystem, update-type, changed-file, and protected-check gates pass.

The auto-merge and refresh jobs each have a five-minute timeout. The refresh workflow keeps `push`, merged `pull_request_target: closed`, and `workflow_dispatch` recovery paths. Its fallback schedule changes from every six hours to daily at `20:23 UTC`. Update-branch API failures now fail the refresh job.

## Refresh Evidence and Decision

The observed event distribution does not prove that `push` or merged-PR triggers reliably run after token-created Dependabot merges. It also does not prove that Dependabot self-rebase will always recover several queued auto-merge pull requests. The refresh mechanism therefore remains in place.

The daily fallback is proportionate to the observed behavior: it reduces scheduled noise while keeping a bounded automatic recovery path and a manual dispatch path.

## Expected Effect

- Historical replay estimates about 13 grouped pull requests instead of 48, a reduction of about 73% or 4.4 pull requests per week.
- The daily fallback reduces scheduled refresh runs from 28 to 7 per week, a reduction of 21 runs or 75%.
- Removing reviewer and assignee entries stops Dependabot from directly routing every new update to the maintainer. GitHub notification preferences can still produce other update email or web notifications.

## Verification

Completed locally with Node 22 and pnpm 10.33.0:

- frozen installation;
- actionlint 1.7.12 and YAML/JSON parsing;
- TypeScript and lint, with 19 pre-existing lint warnings and no errors;
- 49 Jest tests;
- a successful diagnostic Next.js webpack production build;
- 16 Playwright tests.

The exact `pnpm build` command reached a Turbopack local worker-port restriction in this execution environment. The draft pull request's hosted `Build Check` remains the required proof for the exact build command.

The repository policy contract covers:

- grouped routine npm and GitHub Actions updates;
- grouped npm and GitHub Actions security updates;
- standalone safe major updates;
- failed updates;
- changed-file-disallowed updates;
- behind-branch refresh behavior and failure reporting;
- the four exact required check names and strict current-base configuration.

## Remaining Hosted Proof

Local configuration and policy tests cannot create future Dependabot pull requests. After merge, hosted evidence is still required to prove:

- the generated shapes of routine and security groups;
- immediate security-update handling;
- standalone major-update behavior;
- recovery of multiple queued auto-merge pull requests after one advances `main`;
- the event-versus-daily-fallback path used for a real behind branch;
- the exact Turbopack production build in the hosted `Build Check`.

## Related

- `.github/dependabot.yml`
- `.github/workflows/dependabot-auto-merge.yml`
- `.github/workflows/dependabot-behind-refresh.yml`
- `docs/adr/adr-0001-dependabot-auto-merge-policy.md`
- `docs/architecture/ci.md`
- `docs/architecture/ci-cd-pipeline.md`
