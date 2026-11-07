# Verified fallback release — 8 November 2026

The owner confirmed that every GitHub release is tested and approved retaining automatic latest-release selection. That behavior remains enabled.

The site's verified fallback is now v1.3.30, replacing v1.3.24. This is the version used if GitHub is unavailable, rate-limits requests, times out, or returns invalid metadata. No product features or claims were added based only on a version number; the older product-content source remains identified separately in configuration.

- Repository: mohammednassar101-lgtm/school-system-updates.
- Exact asset: SchoolSystemSetup.exe in release v1.3.30.
- Size: 28,288,039 bytes, checked after downloading the URL displayed by the live website.
- SHA-256: 43bc4b46a2734e1ddcf338ea812a97cbd43ff4b613021f641a28f690d985cca9, matching GitHub's asset digest.
- Authenticode: NotSigned, checked using Get-AuthenticodeSignature. The installer was not run.

`scripts/verify-automatic-download.mjs` executes the existing production updater against 23 scenarios: stable upgrades and numeric version comparison; unchanged/older/draft/prerelease/malformed releases; missing or mismatched assets; wrong host or digest; HTTP refusal, failed connection and invalid JSON; no product panel; and a download link unlocked before the release response arrives. Unacceptable responses preserve the fallback and unrelated links are unchanged. These are controlled response tests, not a claim that every external failure happened live.

The live Arabic trial form required its fields, retained optional marketing consent as unchecked, generated a sales@goegsa.com message and unlocked the v1.3.30 download. Opening mailto was blocked by the in-app browser policy and was not bypassed. A click on the browser download did not provide a reliable completion signal. The asset was independently downloaded from the exact displayed URL and its hash verified. Prior owner-confirmed test messages to Gmail and sales were sent directly from Gmail.

Still pending: ordinary client browser email/download handoff, actual Windows installation, physical iPhone/Android checks, new portal images/video, and an explicit public launch decision. Owner-only access, noindex and private no-store caching remain in force.
