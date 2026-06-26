import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import { procExec } from '../../utils/utils';

export async function compare(site) {
  console.log('comparing : ', site.name);

  const result = await procExec({
    cmd: 'osuny backstop',
    cwd: site.path
  });

  return result;
};