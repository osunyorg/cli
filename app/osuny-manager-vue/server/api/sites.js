import fs from "fs/promises";
import path from "path";
import CONFIG from './config';
import { getUrl } from "./sites/GetUrl";
import { run } from "./sites/run";
import { compare } from "./sites/compare";
import { update } from "./sites/update";

async function getSite(name, sitePath) {
  const site = {
    name: name,
    path: sitePath,
    url: await getUrl(sitePath),
    visible: true
  }
  return site;
}

async function checkGitModules(sitePath) {
  return fs.access(path.join(sitePath, '.gitmodules')).then(() => true).catch(() => false);
};

export async function getSites() {
  const sites = [];

  try {
    const entries = await fs.readdir(CONFIG.sitesRoot, { withFileTypes: true });

    const results = await Promise.all(
      entries.map(async (entry) => {
        if (!entry.isDirectory()) return null;
        const sitePath = path.join(CONFIG.sitesRoot, entry.name);

        if (await checkGitModules(sitePath)) {
          const site = await getSite(entry.name, sitePath);
          return site;
        }
      })
    );

    sites.push(...results.filter(Boolean));
  } catch (e) {
    console.error('Error discovering sites:', e.message);
  }

  return sites;
}

export async function runSite(site) {
  const result = await run(site);
  return result;
};

export async function compareSite(site) {
  const result = await compare(site);
  return result;
};


export async function updateSite(site) {
  const result = await update(site);
  return result;
};