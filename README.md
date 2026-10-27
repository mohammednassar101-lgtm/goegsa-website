# GOEGSA website

Private review site with Arabic and English content. Six pages per language.

## Build and checks
Run `node scripts/build.mjs` to generate complete static HTML documents from the shared application content.
Run `node scripts/verify.mjs` to build and verify all page variants, internal routes, assets and email request construction.
Run `node --check dist/app.js` for syntax.

Deploy `dist/` using the existing Site identity in `.openai/hosting.json`.

## Contact
Forms open a mailto draft. Visitors review and send through their own email app. No backend email delivery, persistence or tracking is implemented. The draft recipient is selected from info, sales, support and hr at goegsa.com. Mailbox operation remains unverified.

## Brand
The v5 vector logo is retained unchanged. Glossy light and dark references requested by the owner are displayed using CSS viewports over the supplied concept-reference image. The source pixels are unchanged.

See QA.md for completed scope, checks and launch dependencies. The company domain has not been connected.

## Operational configuration
Edit public business configuration in `config/site.json`, then run `node scripts/build.mjs`. Generated `dist/site-config.js` must load before `app.js`. Run `node scripts/verify.mjs` and `node scripts/verify-carousel.mjs` before packaging. Versioned asset references are generated automatically. See `docs/phase-2.md` for launch dependencies.

## External review
See `docs/claude-review-2026-10-27.md` for the Arabic site review (2026-10-27) and the prioritized action plan.
