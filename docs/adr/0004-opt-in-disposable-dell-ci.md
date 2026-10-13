# ADR 0004: Opt-In Disposable Dell CI

## Status
Prepared for review, 2026-10-13. Live infrastructure acceptance and activation are pending.

## Context
The four protected checks in `.github/workflows/ci.yaml` can use repository-scoped disposable workers on `optiplex-7040`. Fork PRs must continue on GitHub-hosted Ubuntu, and repository policy automation must remain hosted. Only the exact repository variable value `OPTIPLEX_CI_ENABLED=true` opts in. GitHub Actions compares strings without regard to case, so an ordinary expression comparison would also enable `TRUE`; see [GitHub expressions](https://docs.github.com/en/actions/reference/workflows-and-actions/expressions#operators).

## Options considered
1. Keep every check hosted: safe fallback, but no Dell execution.
2. Put the opt-in expression directly in each `runs-on`: rejects missing/false values but does not enforce the required case-sensitive value.
3. Compute one runner label in a small hosted job using Bash, then pass it to the existing checks: enforces exact opt-in and repository-origin trust without checking out PR code.

## Decision
Use option 3. `runner-routing` stays on `ubuntu-latest`. Its Bash comparison selects `optiplex-ci-ubuntu24` only for exact `true` on pushes or PRs whose head repository equals the current repository; all other cases select the original `ubuntu-latest`. Trust depends on repository origin, never the actor, including Dependabot-authored forks.

`TypeScript & Lint` gains a routing dependency. `Jest Tests`, `Build Check`, and `Playwright Tests` depend on both routing and typecheck, preserving their existing typecheck gate and relationship to one another. This added hosted prerequisite is the documented compatibility adjustment; no protected check is renamed or removed. Triggers, permissions, action versions, cancellation, timeouts, installs, caches, diagnostics, and uploads remain unchanged.

Each Dell job requires a fresh reviewed Ubuntu 24.04 x64 VM, with no shared writable home/workspace or host access. The infrastructure controller owns pool-wide concurrency (initially one job, at most 4 vCPUs and 16 GiB RAM) and disk destruction on every terminal outcome. The repository does not implement or increase these limits. Browser dependencies install inside that VM.

## Consequences
- Missing, disabled, malformed, or differently cased opt-in values preserve hosted execution, as do fork PRs.
- The added hosted routing job contributes a small queue/setup delay. Existing protected checks still queue normally when the Dell pool is busy.
- Policy automation, Copilot setup, GitHub-managed Dependabot/CodeQL, and Vercel deployment are unchanged.
- A prepared PR and local/hosted checks do not prove Dell acceptance. Exact-head execution, fork routing, artifacts, and controller cleanup evidence are required before activation.
- Rollback begins by disabling/unsetting the variable through an authorized operator, then rerunning affected checks; reverting this migration restores the original selectors and dependencies.

See [pipeline requirements and acceptance](../architecture/ci-cd-pipeline.md#dell-image-and-controller-contract), [protected checks](../architecture/ci.md#runner-routing), and [implementation context](../context/2026-10-13-optiplex-ci-preparation.md).
