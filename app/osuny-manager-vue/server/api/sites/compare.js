import { broadcast, createJob, isJobCancelled, markJobDone, runWithStream } from '../jobs';

export async function compare(site) {
  const id = createJob('compare');
  broadcast('job:start', { id });
  await runWithStream(id, 'osuny backstop', site.path, site.name)
  broadcast('job:end', { id });
  markJobDone(id);
  return { complete: true };
};