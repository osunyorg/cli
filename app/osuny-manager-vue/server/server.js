import express from 'express';
import { createServer } from 'http';
import { sitesManager } from './api/sites';
import { attachWebSocket, cancelJob } from './api/jobs';
import CONFIG from '../config';

export const app = express();
app.use(express.json());


// ── Sites ─────────────────────────────────────────────────────────────────────
app.get('/api/sites', async (req, res) => {
  const sites = await sitesManager.getAll();
  res.json(sites);
});

app.post('/api/sites/run', async (req, res) => {
  const site = req.body,
        result = await sitesManager.run(site); 
  res.json(result);
});

app.post('/api/sites/code', async (req, res) => {
  const site = req.body;
  sitesManager.code(site);
  res.json({ complete: true });
});

app.post('/api/sites/compare', async (req, res) => {
  const site = req.body,
        result = await sitesManager.compare(site); 
  res.json(result);
});

app.post('/api/sites/update', async (req, res) => {
  const site = req.body,
        result = await sitesManager.update(site);
  res.json(result);
});

app.post('/api/sites/git-status', async (req, res) => {
  const site = req.body,
        result = await sitesManager.gitStatus(site);
  res.json(result);
});

app.post('/api/jobs/:jobId/cancel', (req, res) => {
  const ok = cancelJob(req.params.jobId);
  res.json({ ok });
});

const PORT = CONFIG.SERVER_PORT;
const server = createServer(app);

attachWebSocket(server);

server.listen(PORT, () => {
  console.log(`\n🌿 Osuny Manager → http://localhost:${PORT}\n`);
});

export default app;