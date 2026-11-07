// The Sites access gate remains outside this handler and controls all visitors.
const security = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': "object-src 'none'; base-uri 'self'; form-action 'self' mailto: https://wa.me; frame-ancestors 'self'",
  'Strict-Transport-Security': 'max-age=86400',
  'X-Robots-Tag': 'noindex, nofollow',
  'Cache-Control': 'private, no-store'
};
export function createHandler(files, {publicCaching = false, cacheRevision = ''} = {}) {
  return { async fetch(request) {
    const url = new URL(request.url);
    const headers = new Headers(security);
    if (!['GET', 'HEAD'].includes(request.method)) {
      headers.set('Allow', 'GET, HEAD');
      return new Response(null, {status: 405, headers});
    }
    let pathname;
    try { pathname = decodeURIComponent(url.pathname); }
    catch { return new Response(null, {status: 400, headers}); }
    // Only serve exact packaged paths; never fetch another host or read a filesystem.
    let entry = files[pathname];
    if (!entry && files[pathname + '/index.html']) {
      headers.set('Location', url.pathname + '/' + url.search);
      return new Response(null, {status: 308, headers});
    }
    if (!entry && pathname.endsWith('/')) entry = files[pathname + 'index.html'];
    const status = entry ? 200 : 404;
    entry ||= files['/404.html'];
    headers.set('Content-Type', entry.type);
    // Staged only: the build keeps publicCaching false until the owner's public launch decision.
    if (publicCaching && status === 200) {
      const versioned = /^[a-f0-9]{12}$/.test(cacheRevision) && url.searchParams.get('v') === cacheRevision;
      if (entry.type.startsWith('text/html')) headers.set('Cache-Control', 'no-cache');
      else if (versioned) headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      // Unversioned filenames (including logos and fonts) may change at the same URL.
      else headers.set('Cache-Control', 'public, max-age=3600, must-revalidate');
    }
    const bytes = Uint8Array.from(atob(entry.data), c => c.charCodeAt(0));
    headers.set('Content-Length', String(bytes.length));
    return new Response(request.method === 'HEAD' ? null : bytes, {status, headers});
  }};
}
