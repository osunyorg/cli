export async function checkGitStatus(site) {
  site.checkingGitStatus = true;

  try {
    const res = await fetch('/api/sites/git-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(site),
    });
    site.gitStatus = await res.json();
  } finally {
    site.checkingGitStatus = false;
  }
}
