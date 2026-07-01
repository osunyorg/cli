import fs from "fs/promises";
import path from "path";
import CONFIG from '../config';
import { getUrl } from "./site/getUrl";
import { getThemes } from "./site/getThemes";

async function getSite(name, sitePath) {
  const themes = await getThemes(sitePath);

  if (!themes) {
    // If there's no themes, its not an osuny site
    return false;
  }

  return {
    name: name,
    path: sitePath,
    url: await getUrl(sitePath),
    themes: themes,
    visible: true
  };
}

export async function getAll() {
  const sites = [];

  try {
    const entries = await fs.readdir(CONFIG.sitesRoot, { withFileTypes: true });

    const results = await Promise.all(
      entries.map(async (entry) => {
        if (!entry.isDirectory()) return null;

        const sitePath = path.join(CONFIG.sitesRoot, entry.name);

        return await getSite(entry.name, sitePath);
      })
    );

    sites.push(...results.filter(Boolean));

  } catch (e) {
    console.error('Error discovering sites:', e.message);
  }

  console.log(sites);
  return sites;
}
