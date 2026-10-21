# Dependabot controller setup

This is a local implementation, not an activated service. No App, secret, environment, issue, repository setting, branch protection or workflow run was created by this change. Keep both enable flags false until the setup and an operator-approved canary pass.

## Behavior

The controller preserves the existing pnpm/npm and GitHub Actions semver eligibility, including major updates. Roofer uses its existing classifier. Ark uses the same strict metadata/version proof for all three semver classes. A separate protected-scope check permits only dependency fields, verified upstream Action references and small application source repairs. Commands, existing tests, agent instructions and security-sensitive paths cannot be changed by repair. Unsupported updates remain open for manual work.

Reconciliation runs on PR events, completed CI, commit status, deployment status, manual dispatch and a two-hour schedule. Only a verified current-main run can start recovery or a paid agent session. Each PR has separate lifetime limits of **two repair attempts, two CI retries and two branch refreshes**. A new head or UTC day does not reset these limits. A reservation is saved before the side effect; timeout, crash and ambiguous write consume the attempt. There are also daily dispatch limits of two per recovery kind and eight independent reviews. Reads have at most one transient retry. Writes are never retried automatically. Exhausted work appears as an action-required `Dependabot Merge Gate` check; no PR is closed.

The controller checks current head, current main ancestry, trusted CI workflow/job/check IDs, `TypeScript & Lint`, `Jest Tests`, `Build Check` and `Playwright Tests`, trusted Vercel preview evidence and a separate review bound to that exact head/base. Empty GitHub workflow PR arrays use the authenticated exact-head commit-to-PR association. It rechecks the state before releasing the App-bound merge gate. Native squash auto-merge also enforces the expected head.

Repair uses OpenCode Go `kimi-k2.7-code`; review uses a fresh `glm-5.3` session. The pinned 1.19.0 runtime and broker are copied from the existing portfolio implementation. The agent container has no GitHub token or provider key, no external network and no shell/task/plugin tools. It receives curated files as data. A separate broker accepts only bounded requests for the fixed model. A fresh secret-free validator runs the repository checks; a separate publisher validates artifact hashes, trusted run/job provenance, durable claims and current head/base before an atomic commit or review check. CI and independent review must run again after a repair. No placeholder dispatch endpoint is used.

## Activation prerequisites

1. Install a **dedicated GitHub App on this repository only**. Grant contents, pull requests, checks and issues write; Actions write for bounded workflow retries; administration, deployments and commit statuses read. Workflow-file repair also requires the App's Workflows write permission. Do not reuse `REPO_ADMIN_TOKEN`. The controller does not need branch-protection bypass.
2. Create `dependabot-controller` and `dependabot-dispatch` environments. Restrict both to the protected `main` branch before adding secrets. Add `DEPENDABOT_CONTROLLER_PRIVATE_KEY` only to the controller environment and `OPENCODE_GO_API_KEY` only to the dispatch environment. Keep each environment's approval rules consistent with the intended unattended operation.
3. Create a dedicated state issue and configure repository variables: `DEPENDABOT_CONTROLLER_APP_ID`, `DEPENDABOT_STATE_ISSUE_NUMBER`, `DEPENDABOT_VERCEL_APP_ID` (`8329`), `DEPENDABOT_VERCEL_PROJECT_PREFIX` (exact `https://vercel.com/<team>/<project>/` prefix), `DEPENDABOT_DEPLOYMENT_ENVIRONMENT` (normally `Production`) and `DEPENDABOT_DEPLOYMENT_BASELINE_ID` (the verified latest successful GitHub production deployment ID). A missing production baseline blocks merge and repair.
4. Enable native squash auto-merge. Require strict current-base protection, all CI checks listed above, the existing one-approval floor and `Dependabot Merge Gate` bound to the dedicated App ID. Preserve Ark’s existing `dismiss_stale_reviews: false` and code-owner review policy; the controller does not demand new stale-dismissal or human-review rules. Its separate authenticated current-head/base OpenCode review remains mandatory. Keep the App out of all bypass lists. Existing settings files are not proof that these live controls exist.
5. Set `DEPENDABOT_AUTOMATION_ENABLED` and `DEPENDABOT_AGENT_ENABLED` to `true` only after reviewing the exact default-branch implementation and approving the configured cost boundary. Cancel any legacy queued auto-merges before this transition. Confirm the source check, missing-evidence stops, model access, no-secret validation, fresh review and final gate in a controlled canary.

A missing App produces a visible setup-required job. Missing or invalid ledger, provider credentials, provenance, current checks or protection fails closed. The API and container paths are covered by local contract tests; the real App, container runtime and paid-provider path still need a hosted canary.

## Production failure and manual recovery

The controller reads GitHub production deployments at or after the configured baseline and accepts only Vercel's bot identity. It also checks the trusted Vercel commit status for the current `main` branch head. This covers Vercel updates that do not create a new GitHub deployment record and prevents another merge while production is pending. An error/failure status creates a durable `productionBlock` in the App-authored state ledger and blocks subsequent automated merges. A later successful deployment does not remove the block. The monitor also reads authenticated commit status history from the baseline through current production ancestry, so rapid recovery or a later production head cannot hide an earlier failure. This is conservative: a preview failure on that ancestry after the baseline can require manual review. More than 100 commits or divergent ancestry stops automation until an operator reviews and advances the baseline. A monitor API failure still scans open PRs, revokes queued bot auto-merges and blocks their gates before the workflow reports failure. Production-branch deployment events can be skipped by the main-only environment boundary; default-branch status events and the schedule provide reconciliation without relaxing that boundary. Rollback and production promotion remain manual. If GitHub has no complete deployment evidence, automation waits.

