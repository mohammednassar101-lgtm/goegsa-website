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
