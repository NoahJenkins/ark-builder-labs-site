'use strict'
const { GATE, DEPENDABOT_ID, evaluateScope, actionPins } = require('./dependabot-controller-policy.cjs')
const { readLedger, encodeLedger } = require('./dependabot-controller-ledger.cjs')

const { retainsRepairTargets, adoptMainBaseline, validateReviewEvidence, validateFiles, text, REVIEW, same } = require('./dependabot-opencode-contract.cjs')
const { parseArtifactZip, verifyRun, verifyJobs, MAX_ZIP } = require('./dependabot-opencode-publish.cjs')
const { createHash } = require('node:crypto')
const {productionFailure} = require('./dependabot-deployment.cjs')
const CLAIM = '<!-- dependabot-opencode-claim:v1 -->'

function createClient(config, readToken, writeToken, fetcher = fetch) {
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(config.repo)) throw new Error('Invalid repository')
  const root = `/repos/${config.repo}`
  async function request(method, path, body, useWrite = method !== 'GET', emptyCreated = false) {
    if (!path.startsWith('/') || path.startsWith('//') || /[\r\n]/.test(path)) throw new Error('Invalid API path')
    let response
    for (let attempt=0;attempt<2;attempt++) {
      try { response = await fetcher(`https://api.github.com${path}`, {
      method, headers: { Authorization: `Bearer ${useWrite ? writeToken : readToken}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2026-03-10', 'Content-Type': 'application/json' },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }), signal: AbortSignal.timeout(20000), redirect: 'error',
      }) } catch (error) { if(method==='GET' && attempt===0)continue;throw error }
      if(method==='GET' && attempt===0 && [429,500,502,503,504].includes(response.status))continue
      break
    }
    if (!response.ok) throw new Error(`GitHub HTTP ${response.status}: ${method} ${path.split('?')[0]}`)
    if (response.status === 204 || (emptyCreated && response.status === 201)) return null
    const data = await response.json()
    if (data.errors) throw new Error('GitHub GraphQL request rejected; no automatic retry')
    return data
  }
  async function list(path, key) {
    const result = []
    for (let page = 1; page <= 20; page++) {
      const data = await request('GET', `${path}${path.includes('?') ? '&' : '?'}per_page=100&page=${page}`)
      const items = key ? data[key] : data
      if (!Array.isArray(items)) throw new Error('Unexpected paginated GitHub response')
      result.push(...items)
      if (items.length < 100) return result
    }
    throw new Error('GitHub pagination capacity reached; fail closed')
  }
  const checksFor = (sha) => list(`${root}/commits/${sha}/check-runs?filter=latest`, 'check_runs')
  async function content(path, sha) {
    const encoded = path.split('/').map(encodeURIComponent).join('/')
    const data = await request('GET', `${root}/contents/${encoded}?ref=${sha}`)
    if (Array.isArray(data) || data.type !== 'file' || data.size > 2 * 1024 * 1024) throw new Error('Unsupported file type or size')
    const blob = data.content ? data : await request('GET', `${root}/git/blobs/${data.sha}`)
    if (blob.encoding !== 'base64') throw new Error('Unsupported file encoding')
    const bytes=Buffer.from(blob.content,'base64');const result=bytes.toString('utf8');text(result,2*1024*1024);if(Buffer.from(result).compare(bytes)!==0)throw Error('Invalid UTF-8 GitHub blob');return result
  }
  async function download(apiPath,max=MAX_ZIP) {
    let response=await fetcher(`https://api.github.com${apiPath}`,{headers:{Authorization:`Bearer ${readToken}`},redirect:'manual',signal:AbortSignal.timeout(20000)})
    if(response.status===302){const location=new URL(response.headers.get('location'));if(location.protocol!=='https:' || location.username || location.password || !(/\.blob\.core\.windows\.net$/.test(location.hostname)||/\.actions\.githubusercontent\.com$/.test(location.hostname)))throw Error('Untrusted download host');response=await fetcher(location.toString(),{redirect:'error',signal:AbortSignal.timeout(20000)})}
    if(!response.ok)throw Error(`GitHub download HTTP ${response.status}`)
    if(Number(response.headers.get('content-length'))>max)throw Error('Download byte limit')
    const chunks=[];let size=0;for await(const chunk of response.body){size+=chunk.length;if(size>max)throw Error('Download byte limit');chunks.push(Buffer.from(chunk))}return Buffer.concat(chunks)
  }
  const client = {
    request, list, getFileContent: content,
    getRepo: () => request('GET', root),
    getPr: (number) => request('GET', `${root}/pulls/${number}`),
    getMain: async () => (await request('GET', `${root}/git/ref/heads/main`)).object.sha,
    listPrs: () => list(`${root}/pulls?state=open&base=main`),
    hasDependabotHead: async (sha, excludeNumber) => (await client.listPrs()).some((pr) => pr.user?.id === DEPENDABOT_ID && pr.head.sha === sha && pr.number !== excludeNumber),
    getProtection: () => request('GET', `${root}/branches/main/protection`),
    getGate: async (pr) => (await checksFor(pr.head.sha)).filter((check) => check.name === GATE && check.app?.id === config.appId).sort((a, b) => b.id - a.id)[0],
    async setGate(pr, kind, reason) {
      let existing = await client.getGate(pr)
      const completed = ['success', 'blocked'].includes(kind)
      // GitHub retains the conclusion when a completed check is patched.
      // Start a fresh lifecycle so task claims observe a truly pending gate.
      if (!completed && existing?.status === 'completed') existing = undefined
      const body = { name: GATE, ...(existing ? {} : { head_sha: pr.head.sha }), status: completed ? 'completed' : 'in_progress', ...(completed ? { conclusion: kind === 'success' ? 'success' : 'action_required' } : {}), output: { title: `Dependabot: ${kind}`, summary: reason.slice(0, 2000) } }
      const result = await request(existing ? 'PATCH' : 'POST', existing ? `${root}/check-runs/${existing.id}` : `${root}/check-runs`, body)
      if (result.app?.id !== config.appId || result.head_sha !== pr.head.sha) throw new Error('Unexpected merge-gate publisher or head')
    },
    async getPublishedRepairClaim(pr,main) {
      const claims=(await client.getClaims()).filter(claim=>claim.published===true && claim.publishAttempted===true && /^[0-9a-f]{40}$/.test(claim.resultId || '') && claim.task?.kind==='repair' && claim.task.pr===pr.number && claim.task.prId===pr.node_id && claim.task.base===main && claim.task.head!==pr.head.sha && /^[0-9a-f]{40}$/.test(claim.task.head || '') && claim.origin?.repositoryId===config.repositoryId && claim.origin.workflowSha===main && claim.origin.workflowPath==='.github/workflows/dependabot-auto-merge.yml' && claim.origin.ref==='refs/heads/main')
      const direct=claims.filter(claim=>claim.resultId===pr.head.sha)
      if(direct.length)return direct.length===1?direct[0]:null
      if(!claims.length || !config.stateIssue)return null
      // An authenticated refresh reservation alone does not authenticate the
      // resulting bytes. Bind both merge parents and the complete merged tree.
      const {ledger}=await client.getLedger()
      const eligible=claims.filter(claim=>ledger.reservations.filter(item=>item.kind==='refresh' && item.pr===pr.number && item.prId===pr.node_id && item.head===claim.resultId && item.base===main).length===1)
      if(!eligible.length)return null
      const commit=await request('GET',`${root}/git/commits/${pr.head.sha}`)
      if(commit.sha!==pr.head.sha || commit.parents?.length!==2 || commit.parents[1].sha!==main)return null
      const matching=eligible.filter(claim=>claim.resultId===commit.parents[0].sha)
      if(matching.length!==1)return null
      const claim=matching[0]
      const compare=await request('GET',`${root}/compare/${main}...${claim.resultId}`)
      const ancestor=compare.merge_base_commit?.sha
      // A repair behind main is its own merge base and cannot prove which
      // validated files main later changed. Do not transfer its authority.
      if(!['ahead','identical','diverged'].includes(compare.status) || !/^[0-9a-f]{40}$/.test(ancestor || '') || (['ahead','identical'].includes(compare.status) && ancestor!==main))return null
      const trees=[]
      for(const sha of [ancestor,claim.resultId,main,pr.head.sha]) {
        const tree=await request('GET',`${root}/git/trees/${sha}?recursive=1`)
        if(tree.truncated!==false || !Array.isArray(tree.tree) || tree.tree.length>20000)return null
        const entries=new Map()
        for(const entry of tree.tree) {
          if(entry.type==='tree')continue
          if(!['blob','commit'].includes(entry.type) || !/^[0-9a-f]{40}$/.test(entry.sha || '') || !/^(?:100644|100755|120000|160000)$/.test(entry.mode || '') || typeof entry.path!=='string' || !entry.path || entries.has(entry.path))return null
          entries.set(entry.path,`${entry.type}:${entry.mode}:${entry.sha}`)
        }
        trees.push(entries)
      }
      const [original,repaired,trustedMain,current]=trees
      const paths=new Set([...original.keys(),...repaired.keys(),...trustedMain.keys(),...current.keys()])
      // Preserve every repaired blob/mode, and adopt main only on paths that
      // were unchanged from the common ancestor in the validated repair.
      for(const path of paths)if(current.get(path)!==(repaired.get(path)===original.get(path)?trustedMain.get(path):repaired.get(path)))return null
      return claim
    },
    async adoptPublishedBaseline(change,pr,main,mainContent) {
      const adopted=adoptMainBaseline(change,mainContent,evaluateScope,change.before)
      if(adopted===change)return change
      // Ancestor contents alone cannot recover a target already removed from
      // the current head. Bind fallback to the App's published repair receipt
      // and compare with that repair's immutable, pre-publication parent.
      const claim=await client.getPublishedRepairClaim(pr,main)
      if(!claim)return change
      const before=await content(change.filename,claim.task.head)
      return retainsRepairTargets({...change,before},mainContent,change.before)?adopted:change
    },
    async snapshot(pr, main) {
      const files = await list(`${root}/pulls/${pr.number}/files`)
      if (files.length !== pr.changed_files || files.length > 64) throw new Error('Incomplete PR file list or 64-file review capacity exceeded')
      const compare = await request('GET', `${root}/compare/${main}...${pr.head.sha}`)
      const containsMain = ['ahead', 'identical'].includes(compare.status)
      const scopeBase = compare.merge_base_commit?.sha
      if (!['ahead', 'identical', 'behind', 'diverged'].includes(compare.status) || !/^[0-9a-f]{40}$/.test(scopeBase || '') || (containsMain && scopeBase !== main)) throw new Error('Invalid PR merge base evidence')
      // PR file lists describe the delta from this common ancestor. Current main
      // may contain unrelated policy edits until a bounded branch refresh lands.
      const changes = []
      for (const file of files) {
        const needText = /(^|\/)package\.json$/.test(file.filename) || file.filename==='pnpm-workspace.yaml' || file.filename.startsWith('.github/workflows/') || ['.nvmrc','.node-version'].includes(file.filename)
        changes.push({ ...file, before: needText && file.status === 'modified' ? await content(file.filename, scopeBase) : '', after: needText && !['removed', 'renamed'].includes(file.status) ? await content(file.filename, pr.head.sha) : '' })
      }
      // A published conflict repair can already contain authenticated main-side
      // policy edits while ancestry still needs the bounded branch refresh.
      if(scopeBase!==main)for(let i=0;i<changes.length;i++) {
        const change=changes[i]
        if(change.status==='modified' && !evaluateScope([change]).allowed)changes[i]=await client.adoptPublishedBaseline(change,pr,main,await content(change.filename,main))
      }
      const scope = evaluateScope(changes)
      const {classifyDependabotPullRequest} = await import('./classify-dependabot-pr.mjs')
      const dependencyFiles = files.filter(f=>/package\.json$|(?:pnpm-lock\.yaml|pnpm-workspace\.yaml)$|^\.github\/(?:workflows\/|dependabot\.)/.test(f.filename))
      // Only validated publication by the dedicated App can extend an initial
      // dependency-only PR with source or regression-test repairs.
      const repaired=dependencyFiles.length!==files.length && await client.getPublishedRepairClaim(pr,main)
      const classification = classifyDependabotPullRequest({author:{login:pr.user?.login},body:pr.body,title:pr.title,files:repaired?dependencyFiles:files})
      if (scope.allowed) await client.verifyActionPins(changes.filter((file) => file.filename.startsWith('.github/workflows/')))
      const workflow = await request('GET', `${root}/actions/workflows/ci.yaml`)
      const runs = await list(`${root}/actions/workflows/${workflow.id}/runs?head_sha=${pr.head.sha}&event=pull_request`, 'workflow_runs')
      const ci = runs.filter((run) => run.head_sha === pr.head.sha && run.head_branch === pr.head.ref).sort((a, b) => b.id - a.id)[0]
      const jobs = ci ? await list(`${root}/actions/runs/${ci.id}/jobs?filter=latest`, 'jobs') : []
      const checks = await checksFor(pr.head.sha)
      const statuses = await list(`${root}/commits/${pr.head.sha}/statuses`)
      const independentReview = await client.getIndependentReview(pr,main,files.map(f=>f.filename),checks)
      const headPullRequests = Array.isArray(ci?.pull_requests) && ci.pull_requests.length === 0 ? await list(`${root}/commits/${pr.head.sha}/pulls`) : []
      const production = await client.productionState()
      return { headPullRequests, classification, productionBlock: production.block, productionHealthy: production.healthy, vercelPrefix: config.vercelPrefix, pr, mainSha: main, repositoryId: config.repositoryId, scope, containsMain, ciWorkflowId: workflow.id, ci, jobs, checks, statuses, independentReview, vercelAppId: config.vercelAppId, vercelChecks: checks }
    },
    async verifyActionPins(changes) {
      for (const change of changes) {
        const old = actionPins(change.before)
        for (const pin of actionPins(change.after)) {
          if (!pin.sha && old.some(item=>item.index===pin.index && item.action===pin.action && item.sha)) throw new Error('Immutable action pins cannot become mutable tags')
          if (old.some((item) => item.index === pin.index && item.action === pin.action && item.sha === pin.sha && item.tag === pin.tag)) continue
          const upstream = pin.action.split('/').slice(0, 2).join('/')
          if(pin.sha && !pin.tag) {
            const commit=await request('GET', `/repos/${upstream}/git/commits/${pin.sha}`)
            if(commit.sha!==pin.sha)throw Error('Action pin does not match the official upstream commit')
            continue
          }
          let object = (await request('GET', `/repos/${upstream}/git/ref/tags/${pin.tag}`)).object
          for (let depth = 0; object.type === 'tag' && depth < 5; depth++) object = (await request('GET', `/repos/${upstream}/git/tags/${object.sha}`)).object
          if (object.type !== 'commit' || (pin.sha && object.sha !== pin.sha)) throw new Error('Action pin does not match the official upstream version tag')
        }
      }
    },
    async queueMerge(pr) {
      if (pr.auto_merge?.merge_method === 'squash') return
      if (pr.auto_merge) await client.disableMerge(pr)
      await request('POST', '/graphql', { query: 'mutation($id: ID!, $head: GitObjectID!) { enablePullRequestAutoMerge(input: {pullRequestId: $id, expectedHeadOid: $head, mergeMethod: SQUASH}) { pullRequest { id } } }', variables: { id: pr.node_id, head: pr.head.sha } })
    },
    disableMerge: (pr) => request('POST', '/graphql', { query: 'mutation($id: ID!) { disablePullRequestAutoMerge(input: {pullRequestId: $id}) { pullRequest { id } } }', variables: { id: pr.node_id } }),
    async approve(pr) {
      const reviews = await list(`${root}/pulls/${pr.number}/reviews`)
      const own = reviews.filter((review) => review.user?.id === config.appBotId && review.commit_id === pr.head.sha).sort((a, b) => b.id - a.id)[0]
      if (own?.state === 'APPROVED') return
      await request('POST', `${root}/pulls/${pr.number}/reviews`, { commit_id: pr.head.sha, event: 'APPROVE', body: 'Authenticated current-head OpenCode review, trusted CI, Vercel and protected scope verified. Native merge remains controlled by the dedicated App gate.' })
    },
    retryCi: (id) => {
      if (!Number.isSafeInteger(id) || id <= 0) throw Error('Invalid retry workflow run')
      return request('POST', `${root}/actions/runs/${id}/rerun`, undefined, true, true)
    },
    async productionState(persist = false) {
      if (!config.stateIssue || !config.deploymentEnvironment || !config.deploymentBaseline) return {healthy:false,block:null}
      const state = await client.getLedger()
      if (state.ledger.productionBlock) return {healthy:false,block:state.ledger.productionBlock}
      const deployments = await list(`${root}/deployments?environment=${encodeURIComponent(config.deploymentEnvironment)}`)
      const watched = deployments.filter(d=>d.id>=config.deploymentBaseline && d.creator?.id===35613825)
      if (!watched.some(d=>d.id===config.deploymentBaseline)) return {healthy:false,block:null}
      for (const deployment of watched) deployment.statuses=await list(`${root}/deployments/${deployment.id}/statuses`)
      const baseline=watched.find(d=>d.id===config.deploymentBaseline)
      const since=Date.parse(baseline.created_at)
      if(!/^[0-9a-f]{40}$/.test(baseline.sha) || !Number.isFinite(since)) throw Error('Production baseline evidence is incomplete')
      const productionHead=(await request('GET',`${root}/git/ref/heads/${config.productionBranch}`)).object.sha
      const heads=new Set([baseline.sha,productionHead])
      if(productionHead!==baseline.sha) {
        const history=await request('GET',`${root}/compare/${baseline.sha}...${productionHead}?per_page=100`)
        if(!['ahead','identical'].includes(history.status) || !Array.isArray(history.commits) || history.total_commits!==history.commits.length || history.commits.length>100) throw Error('Production history is divergent or incomplete; operator baseline review is required')
        for(const commit of history.commits){if(!/^[0-9a-f]{40}$/.test(commit.sha))throw Error('Invalid production history');heads.add(commit.sha)}
      }
      let commitStatus=null;let failure=null
      for(const head of heads) {
        const statuses=(await list(`${root}/commits/${head}/statuses`)).filter(s=>s.context==='Vercel' && s.creator?.id===35613825 && config.vercelPrefix && s.target_url?.startsWith(config.vercelPrefix)).sort((a,b)=>b.id-a.id)
        if(head===productionHead)commitStatus=statuses[0]
        for(const status of statuses) {
          if(!['error','failure'].includes(status.state))continue
          const created=Date.parse(status.created_at)
          if(!Number.isFinite(created))throw Error('Production failure timestamp is missing')
          if(created>=since)failure ||= {head,statusId:status.id,environment:config.deploymentEnvironment}
        }
      }
      const block=productionFailure(null,watched) || failure
      if (block && persist) await client.saveLedger({...state.ledger,productionBlock:block},state)
      const latest=watched.sort((a,b)=>b.id-a.id)[0]
      const status=latest?.statuses.filter(s=>s.creator?.id===35613825).sort((a,b)=>b.id-a.id)[0]
      const currentHead=(await request('GET',`${root}/git/ref/heads/${config.productionBranch}`)).object.sha
      return {block,healthy:!block && currentHead===productionHead && latest?.sha===productionHead && status?.state==='success' && commitStatus?.state==='success'}
    },
    updateBranch: (pr) => request('PUT', `${root}/pulls/${pr.number}/update-branch`, { expected_head_sha: pr.head.sha }),
    getLedger: async () => readLedger(await list(`${root}/issues/${config.stateIssue}/comments`), config.appBotId),
    async saveLedger(ledger, state) {
      if (state.commentId) {
        const existing = readLedger([await request('GET', `${root}/issues/comments/${state.commentId}`)], config.appBotId)
        if (JSON.stringify(existing.ledger) !== JSON.stringify(state.ledger)) throw new Error('Ledger changed concurrently; fail closed')
      }
      const saved = await request(state.commentId ? 'PATCH' : 'POST', state.commentId ? `${root}/issues/comments/${state.commentId}` : `${root}/issues/${config.stateIssue}/comments`, { body: encodeLedger(ledger) })
      const verified = readLedger([saved], config.appBotId)
      if (JSON.stringify(verified.ledger) !== JSON.stringify(ledger)) throw new Error('Ledger persistence mismatch')
      state.commentId = saved.id
    },
    getRun: (id) => request('GET',`${root}/actions/runs/${id}`),
    getJobs: (id) => list(`${root}/actions/runs/${id}/attempts/1/jobs`,'jobs'),
    async getClaims() {
      if(!config.stateIssue)return []
      const claims=[]
      for(const comment of await list(`${root}/issues/${config.stateIssue}/comments`)){
        if(!comment.body?.startsWith(CLAIM))continue
        if(comment.user?.id!==config.appBotId || comment.user.type!=='Bot')throw Error('Untrusted task claim author')
        const data=JSON.parse(comment.body.slice(CLAIM.length).trim())
        if(!data.task || !data.origin || typeof data.publishAttempted!=='boolean' || typeof data.published!=='boolean')throw Error('Invalid task claim')
        claims.push({...data,id:comment.id})
      }
      if(new Set(claims.map(c=>c.task.nonce)).size!==claims.length)throw Error('Duplicate task claims')
      return claims
    },
    async claimTask(task,origin) {
      const data={task,origin,publishAttempted:false,published:false,digest:null,resultId:null}
      const saved=await request('POST',`${root}/issues/${config.stateIssue}/comments`,{body:`${CLAIM}\n${JSON.stringify(data)}`})
      if(saved.user?.id!==config.appBotId || saved.user.type!=='Bot' || saved.body!==`${CLAIM}\n${JSON.stringify(data)}`)throw Error('Task claim persistence failed')
    },
    async markClaim(claim,fields) {
      const current=(await client.getClaims()).find(c=>c.id===claim.id);same(current,claim)
      const {id,...data}={...claim,...fields}
      const body=`${CLAIM}\n${JSON.stringify(data)}`
      const saved=await request('PATCH',`${root}/issues/comments/${id}`,{body})
      if(saved.user?.id!==config.appBotId || saved.body!==body)throw Error('Claim receipt persistence failed')
      Object.assign(claim,fields)
    },
    async getArtifact(id,expected) {
      const meta=await request('GET',`${root}/actions/artifacts/${id}`)
      if(meta.id!==id || meta.expired || meta.name!==expected.name || meta.workflow_run?.id!==expected.runId || meta.workflow_run.head_sha!==expected.head || meta.workflow_run.head_branch!=='main' || meta.size_in_bytes>MAX_ZIP || !/^sha256:[0-9a-f]{64}$/.test(meta.digest))throw Error('Untrusted artifact metadata')
      const zip=await download(`${root}/actions/artifacts/${id}/zip`)
      if(`sha256:${createHash('sha256').update(zip).digest('hex')}`!==meta.digest)throw Error('Artifact transport digest mismatch')
      return parseArtifactZip(zip)
    },
    async findArtifact(runId,name) {
      const all=await list(`${root}/actions/runs/${runId}/artifacts`,'artifacts');const found=all.filter(a=>a.name===name && !a.expired)
      if(found.length!==1)throw Error('Missing or duplicate artifact')
      return found[0].id
    },
    getWorkerArtifact: async(task,runId)=>client.getArtifact(await client.findArtifact(runId,`worker-${task.nonce}`),{runId,name:`worker-${task.nonce}`,head:task.base}),
    async commitFiles(pr,files) {
      validateFiles(files)
      const input={branch:{repositoryNameWithOwner:config.repo,branchName:pr.head.ref},expectedHeadOid:pr.head.sha,message:{headline:'fix: repair Dependabot validation with OpenCode'},fileChanges:{additions:files.map(f=>({path:f.path,contents:Buffer.from(f.content).toString('base64')}))}}
      const result=await request('POST','/graphql',{query:'mutation($input: CreateCommitOnBranchInput!) { createCommitOnBranch(input: $input) { commit { oid } } }',variables:{input}})
      const id=result.data?.createCommitOnBranch?.commit?.oid;if(!/^[0-9a-f]{40}$/.test(id))throw Error('Atomic commit result is missing');return {id}
    },
    async publishReview(task,artifact,passed) {
      const result=await request('POST',`${root}/check-runs`,{name:REVIEW,head_sha:task.head,status:'completed',conclusion:passed?'success':'failure',external_id:task.nonce,output:{title:passed?'Independent review passed':'Independent review requires action',summary:`Task ${task.nonce}; base ${task.base}; findings remain in the complete JSON report.`,text:JSON.stringify(artifact)}})
      if(result.app?.id!==config.appId || result.head_sha!==task.head || result.external_id!==task.nonce)throw Error('Unexpected review publisher')
      return {id:result.id}
    },
    async getIndependentReview(pr,main,changedFiles,checks) {
      const latest=checks.filter(c=>c.name===REVIEW && c.app?.id===config.appId).sort((a,b)=>b.id-a.id)[0]
      if(!latest)return null
      try {
        const a=JSON.parse(latest.output.text)
        const claim=(await client.getClaims()).find(c=>c.task.nonce===a.task.nonce)
        if(!claim || !claim.published || claim.resultId!==latest.id || claim.task.pr!==pr.number || claim.task.prId!==pr.node_id || a.task.head!==pr.head.sha || a.task.base!==main)return null
        const run=await client.getRun(a.origin.runId)
        verifyRun(run,a.origin,{...config,eventName:run.event,runId:a.origin.runId,runAttempt:1,workflowSha:main,ref:'refs/heads/main'})
        verifyJobs(await client.getJobs(a.origin.runId),a.task,a.origin)
        return validateReviewEvidence(latest,{task:a.task,origin:a.origin,changedFiles,appId:config.appId,claim})
      } catch {return null}
    },
    async prepareSnapshot(task) {
      const pr=await client.getPr(task.pr)
      if(pr.node_id!==task.prId || pr.head.sha!==task.head || pr.base.sha!==task.base || await client.getMain()!==task.base)throw Error('Snapshot head/base changed')
      const files=await list(`${root}/pulls/${task.pr}/files`)
      if(files.length!==pr.changed_files || files.length>64 || !files.length)throw Error('Incomplete snapshot file set')
      const compare=await request('GET',`${root}/compare/${task.base}...${task.head}`)
      const scopeBase=compare.merge_base_commit?.sha
      if(!['ahead','identical','behind','diverged'].includes(compare.status) || !/^[0-9a-f]{40}$/.test(scopeBase || '') || (['ahead','identical'].includes(compare.status) && scopeBase!==task.base))throw Error('Invalid repair merge base evidence')
      // Keep current main available for conflict repair; authorize the PR delta
      // against its common ancestor, matching GitHub's pull-file list.
      const baseFiles={};const headFiles={};const changes=[]
      for(const f of files){if(['removed','renamed'].includes(f.status))throw Error('Unsupported changed file');baseFiles[f.filename]=f.status==='added'?'':await content(f.filename,task.base);headFiles[f.filename]=await content(f.filename,task.head);changes.push({...f,before:f.status==='added'?'':scopeBase===task.base?baseFiles[f.filename]:await content(f.filename,scopeBase),after:headFiles[f.filename]})}
      const ancestorFiles=Object.fromEntries(changes.map(change=>[change.filename,change.before]))
      for(let i=0;i<changes.length;i++)changes[i]=await client.adoptPublishedBaseline(changes[i],pr,task.base,baseFiles[changes[i].filename])
      const scope=evaluateScope(changes);if(!scope.allowed)throw Error(scope.reason)
      await client.verifyActionPins(changes.filter(f=>f.filename.startsWith('.github/workflows/')))
      const contextFiles={};const tree=await request('GET',`${root}/git/trees/${task.head}?recursive=1`)
      if(tree.truncated)throw Error('Incomplete source tree')
      const existingPaths=tree.tree.filter(f=>f.type==='blob').map(f=>f.path).sort()
      if(existingPaths.length>20000)throw Error('Source inventory capacity')
      const dependencies=['package.json','apps/app/package.json','packages/contracts/package.json','pnpm-lock.yaml','pnpm-workspace.yaml','.nvmrc','.node-version']
      const entries=tree.tree.filter(f=>f.type==='blob' && (dependencies.includes(f.path) || /^src\/(app|components|lib)\/.+\.(tsx?|jsx?|css)$/.test(f.path)) && !/\.(test|spec)\.|(^|\/)__tests__\//.test(f.path) && !Object.hasOwn(headFiles,f.path))
      if(entries.length>128 || entries.some(f=>f.mode!=='100644' || f.size>2*1024*1024))throw Error('Unsupported source context')
      for(const f of entries)contextFiles[f.path]=await content(f.path,task.head)
      const diagnostics=[]
      if(task.kind==='repair'){
        const state=await client.snapshot(pr,task.base)
        for(const job of state.jobs.filter(j=>j.conclusion==='failure')) {
          const bytes=await download(`${root}/actions/jobs/${job.id}/logs`,1024*1024)
          const log=bytes.toString('utf8');text(log,1024*1024)
          diagnostics.push({job:job.name,log})
        }
        if(state.independentReview)diagnostics.push({review:state.independentReview.report})
      }
      const result={task,changedFiles:files.map(f=>f.filename),baseFiles,headFiles,ancestorFiles,contextFiles,diagnostics,existingPaths}
      if(Buffer.byteLength(JSON.stringify(result))>8*1024*1024)throw Error('Snapshot byte limit')
      return result
    },
  }
  return client
}

module.exports = { createClient, CLAIM }
