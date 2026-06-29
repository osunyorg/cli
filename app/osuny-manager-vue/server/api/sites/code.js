import { exec } from 'child_process';

export function code (site) {
    exec('code .', { cwd: site.path });
};