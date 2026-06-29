import { broadcast, createJob, isJobCancelled, markJobDone, runWithStream } from '../jobs';

export async function compare(site) {
  const jobId = createJob('compare');
  broadcast('job:start', { jobId });
  await runWithStream(jobId, 'osuny backstop', site.path, site.name)
  broadcast('job:end', { jobId });
  markJobDone(jobId);
  return { complete: true };
};