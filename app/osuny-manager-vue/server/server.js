import express from 'express';
import { createServer } from 'http';
import { getSites } from './api/sites';

export const app = express();
app.use(express.json());

// ── Sites ─────────────────────────────────────────────────────────────────────
app.get('/api/sites', async (req, res) => {
  return getSites();
});

// ── Config ─────────────────────────────────────────────────────────────────────
app.get('/api/config', async (req, res) => {
  res.json({result: "Youhouuu"});
});

const PORT = process.env.PORT || 3000;
const server = createServer(app);

server.listen(PORT, () => {
  console.log(`\n🌿 Osuny Manager → http://localhost:${PORT}\n`);
  // do things
});

console.log('ok')
export default app;