# Optiplex CI Preparation

Date: 2026-10-13

## Summary
Prepare Ark Builder Labs CI for repository-scoped disposable Dell workers. Base inspected: live `origin/main`, `dec8e7b`. Implementation and validation use an isolated worktree; existing work is preserved. This is preparation for a draft PR, not live migration acceptance. No repository variable, settings, branch protection, secret, service, deployment, or runner registration is changed.

## Scope and routing
Only `typecheck`, `jest-tests`, `build`, and `playwright-tests` in `.github/workflows/ci.yaml` migrate. Their original `ubuntu-latest` runner remains the fallback. A new hosted `runner-routing` job uses Bash to require the exact opt-in value `true` and to exclude PRs from another head repository regardless of actor. This avoids GitHub expression comparisons accepting differently cased strings. Existing protected names and typecheck ordering are preserved; a routing prerequisite is the only added dependency.

Frozen installs, Node 22, pnpm 10.33.0, Next.js and Playwright caches, conditional Jest coverage upload, and failure-only Playwright diagnostics remain unchanged. CI Playwright starts its own dev server with `reuseExistingServer: false`. Browser setup and cache restoration stay inside each disposable guest.

## Verification record
Validation ran locally on macOS arm64 with Node 22.23.3, pnpm 10.33.0, and isolated portable Ruby 3.4.5. The system Ruby 2.6 cannot run the pre-existing `filter_map` use; no system installation or repository workaround was added.

| Check | Local result |
| --- | --- |
| `pnpm install --frozen-lockfile --prefer-offline` | Passed |
| `pnpm exec tsc --noEmit` | Passed |
| `pnpm lint` | Passed; 19 existing unused-variable warnings |
| `pnpm run test:workflow-policy` | Passed, including 17 routing scenarios |
| `pnpm test` | Passed: 6 suites, 49 tests |
| `pnpm build` | Passed |
| `CI=true pnpm test:e2e` | Environment blocked: T3 already occupies port 3000; CI correctly refuses server reuse |
| E2E diagnostic with temporary `/tmp` config on port 3107 | Fresh server started; browser launch blocked by missing Chromium executable. Browser installation failed at the CDN with TLS `EPROTO`; curl reproduced the TLS failure. Stopped after first failure (4 concurrent failures, 12 not run). No tracked Playwright/app changes. |
| actionlint 1.7.12, all six workflow files | Passed; optional shellcheck unavailable |
| `git diff --check` | Passed |

Routing-policy coverage executes the YAML selection script for enabled, disabled, missing, invalid/case-variant, same-repository, and fork cases, including Dependabot forks. Existing dependency actor, changed-file, and protection rules remain intact. Read-only repository variable inspection found the opt-in absent; no variable was changed. Hosted [CI run 38484057411](https://github.com/NoahJenkins/ark-builder-labs-site/actions/runs/38484057411) passed at implementation revision `e7e5c1dc1de0fe053bd0880740ab947a6dcfdc58`, including all four protected checks and routing. GitHub job metadata confirms all five jobs used `ubuntu-latest`; this proves missing-variable fallback, not Dell execution. Hosted browser installation and E2E succeeded despite the local CDN blocker. These documentation results are a follow-up commit; the final PR-head run is reported in [draft PR #166](https://github.com/NoahJenkins/ark-builder-labs-site/pull/166) and the handoff.

Actual Dell execution: pending infrastructure acceptance. No successful Dell workflow or disk-cleanup proof is claimed. The [pipeline acceptance checklist](../architecture/ci-cd-pipeline.md#live-acceptance-and-rollback) defines the remaining evidence.

## Related documents
- [ADR 0004: Opt-In Disposable Dell CI](../adr/0004-opt-in-disposable-dell-ci.md)
- [Runner routing and hosted policy jobs](../architecture/ci.md#runner-routing)
- [Image/package contract and rollback](../architecture/ci-cd-pipeline.md#dell-image-and-controller-contract)
- [Outstanding acceptance work](../TODO.md#dell-ci-preparation)
