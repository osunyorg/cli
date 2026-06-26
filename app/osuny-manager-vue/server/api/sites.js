import fs from "fs/promises";
import path from "path";
import CONFIG from './config';

export async function getSites() {
  const sites = [];
  try {
    const entries = await fs.readdir(CONFIG.sitesRoot, { withFileTypes: true });

    const results = await Promise.all(
      entries.map((entry) => {
        console.log(entry)
        limit(async () => {
          if (!entry.isDirectory()) return null;
          const sitePath = path.join(CONFIG.sitesRoot, entry.name);
          return { name: entry.name, path: sitePath };
        })
      }));

    sites.push(...results.filter(Boolean));
  } catch (e) {
    console.error('Error discovering sites:', e.message);
  }

  return sites;
}