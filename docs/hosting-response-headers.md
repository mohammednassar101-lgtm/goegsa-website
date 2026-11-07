# Response headers on Sites

The existing Site uses the supported Worker ESM deployment format. The same project, owner-only access policy, DNS-only root records, page markup and assets are retained. The outer Sites sign-in gate continues to enforce access; the handler does not supply authentication or proxy any other host.

Run `node scripts/build.mjs` to render the 16 pages and package all static bytes into `dist/server/index.js`. `node scripts/verify-worker.mjs` checks all packaged bytes, routes, headers, HEAD, missing pages and unsupported methods. The compressed module is guarded below 3 MiB.

Responses include nosniff, strict-origin-when-cross-origin, disabled camera/microphone/geolocation, limited CSP with frame-ancestors self, HSTS max-age=86400 without includeSubDomains/preload, and noindex/nofollow. This is not a claim of full XSS protection. Private responses are no-store.

The `_headers` file remains a reference for static hosts but is not relied upon by this deployment. The handler uses exact packaged paths only, with no runtime filesystem or external fetch. Unknown paths return the existing 404 page. DNS, external release downloads and client-side forms are unchanged.

Rollback: deploy saved static Site version 59 if server compatibility fails. Later builds must retain Worker packaging.
