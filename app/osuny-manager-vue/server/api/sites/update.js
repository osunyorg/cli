
// import { procExec } from '../../utils/utils';

// export async function update(site) {
//   console.log('comparing : ', site.name);

//   const result = await procExec({
//     cmd: 'osuny u',
//     cwd: site.path
//   });

//   return result;
// };
import { broadcast, createJob, isJobCancelled, markJobDone, runWithStream } from '../jobs';

// const LOCAL_URL_PATTERN = /^http:\/\/\s*["']?([^"'\n]+)["']?/m;

export async function update(site) {
  const jobId = createJob('run');
  broadcast('job:start', { jobId });  
  await runWithStream(jobId, 'osuny u', site.path, site.name)
  broadcast('job:end', { jobId });
  markJobDone(jobId);
};