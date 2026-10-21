const test = require('node:test');
const assert = require('node:assert/strict');
const {reserve} = require('./dependabot-controller-ledger.cjs');
const {evaluateScope, REQUIRED_CHECKS} = require('./dependabot-controller-policy.cjs');
const {productionFailure} = require('./dependabot-deployment.cjs');
const task = {pr:1, prId:'PR_one', head:'a'.repeat(40), base:'b'.repeat(40), kind:'repair'};
test('two repair attempts survive head and day changes; refresh has a separate bounded budget', () => {
 let state = {version:1,reservations:[]};
 for (const [index,kind] of ['repair','repair'].entries()) {
   const result = reserve(state,{...task,kind,head:String(index+1).repeat(40)},`2026-10-${20+index}T00:00:00.000Z`);
   assert.ok(result.reservation); state=result.ledger;
 }
 const result=reserve(state,task,'2026-10-23T00:00:00.000Z');
 assert.equal(result.reservation,undefined); assert.match(result.reason,/two/);
 assert.ok(reserve(state,{...task,kind:'refresh'},'2026-10-23T00:00:00.000Z').reservation);
});
test('package scripts and workflow command changes cannot be repaired', () => {
 assert.equal(evaluateScope([{filename:'package.json',status:'modified',before:'{"scripts":{"build":"next build"}}',after:'{"scripts":{"build":"true"}}'}]).allowed,false);
 assert.equal(evaluateScope([{filename:'.github/workflows/ci.yml',status:'modified',before:'run: pnpm test',after:'run: true'}]).allowed,false);
});
test('production failure latches across a later success; explicit operator clear is needed', () => {
 const failure={id:1,environment:'Production',creator:{id:35613825},statuses:[{id:2,state:'failure',creator:{id:35613825}}]};
 const block=productionFailure(null,[failure]); assert.equal(block.deploymentId,1);
 assert.deepEqual(productionFailure(block,[{...failure,id:3,statuses:[{id:4,state:'success',creator:{id:35613825}}]}]),block);
 assert.equal(productionFailure(null,[{...failure,creator:{id:1}}]),null);
});
test('required checks are explicit and nonempty',()=>assert.ok(REQUIRED_CHECKS.length>=2));

