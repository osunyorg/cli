
import { procExec } from '../../utils/utils';

export async function update(site) {
  console.log('comparing : ', site.name);

  const result = await procExec({
    cmd: 'osuny u',
    cwd: site.path
  });

  return result;
};