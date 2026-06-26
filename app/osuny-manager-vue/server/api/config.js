import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_FILE = path.join(__dirname, '../../data/config.json');

async function getConfig() {
  try {
    const rawConfig = await fs.readFile(CONFIG_FILE, 'utf-8');
    return JSON.parse(rawConfig);
  } catch {
    return {};
  }
}

export default {
  CONFIG: await getConfig()
}
