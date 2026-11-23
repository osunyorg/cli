import { broadcast, createJob, isJobCancelled, markJobDone, runWithStream } from '../jobs';

export async function run(site) {
  const id = createJob('run');
  broadcast('job:start', { id });
  await runWithStream(id, 'yarn osuny dev', site.path, site.name)
  broadcast('job:end', { id });
  markJobDone(id);
};