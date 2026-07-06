import { broadcast, createJob, isJobCancelled, markJobDone, runWithStream } from '../jobs';

export async function update(site) {
  const id = createJob('run');
  broadcast('job:start', { id });
  await runWithStream(id, 'osuny u', site.path, site.name)
  broadcast('job:end', { id });
  markJobDone(id);
};