# Latest installer download fix — 9 November 2026

Owner reported download v1.3.30 while GitHub latest was v1.3.33. The website stored a version-specific fallback installer URL and relied on browser release-API lookup to replace it. Lookup is skipped on pages without the release panel; timeout, rate limit or network refusal also retained the old installer. The exact browser failure in the owner's session was not captured.

The download now uses GitHub's official /releases/latest/download/SchoolSystemSetup.exe alias on every page. Metadata updates no longer replace that URL with a version-specific URL. API failure can retain the displayed metadata, but no longer pins the installer to an older release. The owner must keep the stable latest release asset named SchoolSystemSetup.exe.

Latest metadata baseline: v1.3.33. Downloaded the actual file through the alias: 28,319,093 bytes, Content-Disposition attachment, SHA256 def02160f431334be3df5d43efd22fdd3aab7988796861d0e179f1404e09ad6b matching GitHub v1.3.33. The installer was not executed.

Tests cover 23 release metadata cases including missing panel, API refusal/network/JSON failures, unchanged latest-download URL across updates, trial action ordering and analytics counting the stable alias. Existing content/security/Worker checks remain applicable.
