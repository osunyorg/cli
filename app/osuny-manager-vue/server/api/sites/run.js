import { exec } from 'child_process';
import { promisify } from 'util';
import { procExec } from '../../utils/utils';
// import { runWithStream } from '../api/jobs';
import { broadcast, createJob, isJobCancelled, markJobDone, runWithStream } from '../jobs';

const LOCAL_URL_PATTERN = /^http:\/\/\s*["']?([^"'\n]+)["']?/m;

export async function run(site) {
  const jobId = createJob('run');
  broadcast('job:start', { jobId });  
  await runWithStream(jobId, 'yarn upgrade && yarn osuny dev', site.path, site.name)

  // broadcast('job:done', {
  //   jobId,
  //   code: isJobCancelled(jobId) ? 130 : 0,
  //   final: true,
  //   cancelled: isJobCancelled(jobId),
  // });
  // const result = await procExec({
  //   cmd: 'yarn upgrade && yarn osuny dev',
  //   cwd: site.path
  // });

  console.log(result);
  return result;
  // console.log(site);
  // try {
  //   const { stdout, stderr } = await execAsync('yarn upgrade && yarn osuny dev', { cwd: site.path, timeout: 8_000 });
  //   const url = stderr
  //     .split('\n')
  //     .filter(Boolean)
  //     .map((line) => {
  //       if (line.indexOf('Web Server is available at ')) {
  //         const match = line.match(LOCAL_URL_PATTERN);
  //         if (match) {
  //           return match;
  //         }
  //       }
  //     })

  //   return url;
  // } catch(error) {
  //   return error;
  // }
};