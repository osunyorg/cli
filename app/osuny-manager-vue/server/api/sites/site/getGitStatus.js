import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import { limitPromises } from "../../../utils/utils.js";

const execAsync = promisify(exec);
// Caps concurrent git fetches across all sites, since getAll() checks hundreds of repos in parallel.
const limit = limitPromises(20);

async function run(cmd, cwd) {
  const { stdout } = await execAsync(cmd, { cwd, env: { ...process.env, GIT_TERMINAL_PROMPT: '0' } });
  return stdout;
}

async function getRepoStatus(repoPath) {
  return limit(() => checkRepoStatus(repoPath));
}

async function checkRepoStatus(repoPath) {
  try {
    const branch = (await run('git rev-parse --abbrev-ref HEAD', repoPath)).trim();

    await run('git fetch origin main --quiet', repoPath);

    const counts = (await run('git rev-list --left-right --count HEAD...origin/main', repoPath)).trim();
    const [ahead, behind] = counts.split(/\s+/).map(Number);

    return {
      branch,
      ahead,
      behind,
      upToDate: branch === 'main' && behind === 0,
    };
  } catch (e) {
    return {
      branch: null,
      ahead: null,
      behind: null,
      upToDate: false,
    };
  }
}

export async function getGitStatus(sitePath, themes = []) {
  const main = await getRepoStatus(sitePath);

  const submodules = await Promise.all(
    themes.map(async (theme) => ({
      name: theme.name,
      ...(await getRepoStatus(path.join(sitePath, 'themes', theme.name))),
    }))
  );

  return {
    main,
    submodules,
    upToDate: main.upToDate && submodules.every((submodule) => submodule.upToDate),
  };
}
