"use strict";
// A failure is durable. A later green deployment never clears this latch.
function productionFailure(existing, deployments) {
  if (existing) return existing;
  for (const deployment of deployments) {
    if (deployment.creator?.id !== 35613825) continue;
    const failed = deployment.statuses?.filter(s => s.creator?.id === 35613825 && ['failure','error'].includes(s.state)).sort((a,b)=>b.id-a.id)[0];
    if (failed) return {deploymentId:deployment.id,statusId:failed.id,environment:deployment.environment};
  }
  return null;
}
module.exports = {productionFailure};
