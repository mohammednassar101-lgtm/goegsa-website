# Phase 2 — operational preparation

Design acceptance is provisional as requested by the owner. This phase preserves the reviewed visual direction.

## Completed foundation
- Public company, team inboxes, WhatsApp destination, carousel intervals and school product data are managed in `config/site.json`.
- `scripts/build.mjs` validates contact addresses, WhatsApp format and the pricing approval flag, then generates the public runtime configuration and complete bilingual pages.
- CSS and JavaScript references include a content-derived version query, so a new publication requests the current assets.
- A bilingual, branded `404.html` provides home and contact recovery links. Its actual HTTP fallback behavior still needs hosting/browser verification.
- Existing navigation, carousel, email and WhatsApp construction checks pass.

## Configuration rules
This configuration is public. Never put passwords, API credentials, customer records or service secrets in it.
Prices and packages are pending. Do not set pricing status to published before commercial approval. Product screenshots and video remain empty until supplied and checked.

## Remaining launch inputs
- Approved product packages, price/currency, license duration, support/update scope and discounts.
- Actual school system screenshots and video.
- Final company/legal/privacy information.
- Access to domain DNS and an agreed hosting/domain mapping approach.
- Browser/device review and mailbox/WhatsApp handoff verification.

Current forms prepare a message for the visitor's email app or WhatsApp. They do not submit directly to a mail server, persist inquiries or send automatically.
