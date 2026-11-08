export function createLaunchMetadata(config, pages) {
  const origin='https://'+config.company.domain;
  if(!/^https:\/\/[a-z0-9.-]+$/i.test(origin)) throw Error('Invalid target origin');
  const escape=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const organization={'@context':'https://schema.org','@type':'Organization',name:config.company.name,legalName:config.company.legalName,url:origin+'/',logo:origin+'/assets/logo.svg',email:config.company.privacyEmail,address:{'@type':'PostalAddress',addressLocality:config.company.city,addressCountry:'SA'}};
  const entries=[];
  for(const lang of ['ar','en']) for(const [route,arTitle,enTitle,arDescription,enDescription] of pages) {
    const url=origin+'/'+(lang==='en'?'en/':'')+route;
    const alternatives={ar:origin+'/'+route,en:origin+'/en/'+route,'x-default':origin+'/'+route};
    entries.push({lang,route,url,title:lang==='ar'?arTitle:enTitle,description:lang==='ar'?arDescription:enDescription,canonical:url,alternatives,image:origin+'/assets/social-'+lang+'.png',imageWidth:1200,imageHeight:630});
  }
  const sitemap='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'+entries.map(e=>'  <url><loc>'+escape(e.url)+'</loc>'+Object.entries(e.alternatives).map(([lang,url])=>'<xhtml:link rel="alternate" hreflang="'+lang+'" href="'+escape(url)+'"/>').join('')+'</url>').join('\n')+'\n</urlset>\n';
  return {origin,entries,organization,sitemap,robots:'User-agent: *\nAllow: /\nSitemap: '+origin+'/sitemap.xml\n'};
}
export function renderLaunchHead(page, organization) {
  return '<link rel="canonical" href="'+page.canonical+'">'+Object.entries(page.alternatives).map(([lang,url])=>'<link rel="alternate" hreflang="'+lang+'" href="'+url+'">').join('')+
    '<meta property="og:url" content="'+page.url+'"><meta property="og:image" content="'+page.image+'"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="GOEGSA"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="'+page.image+'">'+
    '<script type="application/ld+json">'+JSON.stringify(organization).replace(/</g,'\\u003c')+'</script>';
}
