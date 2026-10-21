'use strict'
const { expandWorkflowFlow } = require('./dependabot-workflow-shape.cjs')

const REQUIRED_CHECKS = ["TypeScript & Lint", "Jest Tests", "Build Check", "Playwright Tests"]
const GATE = 'Dependabot Merge Gate'
const DEPENDABOT_ID = 49699333
const VERCEL_BOT_ID = 35613825
// The exact project prefix is configured at activation, never inferred from PR data.
const range = /^(?:[~^]|>=?)?\d+\.\d+\.\d+(?:-[a-zA-Z0-9.-]+)?$/
const nodeVersion = /^(?:2[2-9]|[3-9]\d)(?:\.\d+\.\d+|\.x)?$/

const { workflowActionReferences, workflowNodeReferences } = require('./dependabot-opencode-contract.cjs')
function actionPins(text) {
  return workflowActionReferences(text).filter(pin=>pin.sha || pin.tag)
}

function normalizeWorkflow(text, allowNode = true) {
  text=expandWorkflowFlow(text)
  const lines = text.split('\n')
  for (const pin of actionPins(text)) {
    // Preserve legacy tag updates without allowing an immutable pin to become a tag.
    lines[pin.index] = `${pin.prefix}${pin.action}@${pin.sha ? 'SHA_PIN' : 'TAG_REF'}${pin.suffix}`
  }
  if(allowNode)for(const input of workflowNodeReferences(text))if(nodeVersion.test(input.version))lines[input.index]=`${input.prefix}NODE${input.suffix}`
  return lines.join('\n')
}

function packageScope(before, after) {
  const a = JSON.parse(before); const b = JSON.parse(after)
  for (const key of ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies']) {
    if (b[key] && (typeof b[key] !== 'object' || Array.isArray(b[key]) || Object.entries(b[key]).some(([name, version]) => !/^(?:@[a-z0-9._-]+\/)?[a-z0-9._-]+$/.test(name) || typeof version !== 'string' || (!range.test(version) && a[key]?.[name] !== version)))) return false
    delete a[key]; delete b[key]
  }
  if (JSON.stringify(a.engines) !== JSON.stringify(b.engines)) {
    if (!b.engines || !nodeVersion.test(b.engines.node)) return false
    const old = { ...a.engines }; const next = { ...b.engines }; delete old.node; delete next.node
    if (JSON.stringify(old) !== JSON.stringify(next)) return false
    delete a.engines; delete b.engines
  }
  return JSON.stringify(a) === JSON.stringify(b)
}

