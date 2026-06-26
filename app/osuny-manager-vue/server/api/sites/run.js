import { exec } from 'child_process';
import { promisify } from 'util';
import { procExec } from '../../utils/utils';

const LOCAL_URL_PATTERN = /^http:\/\/\s*["']?([^"'\n]+)["']?/m;

const execAsync = promisify(exec);

export async function run(site) {
  console.log('running : ', site.name);

  const result = await procExec({
    cmd: 'yarn upgrade && yarn osuny dev',
    cwd: site.path
  });

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