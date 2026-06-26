import fs from "fs/promises";
import path from "path";
import CONFIG from './config';
import { getUrl } from "./sites/GetUrl";
import { run } from "./sites/run";
// import { limitPromises } from "../utils/utils";

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