const {evaluateCandidate,DEPENDABOT_ID} = require('./dependabot-controller-policy.cjs');
const {createClient} = require('./dependabot-controller-api.cjs');
const {agentConfig} = require('./dependabot-opencode-worker.cjs');
const {verifyRun,verifyJobs} = require('./dependabot-opencode-publish.cjs');
const {validateFiles,validateReview} = require('./dependabot-opencode-contract.cjs');
function snapshot() {
 const head='a'.repeat(40), base='b'.repeat(40), ref='dependabot/npm_and_yarn/group';
 const pr={number:1,node_id:'PR_one',head:{sha:head,ref,repo:{id:1}},base:{sha:base,ref:'main',repo:{id:1}},user:{id:DEPENDABOT_ID,type:'Bot'},state:'open',draft:false,mergeable:true,mergeable_state:'clean'};
 const checks=REQUIRED_CHECKS.map((name,i)=>({id:i+1,name,head_sha:head,app:{id:15368},status:'completed',conclusion:'success'}));
 return {pr,mainSha:base,repositoryId:1,scope:{allowed:true},classification:{eligible:true},productionHealthy:true,containsMain:true,ciWorkflowId:10,ci:{head_sha:head,workflow_id:10,event:'pull_request',head_repository:{id:1},head_branch:ref,pull_requests:[{number:1,base:{sha:base}}],status:'completed',conclusion:'success'},jobs:checks.map(c=>({...c,check_run_url:`https://api.github.com/check-runs/${c.id}`})),checks,vercelPrefix:'https://vercel.com/team/project/',statuses:[{context:'Vercel',creator:{id:35613825},state:'success',target_url:'https://vercel.com/team/project/123'}],vercelAppId:8329,vercelChecks:[{head_sha:head,app:{id:8329}}],independentReview:{task:{head,base},passed:true,report:{verdict:'approve'}}};
}
test('merge requires exact CI head/base, all required jobs and independent review',()=>{
 assert.equal(evaluateCandidate(snapshot()).kind,'ready');
 for (const mutate of [s=>s.ci.head_sha='c'.repeat(40),s=>s.ci.pull_requests[0].base.sha='c'.repeat(40),s=>s.jobs.pop(),s=>s.checks[0].app.id=1,s=>s.ci.head_repository.id=2,s=>s.pr.head.repo.id=2,s=>s.classification.eligible=false,s=>s.productionHealthy=false]) {
  const s=snapshot();mutate(s);assert.notEqual(evaluateCandidate(s).kind,'ready');
 }
 const s=snapshot();s.independentReview=null;assert.equal(evaluateCandidate(s).kind,'review');
 s.productionBlock={deploymentId:1};assert.equal(evaluateCandidate(s).kind,'blocked');
});
test('failed CI repairs, interrupted CI retries, and behind branches refresh within one budget',()=>{
 const s=snapshot();s.ci.conclusion='failure';s.jobs[0].conclusion=s.checks[0].conclusion='failure';
 assert.equal(evaluateCandidate(s).kind,'repair');
 s.ci.conclusion='cancelled';s.jobs[0].conclusion=s.checks[0].conclusion='cancelled';assert.equal(evaluateCandidate(s).kind,'retry');
 s.containsMain=false;assert.equal(evaluateCandidate(s).kind,'refresh');
});
test('worker denies command/network/task execution; review cannot edit',()=>{
 const config=agentConfig('review','http://broker:8080/v1','temporary');
 assert.equal(config.agent.review.permission.bash,'deny');assert.equal(config.agent.review.permission.edit,'deny');
 assert.equal(config.agent.review.permission.task,'deny');assert.deepEqual(config.plugin,[]);assert.deepEqual(config.mcp,{});
});
test('data contracts reject traversal, incomplete review and mismatched provenance',()=>{
 assert.throws(()=>validateFiles([{path:'../package.json',content:'{}'}]));
 assert.throws(()=>validateReview({verdict:'approve',findings:[],coveredFiles:['a'],assessment:{security:{status:'pass',rationale:'ok'},compatibility:{status:'pass',rationale:'ok'}}},['a','b']));
 assert.throws(()=>verifyRun({event:'pull_request',path:'.github/workflows/dependabot-auto-merge.yml'}, {}, {}));
 assert.throws(()=>verifyJobs([{name:'OpenCode worker (x)',status:'completed',conclusion:'success',id:1}],{nonce:'x'},{jobId:1}));
});
test('source edits cannot weaken existing tests',()=>{
 assert.equal(evaluateScope([{filename:'src/app/a.test.ts',status:'modified',before:'expect(true).toBe(true)',after:''}]).allowed,false);
});
test('tag-only action updates stay in scope while command changes do not',()=>{
 const before='jobs:\n  test:\n    steps:\n      - uses: actions/checkout@v6\n      - run: pnpm test\n';
 assert.equal(evaluateScope([{filename:'.github/workflows/ci.yml',status:'modified',before,after:before.replace('@v6','@v7')}]).allowed,true);
 assert.equal(evaluateScope([{filename:'.github/workflows/ci.yml',status:'modified',before,after:before.replace('pnpm test','true')}]).allowed,false);
});
test('repository API uses atomic expected heads and never retries ambiguous writes',async()=>{
 const calls=[];const client=createClient({repo:'o/r',appId:99},'read','write',async(url,init)=>{calls.push({url,init});return {ok:false,status:503}});
 await assert.rejects(()=>client.queueMerge({node_id:'PR_one',head:{sha:'a'.repeat(40)}}));assert.equal(calls.length,1);
 assert.equal(JSON.parse(calls[0].init.body).variables.head,'a'.repeat(40));
});

