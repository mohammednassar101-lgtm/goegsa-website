(async () => {
  const panel = document.getElementById('download-integrity');
  if (!panel) return;
  const trial = SITE_CONFIG.products.school.trial;
  const repository = 'mohammednassar101-lgtm/school-system-updates';
  try {
    const response = await fetch('https://api.github.com/repos/' + repository + '/releases/latest', {
      signal: AbortSignal.timeout(5000),
      credentials: 'omit',
    });
    if (!response.ok) return;
    const release = await response.json();
    const tag = release.tag_name;
    if (release.draft || release.prerelease || !/^v\d+\.\d+\.\d+$/.test(tag)) return;
    const current = trial.version.slice(1).split('.').map(Number);
    const next = tag.slice(1).split('.').map(Number);
    const difference = next.findIndex((part, index) => part !== current[index]);
    if (difference === -1 || next[difference] < current[difference]) return;
    const url = 'https://github.com/' + repository + '/releases/download/' + tag + '/SchoolSystemSetup.exe';
    const installer = release.assets?.find(asset => asset.name === 'SchoolSystemSetup.exe');
    if (installer?.browser_download_url !== url || !/^sha256:[a-f0-9]{64}$/i.test(installer.digest)) return;
    const releaseNotesUrl = 'https://github.com/' + repository + '/releases/tag/' + tag;
    const sha256 = installer.digest.slice(7).toLowerCase();
    for (const link of document.querySelectorAll('a[href]')) {
      if (link.href === trial.releaseNotesUrl) link.href = releaseNotesUrl;
    }
    Object.assign(trial, { version: tag, releaseNotesUrl, sha256 });
    panel.querySelector('strong').textContent = tag;
  } catch {
    // Keep the verified release already included in the page.
  }
})();
