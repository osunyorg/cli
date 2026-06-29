import { spawn } from 'child_process';

/**
 * Limite le nombre de promesses exécutées en parallèle.
 * @param {number} concurrency
 * @returns {(fn: () => Promise) => Promise}
 */
export function limitPromises(concurrency) {
  const queue = [];
  let running = 0;

  const run = async () => {
    if (running >= concurrency || !queue.length) return;
    running++;
    const { fn, resolve, reject } = queue.shift();
    try {
      resolve(await fn());
    } catch (e) {
      reject(e);
    } finally {
      running--;
      run();
    }
  };

  return (fn) => new Promise((resolve, reject) => {
    queue.push({ fn, resolve, reject });
    run();
  });
}

/** Pause asynchrone. */
export const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export async function procExec({ cmd, cwd }) {
  return new Promise((resolve) => {
    const proc = spawn('bash', ['-c', cmd], {
      cwd,
      env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
    });

    console.log(proc);
    console.log(proc.stdin);
    // proc.stdout.on('data', (d) => { console.log(d.toString()) });
    // proc.stderr.on('data', (d) => { console.log(d.toString()) });
    proc.on('close', (code) => {
      resolve(code ?? 0);
    });

  });
};