test('empty workflow PR arrays use authenticated exact-head commit association and current-main ancestry',()=>{
 const s=snapshot();s.ci.pull_requests=[];assert.equal(evaluateCandidate(s).kind,'waiting');
 s.headPullRequests=[{number:s.pr.number,head:s.pr.head,base:s.pr.base}];assert.equal(evaluateCandidate(s).kind,'ready');
 s.containsMain=false;assert.equal(evaluateCandidate(s).kind,'refresh');
});

test('transient reads have at most one retry',async()=>{
 let calls=0;const client=createClient({repo:'o/r',appId:99},'read',undefined,async()=>{calls++;return {ok:false,status:503}});
 await assert.rejects(()=>client.getRepo());assert.equal(calls,2);
});

test('fresh read-only worker session emits a bound artifact and rejects command execution',async()=>{
 const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
 const {spawn}=require('node:child_process');
 const {runAgent}=require('./dependabot-opencode-worker.cjs');
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'dependabot-contract-'));
 const t={...task,kind:'review',nonce:'12345678-1234-1234-1234-123456789abc',createdAt:'2026-10-20T00:00:00.000Z'};
 const origin={repositoryId:1,workflowPath:'.github/workflows/dependabot-auto-merge.yml',workflowSha:t.base,ref:'refs/heads/main',runId:1,runAttempt:1,jobId:1};
 const report={verdict:'approve',findings:[],coveredFiles:['package.json'],assessment:{security:{status:'pass',rationale:'mock contract result'},compatibility:{status:'pass',rationale:'mock contract result'}}};
 const snapshot={task:t,changedFiles:['package.json'],baseFiles:{'package.json':'{}'},headFiles:{'package.json':'{}'},existingPaths:['package.json'],contextFiles:{}};
 const launcher=(bad)=>({env})=>{
   assert.equal(env.OPENCODE_GO_API_KEY,undefined);assert.equal(env.GH_TOKEN,undefined);
   const events=[{type:'step_start',sessionID:'ses_test'},...(bad?[{type:'tool_use',part:{tool:'bash'}}]:[]),{type:'text',part:{text:JSON.stringify(report)}}];
   return spawn(process.execPath,['-e',`for(const e of ${JSON.stringify(events)})process.stdout.write(JSON.stringify(e)+'\\n')`],{env:{PATH:process.env.PATH}});
 };
 try {
   const artifact=await runAgent(t,{root:path.join(root,'good'),snapshot,origin},{launcher:launcher(false)});
   assert.equal(artifact.task.head,t.head);assert.equal(artifact.agent.model,'glm-5.3');assert.equal(artifact.origin.workflowSha,t.base);
   await assert.rejects(()=>runAgent(t,{root:path.join(root,'bad'),snapshot,origin},{launcher:launcher(true)}),/Denied agent tool/);
 } finally {fs.rmSync(root,{recursive:true,force:true});}
});

test('production commit-status failure persists a block even when deployment records are green',async()=>{
 let saved;
 const fetcher=async(url,init)=>{
  let data;
  if(init.method==='POST'){saved=JSON.parse(init.body);data={id:1,body:saved.body,user:{id:100}};}
  else if(url.includes('/issues/1/comments'))data=[];
  else if(url.includes('/deployments/10/statuses'))data=[{id:20,state:'success',creator:{id:35613825}}];
  else if(url.includes('/deployments?'))data=[{id:10,sha:'a'.repeat(40),created_at:'2026-10-20T00:00:00Z',environment:'Production',creator:{id:35613825}}];
  else if(url.includes('/git/ref/heads/production'))data={object:{sha:'a'.repeat(40)}};
  else if(url.includes('/commits/'))data=[{id:31,context:'Vercel',state:'success',created_at:'2026-10-20T01:00:00Z',creator:{id:35613825},target_url:'https://vercel.com/team/project/recovered'},{id:30,context:'Vercel',state:'failure',created_at:'2026-10-20T00:30:00Z',creator:{id:35613825},target_url:'https://vercel.com/team/project/failed'}];
  else throw Error(`Unexpected mock path: ${url}`);
  return {ok:true,status:200,json:async()=>data};
 };
 const client=createClient({repo:'o/r',appId:99,appBotId:100,stateIssue:1,deploymentEnvironment:'Production',deploymentBaseline:10,productionBranch:'production',vercelPrefix:'https://vercel.com/team/project/'},'read','write',fetcher);
 const state=await client.productionState(true);assert.equal(state.healthy,false);assert.equal(state.block.statusId,30);assert.match(saved.body,/productionBlock/);
});

