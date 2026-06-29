import { broadcast, createJob, isJobCancelled, markJobDone, runWithStream } from '../jobs';

// const LOCAL_URL_PATTERN = /^http:\/\/\s*["']?([^"'\n]+)["']?/m;

export async function run(site) {
  const jobId = createJob('run');
  broadcast('job:start', { jobId });  
  await runWithStream(jobId, 'yarn upgrade && yarn osuny dev', site.path, site.name)
  broadcast('job:end', { jobId });
  markJobDone(jobId);
};