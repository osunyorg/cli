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
