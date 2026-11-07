# Response headers on Sites

The existing Site uses the supported Worker ESM deployment format. The same project, owner-only access policy, DNS-only root records, page markup and assets are retained. The outer Sites sign-in gate continues to enforce access; the handler does not supply authentication or proxy any other host.

Run `node scripts/build.mjs` to render the 16 pages and package all static bytes into `dist/server/index.js`. The generated module is ignored by Git and included only in the deployment archive. A clean clone must build before packaging or running the Worker test. `node scripts/verify-worker.mjs` checks all packaged bytes, routes, headers, HEAD, missing pages and unsupported methods. The compressed module is guarded below 3 MiB.

Responses include nosniff, strict-origin-when-cross-origin, disabled camera/microphone/geolocation, limited CSP with frame-ancestors self, HSTS max-age=86400 without includeSubDomains/preload, and noindex/nofollow. This is not a claim of full XSS protection. Private responses are no-store.

The `_headers` file remains a reference for static hosts but is not relied upon by this deployment. The handler uses exact packaged paths only, with no runtime filesystem or external fetch. Unknown paths return the existing 404 page. DNS, external release downloads and client-side forms are unchanged.

Rollback: deploy saved static Site version 59 if server compatibility fails. Later builds must retain Worker packaging.

## Staged public caching — not enabled

`worker/cache-policy.json` keeps `publicCachingEnabled: false`. Current responses retain `private, no-store`, including images and fonts. Only an explicit owner launch decision permits changing this flag, separately from audience and indexing changes. It never opens access by itself.

The prepared policy uses `no-cache` for successful HTML, a year and `immutable` only when `?v=` exactly matches the packaged 12-character revision, and one hour with revalidation for mutable unversioned filenames. Arbitrary `?v=` values do not qualify. Unknown URLs and rejected methods remain no-store. Unversioned logos and font filenames must not be cached as immutable because replacing their bytes at the same URL would strand returning visitors on old content.

`verify-cache-policy.mjs` tests both staged and current behavior without changing the live flag. `verify-build-stability.mjs` must be run after intended changes are committed; it fails on changes to tracked output and also compares two generated modules. Git normalizes source line endings through `.gitattributes`, and the asset revision normalizes CRLF/LF before hashing.
