import { broadcast, createJob, isJobCancelled, markJobDone, runWithStream } from '../jobs';

export async function update(site) {
  const jobId = createJob('run');
  broadcast('job:start', { jobId });  
  await runWithStream(jobId, 'osuny u', site.path, site.name)
  broadcast('job:end', { jobId });
  markJobDone(jobId);
};