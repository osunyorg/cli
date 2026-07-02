import fs from "fs/promises";
import path from "path";

const OSUNY_VERSION_FILE = '/themes/osuny/static/osuny-theme-version.txt';
const OSUNY_CONFIG_FILE = '/themes/osuny/hugo.yaml';
const HUGO_VERSION_PATTERN = /hugoVersion:\s*\n(?:\s+.*\n?)*?\s*min:\s*([\d.]+)/;

export async function getVersions(sitePath) {
  const versions = {
    osuny: null,
    hugo: null
  };

  const osunyVersionFile = path.join(sitePath, OSUNY_VERSION_FILE);
  const osunyConfigFile = path.join(sitePath, OSUNY_CONFIG_FILE);

  try {
    versions.osuny = await fs.readFile(osunyVersionFile, 'utf-8');
    const configFileContent = await fs.readFile(osunyConfigFile, 'utf-8');
    const match = configFileContent.match(HUGO_VERSION_PATTERN);
    versions.hugo = match ? match[1] : null;
  } catch (e) {
    // no file founded
  }

  return versions;
}