test('Go broker uses canonical OpenAI endpoint and bounds upstream requests',async()=>{
 const {createGoProxy}=require('./dependabot-opencode-proxy.cjs');let calls=0;
 const broker=await createGoProxy({apiKey:'test-only',model:'glm-5.3',maxCalls:1,timeoutMs:5000,session:'ses_test',fetcher:async(url)=>{assert.equal(url,'https://opencode.ai/inference/go/openai/v1/chat/completions');calls++;return new Response('{}',{status:200,headers:{'content-type':'application/json'}})}});
 try {
  const request=()=>fetch(`${broker.url}/chat/completions`,{method:'POST',headers:{authorization:`Bearer ${broker.token}`,'content-type':'application/json'},body:JSON.stringify({model:'glm-5.3',messages:[]})});
  assert.equal((await request()).status,200);assert.equal((await request()).status,429);assert.equal(calls,1);
 } finally {await broker.close();}
});

test('monitor outage revokes queued bot merge gates before failing reconciliation',async()=>{
 const {run}=require('./dependabot-controller-run.cjs');const s=snapshot();s.pr.auto_merge={merge_method:'squash'};
 const calls=[];const client={getRepo:async()=>({id:1}),request:async()=>({type:'Bot',id:100}),getRun:async()=>({}),productionState:async()=>{throw Error('monitor unavailable')},listPrs:async()=>[s.pr],getPr:async()=>s.pr,hasDependabotHead:async()=>false,setGate:async(_pr,kind)=>calls.push(kind),disableMerge:async()=>calls.push('disable')};
 const env={GITHUB_REPOSITORY:'o/r',DEPENDABOT_CONTROLLER_APP_ID:'99',DEPENDABOT_STATE_ISSUE_NUMBER:'1',DEPENDABOT_CONTROLLER_APP_SLUG:'controller',DEPENDABOT_AUTOMATION_ENABLED:'true',DEPENDABOT_READ_TOKEN:'test',DEPENDABOT_APP_TOKEN:'test',GITHUB_EVENT_NAME:'schedule',GITHUB_RUN_ID:'1',GITHUB_REF:'refs/heads/main',GITHUB_WORKFLOW_SHA:'b'.repeat(40)};
 const original=global.fetch;global.fetch=async()=>{throw Error('Network disabled in test')};
 try {await assert.rejects(()=>run(env,'controller',{createClient:()=>client}));}finally{global.fetch=original;}
 assert.deepEqual(calls,['pending','disable','blocked']);
});

