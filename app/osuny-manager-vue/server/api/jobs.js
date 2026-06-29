import { spawn } from 'child_process';
import { WebSocketServer } from 'ws';

// ── WebSocket setup ────────────────────────────────────────────────────────────
const clients = new Set();
let wss = null;

export function attachWebSocket(server) {
  wss = new WebSocketServer({ server });
  wss.on('connection', (ws) => {
    clients.add(ws);
    ws.on('close', () => clients.delete(ws));
  });
}

export function broadcast(type, payload) {
  const msg = JSON.stringify({ type, ...payload });
  for (const ws of clients) {
    if (ws.readyState === 1) ws.send(msg);
  }
}

// ── Job registry ───────────────────────────────────────────────────────────────
const jobs = new Map(); // jobId → { proc, cancelled, done, createdAt }

export function createJob(prefix) {
  const jobId = `${prefix}-${Date.now()}`;
  jobs.set(jobId, { proc: null, cancelled: false, done: false, createdAt: Date.now() });
  return jobId;
}

export function cancelJob(jobId) {
  const job = jobs.get(jobId);
  if (!job) return false;
  job.cancelled = true;
  job.proc?.kill('SIGTERM');
  return true;
}

export function isJobCancelled(jobId) {
  return jobs.get(jobId)?.cancelled ?? false;
}

export function markJobDone(jobId) {
  const job = jobs.get(jobId);
  if (job) job.done = true;
}

/** Supprime les jobs terminés depuis plus d'une heure. */
export function cleanupOldJobs() {
  const cutoff = Date.now() - 3_600_000;
  for (const [id, job] of jobs) {
    if (job.done && job.createdAt < cutoff) jobs.delete(id);
  }
}

// ── Shell streaming ────────────────────────────────────────────────────────────

/**
 * Exécute une commande shell et diffuse stdout/stderr via WebSocket.
 * @returns {Promise<number>} code de sortie
 */
export function runWithStream(jobId, cmd, cwd, label = null) {
  return new Promise((resolve) => {
    if (isJobCancelled(jobId)) return resolve(130);
    if (label) broadcast('job:out', { jobId, text: `\n▶ ${label}\n` });

    const proc = spawn('bash', ['-c', cmd], {
      cwd,
      env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
    });

    const job = jobs.get(jobId);
    if (job) job.proc = proc;

    proc.stdout.on('data', (d) => broadcast('job:out', { jobId, text: d.toString() }));
    proc.stderr.on('data', (d) => broadcast('job:err', { jobId, text: d.toString() }));
    proc.on('close', (code) => {
      if (job) job.proc = null;
      resolve(code ?? 0);
    });
  });
}
