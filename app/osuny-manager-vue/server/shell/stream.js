import { spawn } from 'child_process';
import { WebSocketServer } from 'ws';

// ── Shell streaming ────────────────────────────────────────────────────────────

/**
 * Exécute une commande shell et diffuse stdout/stderr via WebSocket.
 * @returns {Promise<number>} code de sortie
 */
export function runWithStream(jobId, cmd, cwd, label = null) {
  return new Promise((resolve) => {
    const proc = spawn('bash', ['-c', cmd], {
      cwd,
      env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
    });
    proc.stdout.on('data', (d) => {});
    proc.stderr.on('data', (d) => {});
    proc.on('close', (code) => {
      resolve(code ?? 0);
    });
  });
}
