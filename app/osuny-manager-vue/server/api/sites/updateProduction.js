import { broadcast, createJob, isJobCancelled, markJobDone, runWithStream } from '../jobs';

export async function updateProduction(site) {
  const id = createJob('update-production');
  broadcast('job:start', { id });
  console.log(site.path);
  await runWithStream(id, 'osuny up', site.path, site.name)
  broadcast('job:end', { id });
  markJobDone(id);
};
