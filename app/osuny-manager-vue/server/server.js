import express from 'express';
import { createServer } from 'http';
import { getSites, runSite } from './api/sites';

export const app = express();
app.use(express.json());

// ── Sites ─────────────────────────────────────────────────────────────────────
app.get('/api/sites', async (req, res) => {
  const sites = await getSites();
  res.json(sites);
});


// Statuts submodules en batch — évite 800 requêtes HTTP individuelles
app.post('/api/sites/run', async (req, res) => {
  const site = req.body,
        result = await runSite(site); 
  res.json(result);
});

const PORT = process.env.PORT || 3000;
const server = createServer(app);

server.listen(PORT, () => {
  console.log(`\n🌿 Osuny Manager → http://localhost:${PORT}\n`);
});

export default app;