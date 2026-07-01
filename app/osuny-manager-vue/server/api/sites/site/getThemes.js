import fs from "fs/promises";
import nodePath from "path";

const SUBMODULE_ENTRY_REGEX = /path\s*= themes\/\s*(.+)\r?\n\s*url\s*=\s*(.+)/g;

export async function getThemes(sitePath) {
  try {
    const contents = await fs.readFile(nodePath.join(sitePath, '.gitmodules'), { encoding: 'utf8' });
    return [...contents.matchAll(SUBMODULE_ENTRY_REGEX)].map(([, name, url]) => ({
      name: name.trim(),
      url: url.trim(),
    }));
  } catch (err) {
    console.log(err);
    return false;
  }
};