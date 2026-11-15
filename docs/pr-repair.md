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
- Originals: `.github/workflows/dependabot-auto-merge.yml` queues native auto-merge on in-scope Dependabot PRs (`merge.originals` is `false`, so pr-repair never touches them). Dependabot rebases only *conflicting* PRs, not ones that are merely behind, so while `main` requires up-to-date branches (strict) a behind update stays queued until someone comments `@dependabot rebase`. Turn strict off to avoid that.
- When it runs: after failed `CI` on `dependabot/**` branches, after every `CI` run on `pr-repair/**` branches (a green replacement moves on to review and merge), plus one daily sweep (09:41 UTC), `workflow_dispatch`, and a contract self-test on PRs that edit its policy or workflow.
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

Rollback: delete `PR_REPAIR_ENABLED`.