After the operator verifies recovery, advance the baseline to that successful deployment and remove only `productionBlock` from the existing ledger. Preserve every reservation and claim; deleting or replacing the ledger resets lifetime accounting and is not a supported recovery step. Inspect consumed attempts before any manual retry. Archive a full ledger only under an explicit migration that preserves lifetime counters.

## Verification

Run `node --test .github/scripts/dependabot-recovery.contract.cjs` and `actionlint .github/workflows/dependabot-auto-merge.yml`. The normal CI checks also run the controller policy tests. The validator runs dependency resolution with lifecycle scripts disabled, lint, type checks, unit tests and build. Required hosted browser tests run after publication and remain mandatory for merge.

### Recovery provenance

Automatic merge and recovery require controller code from the current `main`
commit. A queued run from an older workflow revision leaves the merge gate
pending and cancels existing automatic merge intent.

CI retry reservations record the authenticated workflow run ID and run attempt.
A later interrupted attempt on the same PR commit can use the second retry, but
a duplicate event cannot repeat a write. The run and attempt are checked again
before dispatch. Old reservations without these fields remain consumed and block
repeat recovery for that head. The two-attempt lifetime and daily limits still
apply. GitHub's accepted, bodyless HTTP 201 rerun response is treated as success.

Interrupted CI is classified after authenticating the run, PR commit, repository,
workflow, and tested base, before requiring job/check completion. This permits
bounded recovery when cancellation occurs before jobs start. Successful CI still
requires every expected job and matching check before merge.

Workspace override updates accept quoted or plain version values, package/version selectors, parent-to-child selectors, and comments. The scope check preserves all other workspace sections, including patch paths and build permissions. Unsupported YAML forms and duplicate override keys fail closed.

The scope check compares PR file changes against the authenticated common ancestor of current main and the PR head. This permits bounded refresh when main changed unrelated protected settings. After refresh, the common ancestor must equal current main before merge can proceed. Missing or contradictory comparison evidence blocks the controller.
CI commit-to-PR fallback is used only when the run association list is explicitly empty. Populated contradictory associations and missing lists cannot authenticate a run.

For grouped updates, complete update-type metadata retains precedence. If metadata covers fewer than the declared group members, classification uses the full version-transition list instead. That list must still contain exactly the declared number of proven updates; missing members and downgrades remain blocked.

Each reconciliation reserves at most ten model tasks, matching the claim limit. Excess work waits for another run without consuming a reservation, including when reconciliation crosses UTC midnight. Daily and per-PR limits remain unchanged.

Production health requires the latest trusted Production deployment to succeed for the current production branch SHA. A successful preview status cannot substitute for that deployment. The branch SHA is read again before accepting health; advancement during inspection blocks merge.

Repair snapshots authorize the PR delta against its authenticated merge base and retain current-main content for conflict repair. Dependency generation runs before the validation checks in a separate secret-free container. The host records the submitted files and generated dependency files before checks, rejects later byte changes, and publishes only those recorded bytes. Both phases share the existing 20-minute execution limit.
Existing tag-based action updates remain supported, but an immutable SHA reference cannot become a mutable tag. Upstream tag resolution does not override this restriction.

For a conflicted file already present in the authenticated PR snapshot, validation and publication may use current-main content as the comparison baseline when the head comparison fails. The same repository file policy must pass against that baseline. This permits preserving main-side settings while retaining dependency updates; it does not authorize new protected edits, unrelated context files, or relaxed action-pin checks.
The controller applies this same comparison after publication so a repaired head can reach bounded branch refresh and fresh current-base CI. Main-side fallback cannot remove an existing immutable action pin.
Unchanged generated dependency files are validated separately from the submitted file set. They do not reduce its 64-file capacity; changed output still obeys the existing 64-file and total-byte limits.

When repair output adopts main-side policy, it must retain every dependency target from the authenticated PR head that differs from main. Validation and publication both enforce this rule, including grouped updates. Copying main must not erase an update, remove its dependency, or partially revert a group. A mutable action tag may adopt main's immutable SHA only for the same version; an existing SHA target must remain exact. Ambiguous or conflicting targets fail closed for operator review. This restriction applies to repair output, not the ancestor-relative comparison used during reconciliation.

Immutable workflow pins are matched by job and action occurrence when adopting main-side content. Comments and job settings do not change that identity, while repeated action steps cannot exchange their protection. Scope checks, upstream verification, and both retention checks share one executable-reference parser. It recognizes quoted references, CRLF line endings, anchored job declarations, and steps whose sequence marker is on its own line. Only direct job-level reusable workflow references and executable step references count; environment and input keys named `uses` are data. Reconciliation permits authenticated main-side comparison for modified files even when the merge-base file is empty.

SHA references without a version comment are checked against the exact upstream commit. Mutable version tags retain their existing eligibility; SHA-to-tag changes remain blocked.

Flow-style step and reusable-workflow mappings are expanded as data before executable references are inspected. Protected scalar values stay in the scope comparison. Duplicate keys, malformed collections, excessive nesting, and unsupported syntax block the candidate.

Repair snapshots retain authenticated merge-base file content. When main inserts another occurrence of an action, repair guards use a unique ordered match from that ancestor to main to retain the original PR target. Ambiguous matches, rollback, and assigning the update to the inserted occurrence are rejected. The snapshot byte limit remains unchanged.

The 64-file review limit applies to the entire resulting PR. Validation and publication count original PR files plus newly changed repair or generated files. Unchanged generated files do not consume capacity. An oversized candidate is rejected before tests or publication.
