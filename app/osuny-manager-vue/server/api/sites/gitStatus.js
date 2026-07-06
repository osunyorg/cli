import { getGitStatus } from "./site/getGitStatus";

export async function gitStatus(site) {
  return await getGitStatus(site.path, site.themes);
}
