import express from 'express';
import { createServer } from 'http';
import { sitesManager } from './api/sites';

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

const PORT = process.env.PORT || 3000;
const server = createServer(app);

server.listen(PORT, () => {
  console.log(`\n🌿 Osuny Manager → http://localhost:${PORT}\n`);
});

export default app;