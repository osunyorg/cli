import fs from "fs/promises";
import path from "path";

const CONFIG_FILE = '/config/production/config.yaml';
const URL_PATTERN = /^baseURL: https:\/\/\s*["']?([^"'\n]+)["']?/m;

export async function getUrl(sitePath) {
  const configPath = path.join(sitePath, CONFIG_FILE);
  const content = await fs.readFile(configPath, 'utf-8');
  const match = content.match(URL_PATTERN);

  if (match) {
    return "https://" + match[1].trim().replace(/\/$/, '');
  }

  return null;
}