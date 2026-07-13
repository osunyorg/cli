import { broadcast, createJob, isJobCancelled, markJobDone, runWithStream } from '../jobs';

// const LOCAL_URL_PATTERN = /^http:\/\/\s*["']?([^"'\n]+)["']?/m;

export async function run(site) {
  const id = createJob('run');
  broadcast('job:start', { id });  
  // await runWithStream(id, 'yarn upgrade && yarn osuny dev', site.path, site.name)
  // await runWithStream(id, 'osuny serve', site.path, site.name)
  await runWithStream(id, 'yarn osuny dev', site.path, site.name)
  broadcast('job:end', { id });
  markJobDone(id);
};