# GOEGSA website

Arabic and English static marketing site. The deployed version includes the simplified trial request form: visitors enter their details, open an email or WhatsApp draft, then receive a download link. No customer database, automatic email delivery or tracking is included.

## Build and validation

Requires Node.js and Git. No package installation is needed.

```sh
node scripts/build.mjs
node --check dist/app.js
node --check dist/simple-trial.js
node scripts/verify.mjs
node scripts/verify-carousel.mjs
node scripts/verify-routes.mjs
node scripts/verify-simple-trial.mjs
node scripts/verify-release.mjs
```

Edit shared page content in `dist/app.js`, trial messaging in `dist/simple-trial.js`, styles in `dist/styles.css`, `dist/design-system.css` and `dist/simple-trial.css`, and public business settings in `config/site.json`. Rebuild generated HTML after changes; do not edit only the generated HTML files. The current source layout is retained; separating source and output remains planned.

## Preview and deployment

Serve `dist/` at the web root using a local static HTTP server. Absolute asset paths require HTTP preview rather than opening HTML files directly.

`.openai/hosting.json` contains the existing Sites identity and declares `dist` as the static directory. It contains no credentials. Existing Site access settings must be preserved. Deployment through Sites requires the owning account and the supported Sites workflow; the manifest is not a login credential.

For another static host, publish the contents of `dist/` at the root. Connecting `goegsa.com`, configuring host-specific security headers and opening search indexing are separate launch steps. No deployment to Cloudflare Pages has been configured or claimed.

## Trial contact

Trial drafts go to `goegsa.business@gmail.com` or the WhatsApp number in `config/site.json`. The visitor reviews and sends the draft using their own email or WhatsApp app. Marketing consent is optional and included in the draft. Other contact/quote forms retain their existing department routing.

The download link becomes visible after the form action opens the draft link. Mailbox delivery and actual message submission are outside the site's control. The installer remains hosted on a public GitHub release.

## Images and review

The former oversized identity and system-map PNG files have been replaced with local WebP files (155,128 and 169,750 bytes) with the same dimensions. The site no longer fetches the system map from a temporary external hostname. Images are included in this repository. No PNG originals or credentials are required for building.

See [Claude's original review](docs/claude-review-2026-10-27.md), preserved unchanged, and [the assessment against the current site](docs/claude-review-response-2026-10-27.md). The original review covers commit `778b502`, before later published fixes and the new trial form.

## Review remediation

There are now eight pages per language, including privacy and website-use information. Edit policy text in `config/legal.json`; operator details and the manually managed 12-month correspondence retention policy were approved by the owner. No commercial-registration claim is published. The software licence remains separate from website-use information.

The installer link is pinned to a verified release so that its visible SHA-256 checksum matches the offered file. See `docs/release-verification-2026-10-27.md` before changing the download. `scripts/verify-release.mjs` checks this contract.

`dist/_headers` provides portable static-host response-header rules. Deployment enforcement must be checked on the actual host. Frame-ancestor restrictions have not been enabled because the site also needs its approved embedded preview.

## Browser policy fallback

The current Sites host did not enforce `_headers` when checked after version 34. Every generated HTML document now includes a meta CSP for `object-src`, `base-uri` and `form-action`, plus an explicit referrer policy. This is a limited browser-level fallback, not full header enforcement or an XSS protection claim. It does not implement HSTS, MIME sniffing protection, Permissions-Policy or frame-ancestor restrictions. Those remain hosting tasks; do not mark the header review complete.