function workspacePrefix(text) {
  const retained = []; const keys = new Set(); let inside = false; let seen = false
  for (const line of text.split(/\r?\n/)) {
    if (/^overrides:[ \t]*(?:#.*)?$/.test(line)) {
      if (seen) throw new Error('Multiple overrides maps')
      inside = true; seen = true; continue
    }
    if (inside && (!line.trim() || /^[ \t]*#/.test(line))) continue
    // Keep every other top-level section in the policy comparison.
    if (inside && /^\S/.test(line)) inside = false
    if (!inside) { retained.push(line); continue }
    const match = line.match(/^  (?:'([^']+)'|"([^"\\]+)"|([^\s:'"]+)):[ \t]*(?:'([^']+)'|"([^"\\]+)"|([^\s#]+))(?:[ \t]+#.*|[ \t]*)$/)
    const key = match && (match[1] || match[2] || match[3])
    const version = match && (match[4] || match[5] || match[6])
    // Accept pnpm package/version selectors and parent>child selectors, but no
    // YAML aliases, tags, nested objects, URLs, or local dependency targets.
    if (!match || !/^(?:@[a-z0-9._-]+\/)?[a-z0-9._-]+[a-zA-Z0-9@._/<>~=^|* -]*$/.test(key) || !range.test(version) || keys.has(key)) throw new Error('Unsupported workspace policy change')
    keys.add(key)
  }
  return retained.join('\n').trimEnd()
}

function evaluateScope(files) {
  if (!Array.isArray(files) || files.length === 0) return { allowed: false, reason: 'No changed files.' }
  for (const file of files) {
    const { filename, before, after, status } = file
    let allowed = false
    if (/(^|\/)(?:AGENTS\.md|CLAUDE\.md|auth(?:entication|orization)?|security|migrations|operations)(?:[./]|$)/.test(filename)) return {allowed:false,reason:`Protected test, instruction or security path: ${filename}`}
    // The isolated validator runs Jest, not Playwright. Existing
    // tests, setup files, ignored output directories and security paths stay protected.
    const addedTest = status === 'added' && /^src\/__tests__\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_.-]+\.(?:test|spec)\.tsx?$/.test(filename) && !filename.split('/').some(part=>['node_modules','dist'].includes(part))
    if (addedTest) continue
    if (/(^|\/)(?:AGENTS\.md|CLAUDE\.md|auth(?:entication|orization)?|security|migrations|operations|__tests__|tests?)(?:[./]|$)|\.(?:test|spec)\.[cm]?[jt]sx?$/.test(filename)) return {allowed:false,reason:`Protected test, instruction or security path: ${filename}`}
    if (status !== 'removed' && status !== 'renamed') {
      try {
        if (/(^|\/)package\.json$/.test(filename) && status === 'modified') allowed = packageScope(before, after)
        else if (filename === 'pnpm-workspace.yaml' && status === 'modified') allowed = workspacePrefix(before) === workspacePrefix(after)
        else if (filename === 'pnpm-lock.yaml' && status === 'modified') allowed = true
        else if (['.nvmrc', '.node-version'].includes(filename) && status === 'modified') allowed = nodeVersion.test(after.trim())
        else if (/^\.github\/workflows\/[^/]+\.ya?ml$/.test(filename) && filename !== '.github/workflows/dependabot-auto-merge.yml' && status === 'modified') allowed = normalizeWorkflow(before) === normalizeWorkflow(after)
        else if (filename === '.github/workflows/dependabot-auto-merge.yml' && status === 'modified') allowed = normalizeWorkflow(before, false) === normalizeWorkflow(after, false)
        else if (/^src\/(app|components|lib)\/[a-zA-Z0-9_./()\[\]-]+\.(tsx?|jsx?|css)$/.test(filename) && !filename.split('/').includes('..')) allowed = true
      } catch { allowed = false }
    }
    if (!allowed) return { allowed: false, reason: `Protected or unsupported change: ${filename}` }
  }
  return { allowed: true }
}

function eligiblePr(pr, repositoryId) {
  return pr.user?.id === DEPENDABOT_ID && pr.user.type === 'Bot' && pr.base?.ref === 'main' && pr.head?.repo?.id === repositoryId && pr.base.repo?.id === repositoryId && /^dependabot\/(npm_and_yarn|github_actions)\//.test(pr.head.ref) && pr.state === 'open' && !pr.draft
}

function evaluateCandidate(input) {
  const result = (kind, reason) => ({ kind, reason })
  const { pr, repositoryId, mainSha, ci, jobs = [], checks = [] } = input
  if (!eligiblePr(pr, repositoryId)) return result('blocked', 'Only open, same-repository Dependabot PRs targeting main are eligible.')
  if (input.productionBlock) return result('blocked', 'Production deployment failure is latched. Operator recovery and explicit clearance are required.')
  if (!input.productionHealthy) return result('waiting', 'Trusted production deployment evidence or monitor configuration is missing.')
  if (input.classification?.eligible !== true) return result('blocked', input.classification?.reason || 'Dependency update eligibility is unproven.')
  if (!input.scope.allowed) return result('blocked', input.scope.reason)
  if (pr.base.sha !== mainSha) return result('waiting', 'Main changed during evaluation.')
  if (pr.mergeable_state === 'dirty') return result('repair', 'The current head has a merge conflict.')
  if (!input.containsMain) return result('refresh', 'Refresh the branch against current main.')
  if (pr.mergeable !== true) return result('waiting', 'GitHub has not resolved mergeability.')
  if (!ci || ci.head_sha !== pr.head.sha || ci.workflow_id !== input.ciWorkflowId || ci.event !== 'pull_request' || ci.head_repository?.id !== repositoryId || ci.head_branch !== pr.head.ref || !(Array.isArray(ci.pull_requests) && (ci.pull_requests.length ? ci.pull_requests.some((item) => item.number === pr.number && item.base?.sha === mainSha) : input.headPullRequests?.some(item=>item.number===pr.number && item.head?.sha===pr.head.sha && item.base?.sha===mainSha && item.base?.repo?.id===repositoryId))) || ci.status !== 'completed') return result('waiting', 'Current-head, current-base CI is missing or waiting for approval.')
  if (['cancelled', 'timed_out'].includes(ci.conclusion)) return result('retry', 'Authenticated interrupted CI is eligible for a bounded retry.')
  const validated = REQUIRED_CHECKS.map((name) => {
    const job = jobs.find((item) => item.name === name)
    const id = Number(job?.check_run_url?.match(/\/check-runs\/(\d+)$/)?.[1])
    const check = checks.find((item) => item.id === id && item.name === name && item.head_sha === pr.head.sha && item.app?.id === 15368)
    return job && check && job.status === 'completed' && check.status === 'completed' && job.conclusion === check.conclusion ? job.conclusion : null
  })
  if (validated.some((value) => value === null)) return result('waiting', 'Required CI job provenance or completion is missing.')
  if (validated.some((value) => value === 'failure') && ci.conclusion === 'failure') return result('repair', 'Current-head CI has a failed required check.')
  if (ci.conclusion !== 'success' || validated.some((value) => value !== 'success')) return result('waiting', 'Skipped or unclassified CI needs operator action.')
  const vercel = input.statuses?.find((item) => item.context === 'Vercel')
  if (!vercel || vercel.creator?.id !== VERCEL_BOT_ID || !input.vercelPrefix || !vercel.target_url?.startsWith(input.vercelPrefix) || !input.vercelChecks?.some((item) => item.head_sha === pr.head.sha && item.app?.id === input.vercelAppId) || input.vercelAppId !== 8329) return result('waiting', 'Trusted Vercel deployment status is missing.')
  if (['failure', 'error'].includes(vercel.state)) return result('blocked', 'Vercel failed without a classified CI code failure; inspect platform logs before repair.')
  if (vercel.state !== 'success') return result('waiting', 'Vercel preview is still pending.')
  const current = input.independentReview
  if (!current || current.task.head !== pr.head.sha || current.task.base !== mainSha) return result('review', 'Independent current-head review is required.')
  if (current.report.verdict === 'request_changes') return result('repair', 'Independent review requested changes to this head.')
  if (!current.passed) return result('blocked', 'Independent review is blocked or incomplete.')
  return result('ready', 'Current-head validation and independent review passed.')
}

module.exports = { REQUIRED_CHECKS, GATE, DEPENDABOT_ID, evaluateScope, evaluateCandidate, eligiblePr, actionPins }
