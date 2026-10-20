# Dependabot recovery implementation plan

1. Retain the current update eligibility policy and CI requirements.
2. Reuse the trusted OpenCode worker, broker, validator and publisher boundary.
3. Add event and scheduled reconciliation, with at most two repair, two CI retry and two branch refresh attempts per PR across its lifetime.
4. Require current head/base checks, independent review and an App-bound gate before native squash merge.
5. Persist a production deployment failure latch; operator action is required to clear it.
6. Verify the policy and isolated execution contracts locally. Keep activation, credentials and hosted checks outside this local change.

## Local verification (2026-10-20)

- Controller contracts: 20 passed, including stale head/base, CI association, lifetime limits, production latch, scope protection and isolated worker output.
- Workflow syntax: actionlint passed.
- Ark: lint passed with 19 existing warnings; typecheck, 60 Jest tests and build passed under Node 22. The pinned Node 22 validator image built locally and its actual secret-free validation command passed in a disposable candidate: lockfile resolution/install, lint, typecheck, 60 Jest tests and build. Raw log: `/tmp/ark-dependabot-validator-20261020.log`.
- Not performed: App activation, environment or secret changes, paid model calls, hosted repair/publication canary, production changes, commit, push or PR creation.

The live GitHub API returned empty pull-request arrays on both workflow runs and check runs. The controller therefore also verifies the authenticated commit-to-PR association, exact CI head and branch, and current-main ancestry. This is a reusable API compatibility check.
