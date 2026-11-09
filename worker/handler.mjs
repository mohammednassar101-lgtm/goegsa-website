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
export function createHandler(files, {publicCaching = false, publicIndexing = false, canonicalOrigin = null, cacheRevision = ''} = {}) {
  return { async fetch(request) {
    const url = new URL(request.url);
    const headers = new Headers(security);
    if (!['GET', 'HEAD'].includes(request.method)) {
      headers.set('Allow', 'GET, HEAD');
      return new Response(null, {status: 405, headers});
    }
    if (publicIndexing && canonicalOrigin && url.hostname === 'www.'+new URL(canonicalOrigin).hostname) {
      headers.delete('X-Robots-Tag');
      headers.set('Location', canonicalOrigin+url.pathname+url.search);
      return new Response(null, {status:308,headers});
    }
    let pathname;
    try { pathname = decodeURIComponent(url.pathname); }
    catch { return new Response(null, {status: 400, headers}); }
    // Only serve exact packaged paths; never fetch another host or read a filesystem.
    const lookup = key => Object.hasOwn(files,key) ? files[key] : undefined;
    let entry = lookup(pathname);
    if (!entry && lookup(pathname + '/index.html')) {
      if(publicIndexing) headers.delete('X-Robots-Tag');
      headers.set('Location', url.pathname + '/' + url.search);
      return new Response(null, {status: 308, headers});
    }
    if (!entry && pathname.endsWith('/')) entry = lookup(pathname + 'index.html');
    const status = entry ? 200 : 404;
    entry ||= files['/404.html'];
    headers.set('Content-Type', entry.type);
    if(publicIndexing && status===200) headers.delete('X-Robots-Tag');
    // Activated only by the owner-approved public launch configuration.
    if (publicCaching && status === 200) {
      const versioned = /^[a-f0-9]{12}$/.test(cacheRevision) && url.searchParams.get('v') === cacheRevision;
      if (entry.type.startsWith('text/html')) headers.set('Cache-Control', 'no-cache');
      else if (versioned) headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      // Unversioned filenames (including logos and fonts) may change at the same URL.
      else headers.set('Cache-Control', 'public, max-age=3600, must-revalidate');
    }
    const bytes = Uint8Array.from(atob(entry.data), c => c.charCodeAt(0));
    headers.set('Content-Length', String(bytes.length));
    if(status===200 && entry.type==='video/mp4') {
      headers.set('Accept-Ranges','bytes');
      const range=request.headers.get('Range');
      if(request.method==='GET' && range) {
        const match=/^bytes=(\d*)-(\d*)$/.exec(range);
        let start=0,end=bytes.length-1;
        if(match && (match[1]||match[2])) {
          if(match[1]) {start=Number(match[1]);if(match[2])end=Math.min(Number(match[2]),end);}
          else start=Math.max(0,bytes.length-Number(match[2]));
        } else start=NaN;
        if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>end||start>=bytes.length) {
          headers.set('Content-Range',`bytes */${bytes.length}`);
          headers.set('Content-Length','0');
          return new Response(null,{status:416,headers});
        }
        headers.set('Content-Range',`bytes ${start}-${end}/${bytes.length}`);
        headers.set('Content-Length',String(end-start+1));
        return new Response(bytes.slice(start,end+1),{status:206,headers});
      }
    }
    return new Response(request.method === 'HEAD' ? null : bytes, {status, headers});
  }};
}