test('production advancement does not hide a recovered failure on the prior head',async()=>{
 let saved;const base='a'.repeat(40),head='b'.repeat(40);
 const fetcher=async(url,init)=>{
  let data;
  if(init.method==='POST'){saved=JSON.parse(init.body);data={id:1,body:saved.body,user:{id:100}};}
  else if(url.includes('/issues/1/comments'))data=[];
  else if(url.includes('/deployments/10/statuses'))data=[{id:20,state:'success',creator:{id:35613825}}];
  else if(url.includes('/deployments?'))data=[{id:10,sha:base,created_at:'2026-10-20T00:00:00Z',environment:'Production',creator:{id:35613825}}];
  else if(url.includes('/git/ref/heads/production'))data={object:{sha:head}};
  else if(url.includes('/compare/'))data={status:'ahead',total_commits:1,commits:[{sha:head}]};
  else if(url.includes(`/commits/${base}/`))data=[{id:31,context:'Vercel',state:'success',created_at:'2026-10-20T01:00:00Z',creator:{id:35613825},target_url:'https://vercel.com/team/project/recovered'},{id:30,context:'Vercel',state:'failure',created_at:'2026-10-20T00:30:00Z',creator:{id:35613825},target_url:'https://vercel.com/team/project/failed'}];
  else if(url.includes(`/commits/${head}/`))data=[{id:40,context:'Vercel',state:'success',created_at:'2026-10-20T02:00:00Z',creator:{id:35613825},target_url:'https://vercel.com/team/project/current'}];
  else throw Error(`Unexpected mock path: ${url}`);
  return {ok:true,status:200,json:async()=>data};
 };
 const client=createClient({repo:'o/r',appId:99,appBotId:100,stateIssue:1,deploymentEnvironment:'Production',deploymentBaseline:10,productionBranch:'production',vercelPrefix:'https://vercel.com/team/project/'},'read','write',fetcher);
 const state=await client.productionState(true);assert.equal(state.healthy,false);assert.equal(state.block.head,base);assert.equal(state.block.statusId,30);assert.match(saved.body,/productionBlock/);
});

test('interrupted CI retries the full run, with a positive authenticated run ID',async()=>{
 const calls=[];const client=createClient({repo:'o/r',appId:99},'read','write',async(url,init)=>{calls.push({url,init});return {ok:true,status:201,json:async()=>({})}});
 await client.retryCi(55);assert.equal(calls.length,1);assert.equal(calls[0].url,'https://api.github.com/repos/o/r/actions/runs/55/rerun');assert.equal(calls[0].init.method,'POST');assert.throws(()=>client.retryCi(-1));
});

test('merge protection retains the repository review floor while requiring the new App gate and current CI',()=>{
 const {protectionAllowsMerge}=require('./dependabot-controller.cjs');
 const protection={required_status_checks:{strict:true,checks:[{context:'Dependabot Merge Gate',app_id:99},...REQUIRED_CHECKS.map(context=>({context}))]},required_pull_request_reviews:{required_approving_review_count:1,dismiss_stale_reviews:false,require_code_owner_reviews:false}};
 assert.equal(protectionAllowsMerge(protection,99),true);
 const noGate=structuredClone(protection);noGate.required_status_checks.checks.shift();assert.equal(protectionAllowsMerge(noGate,99),false);
 const stale=structuredClone(protection);stale.required_status_checks.strict=false;assert.equal(protectionAllowsMerge(stale,99),false);
 const incomplete=structuredClone(protection);incomplete.required_status_checks.checks.pop();assert.equal(protectionAllowsMerge(incomplete,99),false);
 const noApproval=structuredClone(protection);noApproval.required_pull_request_reviews.required_approving_review_count=0;assert.equal(protectionAllowsMerge(noApproval,99),false);
});

require('./dependabot-recovery-review.contract.cjs');

test('early interrupted CI retries before job creation without weakening run authentication', () => {
 for (const conclusion of ['cancelled', 'timed_out']) {
  const s=snapshot();s.ci.conclusion=conclusion;s.jobs=[];s.checks=[];
  assert.equal(evaluateCandidate(s).kind,'retry');
  for (const mutate of [x=>x.ci.head_sha='c'.repeat(40),x=>x.ci.workflow_id=999,x=>x.ci.event='push',x=>x.ci.head_repository.id=2,x=>x.ci.pull_requests[0].base.sha='c'.repeat(40),x=>x.ci.status='queued']) {
   const invalid=structuredClone(s);mutate(invalid);assert.notEqual(evaluateCandidate(invalid).kind,'retry');
  }
  s.jobs=[{name:REQUIRED_CHECKS[0],status:'queued'}];assert.equal(evaluateCandidate(s).kind,'retry');
 }
 const success=snapshot();success.jobs=[];success.checks=[];assert.equal(evaluateCandidate(success).kind,'waiting');
});

