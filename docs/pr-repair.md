# pr-repair

`.github/workflows/pr-repair.yml` calls the shared controller
[`NoahJenkins/.github/pr-repair`](https://github.com/NoahJenkins/.github/tree/main/pr-repair)
at a pinned commit. Repository policy is `.github/pr-repair.json` on `main`;
pull requests cannot change it for themselves.

## What it does here

- Scope: npm patch and minor updates (majors only with a security fix) and GitHub Actions updates.
- A failing eligible update gets a bounded repair (default 2 per update, 6
  model tasks a day). Candidate checks run in credential-free containers
  first. The controller App then publishes a replacement PR on
  `pr-repair/<number>`.
- The replacement needs the required checks and an independent review of its
  exact head. Then native auto-merge is queued with `expectedHeadOid`, and only
  while the latest Production deployment succeeded. The original closes after
  the replacement merges, if its head did not move.
- Originals: pr-repair merges in-scope Dependabot updates itself once the
  required checks pass on the current head, and only while the latest
  Production deployment succeeded. The controller App approves the exact head
  first (`merge.approve: "app"`), because
  `.github/branch-protection/main.json` declares one required approval. Because `main` requires up-to-date
  branches and no account Dependabot obeys is configured, the App brings a
  behind update up to date (update-branch) once per head. Dependabot stops
  rebasing a branch someone else pushed to, so if such an update later
  conflicts, it is reported as `needs-human`: comment `@dependabot recreate`.
  The legacy controller in `dependabot-auto-merge.yml` stays off
  (`DEPENDABOT_AUTOMATION_ENABLED=false`).
- Human pull requests are never repaired, approved, resolved, or merged.

Every Dependabot PR shows one state on its `pr-repair` check and on the
`pr-repair status` issue. Possible states include `missing-configuration`,
`unsupported-scope`, `exhausted`, `conflict`, `production-paused`, and
`queued-merge`.

## Credentials

Plan and publish use the `noah-ark-dependabot` App (`DEPENDABOT_CONTROLLER_APP_ID`, private key in the `dependabot-controller` environment). Inference uses only `AI_GATEWAY_API_KEY` from the `dependabot-dispatch` environment. Prepare and validate use a read-only `GITHUB_TOKEN`. No secret reaches candidate code.

## Model

Vercel AI Gateway: `openai/gpt-6-luna` repairs and `deepseek/deepseek-v4-flash` reviews, so a different model family checks every repair. There is no fallback model or provider. A missing `AI_GATEWAY_API_KEY` pauses paid work and reserves nothing.

## Activation

1. Merge this workflow and policy. Until step 2 it only reports status.
2. Set the repository variable `PR_REPAIR_ENABLED=true`.
3. Keep `DEPENDABOT_AUTOMATION_ENABLED` unset or `false`. While it is `true`, pr-repair holds off so two controllers never act on one PR.

Rollback: delete `PR_REPAIR_ENABLED`.
