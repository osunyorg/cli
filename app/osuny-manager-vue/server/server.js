import express from 'express';
import { createServer } from 'http';
import { getSites, runSite, compareSite, updateSite } from './api/sites';
import { exec } from 'child_process';

export const app = express();
app.use(express.json());

// ── Sites ─────────────────────────────────────────────────────────────────────
app.get('/api/sites', async (req, res) => {
  const sites = await getSites();
  res.json(sites);
});

app.post('/api/sites/run', async (req, res) => {
  const site = req.body,
        result = await runSite(site); 
  res.json(result);
});

app.post('/api/sites/code', async (req, res) => {
  const site = req.body;
  exec('code .', { cwd: site.path });
});

app.post('/api/sites/compare', async (req, res) => {
  const site = req.body,
        result = await compareSite(site); 
  res.json(result);
});

app.post('/api/sites/update', async (req, res) => {
  const site = req.body,
        result = await updateSite(site); 
  res.json(result);
});

const PORT = process.env.PORT || 3000;
const server = createServer(app);

server.listen(PORT, () => {
  console.log(`\n🌿 Osuny Manager → http://localhost:${PORT}\n`);
});

export default app;