test('workspace overrides preserve surrounding policy and accept repository syntax', () => {
 const fs = require('node:fs');
 const before = fs.readFileSync('pnpm-workspace.yaml', 'utf8');
 const allowed = (oldText, newText) => evaluateScope([{filename:'pnpm-workspace.yaml',status:'modified',before:oldText,after:newText}]).allowed;
 const updated = before.replace(/(postcss[^\n]*: ["']?)\d+\.\d+\.\d+/, '$19.9.9');
 assert.notEqual(updated, before);
 assert.equal(allowed(before, updated), true);
 const fixture = "packages: []\noverrides:\n  # Keep this comment.\n  '@scope/pkg@>=1.0.0 <2.0.0': 2.0.1\n  'js-yaml@^3>argparse': '2.0.1' # CLI fix\npatchedDependencies:\n  pkg@1.0.0: patches/pkg.patch\nallowBuilds:\n  esbuild: false\n";
 assert.equal(allowed(fixture, fixture.replace(': 2.0.1', ': 2.0.2')), true);
 for (const after of [fixture.replace('patches/pkg.patch','patches/evil.patch'), fixture.replace('esbuild: false','esbuild: true'), fixture.replace('packages: []','packages: [evil]'), fixture + 'onlyBuiltDependencies: [evil]\n', fixture.replace(': 2.0.1', ': 2.0.1#invalid'), fixture.replace(': 2.0.1', ': file:./evil'), fixture.replace(': 2.0.1', ': https://evil.test/pkg'), fixture.replace(': 2.0.1', ': &version 2.0.1'), fixture + 'overrides:\n  x: 1.0.0\n', fixture.replace("  # Keep this comment.", "  nested:\n    value: 1.0.0"), fixture.replace("  # Keep this comment.", "  '@scope/pkg@>=1.0.0 <2.0.0': 2.0.2")]) {
  assert.equal(allowed(fixture, after), false, after);
 }
});

test('snapshot scopes the PR delta at its merge base before bounded refresh', async () => {
 const {createClient} = require('./dependabot-controller-api.cjs');
 const {evaluateCandidate} = require('./dependabot-controller-policy.cjs');
 const head='a'.repeat(40), main='b'.repeat(40), ancestor='c'.repeat(40);
 const filename='package.json';
 const original=JSON.stringify({scripts:{test:'jest'},dependencies:{next:'16.0.0'}});
 const updated=original.replace('16.0.0','16.0.1');
 const mainText=JSON.stringify({scripts:{test:'jest',build:'next build'},dependencies:{next:'16.0.0'}});
 const pr={id:1,node_id:'PR_one',number:1,changed_files:2,head:{sha:head,ref:'dependabot/npm_and_yarn/next',repo:{id:1}},base:{sha:main,ref:'main',repo:{id:1}},user:{id:49699333,type:'Bot',login:'dependabot[bot]'},body:'Bumps next from 16.0.0 to 16.0.1',title:'Bump next from 16.0.0 to 16.0.1',state:'open',draft:false,mergeable:true,mergeable_state:'behind'};
 let comparison={status:'diverged',merge_base_commit:{sha:ancestor}};
 let headText=updated;let ancestorText=original;
 const reads=[];
 const client=createClient({repo:'o/r',repositoryId:1},'read',undefined,async(url)=>{
  const parsed=new URL(url), path=parsed.pathname.replace('/repos/o/r','');let data;
  if(path==='/pulls/1/files')data=[{filename,status:'modified'},{filename:'pnpm-lock.yaml',status:'modified'}];
  else if(path.startsWith('/compare/'))data=comparison;
  else if(path==='/contents/'+filename){const ref=parsed.searchParams.get('ref');reads.push(ref);const value=ref===main?mainText:ref===ancestor?ancestorText:ref===head?headText:ref==='e'.repeat(40)?updated:null;assert.notEqual(value,null);data={sha:'d'.repeat(40),type:'file',size:value.length,encoding:'base64',content:Buffer.from(value).toString('base64')};}
  else if(path==='/git/blobs/'+'d'.repeat(40))data={encoding:'base64',content:''};
  else if(path==='/actions/workflows/ci.yml'||path==='/actions/workflows/ci.yaml')data={id:10};
  else if(path==='/actions/workflows/10/runs')data={workflow_runs:[]};
  else if(path.endsWith('/check-runs'))data={check_runs:[]};
  else if(path.endsWith('/statuses')||path.endsWith('/pulls'))data=[];
  else throw Error('Unexpected provider route '+path);
  return {ok:true,status:200,json:async()=>data};
 });
 client.getClaims=async()=>[{published:true,publishAttempted:true,resultId:head,task:{kind:'repair',pr:pr.number,prId:pr.node_id,head:'e'.repeat(40),base:main},origin:{repositoryId:1,workflowSha:main,workflowPath:'.github/workflows/dependabot-auto-merge.yml',ref:'refs/heads/main'}}];
 client.getIndependentReview=async()=>null;
 client.productionState=async()=>({healthy:true,block:null});
 client.getReleaseHealth=async()=>({kind:'ready'});
 const state=await client.snapshot(pr,main);
 assert.equal(state.scope.allowed,true);
 assert.equal(evaluateCandidate(state).kind,'refresh');
 assert.ok(reads.includes(ancestor));assert.ok(!reads.includes(main));
 headText=mainText.replace('16.0.0','16.0.1');
 const repaired=await client.snapshot(pr,main);assert.equal(repaired.scope.allowed,true);assert.equal(evaluateCandidate(repaired).kind,'refresh');
 ancestorText='';
 // Empty target data cannot prove which prior-parent updates were requested.
 const emptyAncestor=await client.snapshot(pr,main);assert.equal(emptyAncestor.scope.allowed,false);
 ancestorText=original;
 headText+='\n# untrusted new policy';
 assert.equal((await client.snapshot(pr,main)).scope.allowed,false);
 headText=updated;comparison={status:'ahead',merge_base_commit:{sha:main}};
 assert.equal((await client.snapshot(pr,main)).scope.allowed,false);
 for(const invalid of [{status:'ahead'}, {status:'ahead',merge_base_commit:{sha:ancestor}}, {status:'unknown',merge_base_commit:{sha:ancestor}}]) {
  comparison=invalid;await assert.rejects(()=>client.snapshot(pr,main),/merge base/i);
 }
});

test('contradictory or missing run associations never use the commit fallback',()=>{
 const s=snapshot();s.headPullRequests=[{number:s.pr.number,head:s.pr.head,base:s.pr.base}];
 for(const associations of [[{number:999,base:{sha:s.mainSha}}],[{number:s.pr.number,base:{sha:'c'.repeat(40)}}],undefined,null]) {
  s.ci.pull_requests=associations;
  for(const conclusion of ['success','cancelled','failure']) {s.ci.conclusion=conclusion;assert.equal(evaluateCandidate(s).kind,'waiting');}
 }
 s.ci.pull_requests=[];s.ci.conclusion='success';assert.equal(evaluateCandidate(s).kind,'ready');
});

test('partial grouped metadata falls back to complete version transitions', async () => {
 const {classifyDependabotPullRequest: classify}=await import('./classify-dependabot-pr.mjs');
 const prefix='Updates the dependencies group with 3 updates.\n';
 const transitions='Updates alpha from 1.0.0 to 1.0.1\nUpdates beta from 2.0.0 to 2.1.0\nUpdates gamma from 3.0.0 to 4.0.0\n';
 const metadata='update-type: version-update:semver-patch\n';
 const input={author:{login:'dependabot[bot]'},files:[{filename:'package.json'},{filename:'pnpm-lock.yaml'}]};
 const result=classify({...input,body:prefix+transitions+metadata});
 assert.equal(result.eligible,true);assert.match(result.reason,/1 patch and 1 minor, and 1 major/);
 assert.equal(classify({...input,files:[{filename:'.github/workflows/ci.yml'}],body:prefix+transitions+metadata}).eligible,true);
 for(const body of [prefix.replace('3 updates','4 updates')+transitions+metadata, prefix+transitions.replace('to 1.0.1','to 0.9.0')+metadata, prefix+transitions+metadata.repeat(4), prefix+metadata, prefix+transitions.replace('Updates beta from 2.0.0 to 2.1.0','Unknown beta change')+metadata]) {
  assert.equal(classify({...input,body}).eligible,false,body);
 }
 // Complete metadata and the existing ungrouped rules keep their behavior.
 assert.equal(classify({...input,body:prefix+metadata.repeat(3)}).eligible,true);
 assert.equal(classify({...input,body:metadata}).eligible,true);
 assert.equal(classify({...input,body:metadata.repeat(2)}).eligible,false);
});

test('production health requires a successful deployment for the current production SHA',async()=>{
 const base='a'.repeat(40),head='b'.repeat(40),moved='c'.repeat(40);
 let deployCurrent=false,status='success',drift=false,reads=0;
 const baseline={id:10,sha:base,created_at:'2026-10-20T00:00:00Z',environment:'Production',creator:{id:35613825}};
 const client=createClient({repo:'o/r',appId:99,appBotId:100,stateIssue:1,deploymentEnvironment:'Production',deploymentBaseline:10,productionBranch:'production',vercelPrefix:'https://vercel.com/team/project/'},'read',undefined,async(url,init)=>{
  assert.equal(init.method,'GET');let data;
  if(url.includes('/issues/1/comments'))data=[];
  else if(url.includes('/deployments/10/statuses'))data=[{id:20,state:'success',creator:{id:35613825}}];
  else if(url.includes('/deployments/11/statuses'))data=[{id:21,state:status,creator:{id:35613825}}];
  else if(url.includes('/deployments?'))data=deployCurrent?[{...baseline,id:11,sha:head},baseline]:[baseline];
  else if(url.includes('/git/ref/heads/production'))data={object:{sha:drift&&++reads>1?moved:head}};
  else if(url.includes('/compare/'))data={status:'ahead',total_commits:1,commits:[{sha:head}]};
  else if(url.includes('/commits/'))data=[{id:30,context:'Vercel',state:'success',created_at:'2026-10-20T01:00:00Z',creator:{id:35613825},target_url:'https://vercel.com/team/project/preview'}];
  else throw Error('Unexpected route '+url);
  return {ok:true,status:200,json:async()=>structuredClone(data)};
 });
 assert.equal((await client.productionState()).healthy,false);
 deployCurrent=true;status='pending';assert.equal((await client.productionState()).healthy,false);
 status='success';assert.equal((await client.productionState()).healthy,true);
 drift=true;assert.equal((await client.productionState()).healthy,false);
});

require('./dependabot-validation-binding.contract.cjs');

test('repair permits only new tests executed by isolated Jest validation',()=>{
 const allowed=['src/__tests__/components/new-case.test.tsx', 'src/__tests__/lib/new-case.spec.ts'],blocked=['tests/new-case.spec.ts', 'tests/new-case.test.tsx', 'test/new-case.test.ts', 'src/components/new-case.test.tsx', 'tests/setup.ts', 'src/__tests__/node_modules/case.test.ts', 'src/__tests__/security/case.test.ts'];
 const change=(filename,status)=>({filename,status,before:status==='added'?'':'original',after:'regression'});
 for(const filename of allowed){assert.equal(evaluateScope([change(filename,'added')]).allowed,true,filename);for(const status of ['modified','removed','renamed'])assert.equal(evaluateScope([change(filename,status)]).allowed,false,filename+' '+status)}
 for(const filename of blocked)assert.equal(evaluateScope([change(filename,'added')]).allowed,false,filename);
});
