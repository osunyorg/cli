import fs from "fs/promises";
import path from "path";

const CONFIG_FILE = '/config/_default/config';

export async function getConfig(sitePath) {
  let configPath = path.join(sitePath, `${CONFIG_FILE}.yaml`);

  try {
    let content = await fs.readFile(configPath, 'utf-8');
    return content;
  } catch (e) {
    try {
      configPath = path.join(sitePath, `${CONFIG_FILE}.yml`);
      content = await fs.readFile(configPath, 'utf-8');
      return content;
    } catch (e) {
      return "";
    }
  }
}