import fs from 'node:fs';import path from 'node:path';import {pages} from './build.mjs';
const config=JSON.parse(fs.readFileSync('config/site.json','utf8'));
const output=path.resolve('docs/launch-ready');fs.mkdirSync(output,{recursive:true});
const origin='https://'+config.company.domain;
if(!/^https:\/\/[a-z0-9.-]+$/i.test(origin))throw Error('Invalid target origin');
const escape=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const organization={'@context':'https://schema.org','@type':'Organization',name:config.company.name,legalName:config.company.legalName,url:origin+'/',logo:origin+'/assets/logo.svg',email:config.company.privacyEmail,address:{'@type':'PostalAddress',addressLocality:config.company.city,addressCountry:'SA'}};
const entries=[];
for(const lang of ['ar','en'])for(const [route,arTitle,enTitle,arDescription,enDescription] of pages){
const url=origin+'/'+(lang==='en'?'en/':'')+route;
const alternatives={ar:origin+'/'+route,en:origin+'/en/'+route,'x-default':origin+'/'+route};
entries.push({lang,route,url,title:lang==='ar'?arTitle:enTitle,description:lang==='ar'?arDescription:enDescription,canonical:url,alternatives,image:origin+'/assets/social-'+lang+'.png',imageWidth:1200,imageHeight:630});
}
const sitemap='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'+entries.map(e=>'  <url><loc>'+escape(e.url)+'</loc>'+Object.entries(e.alternatives).map(([lang,url])=>'<xhtml:link rel="alternate" hreflang="'+lang+'" href="'+escape(url)+'"/>').join('')+'</url>').join('\n')+'\n</urlset>\n';
fs.writeFileSync(path.join(output,'sitemap.xml'),sitemap);
fs.writeFileSync(path.join(output,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: '+origin+'/sitemap.xml\n');
fs.writeFileSync(path.join(output,'metadata.json'),JSON.stringify({status:'staged-only',targetOrigin:origin,pages:entries,organization},null,2)+'\n');
fs.writeFileSync(path.join(output,'README.md'),'# Launch preparation — staged only\n\nThese files are outside dist and are not active on the review site. Do not copy robots.txt or sitemap.xml to production until the owner approves public launch and goegsa.com is connected and verified.\n\nAt approved launch: confirm the final HTTPS origin and redirect policy; regenerate this package; copy social-ar.png and social-en.png to /assets/; wire canonical, absolute reciprocal hreflang, Open Graph image/URL and Organization JSON-LD from metadata.json into the page builder; copy sitemap/robots; switch robots meta and remove the preview bar; verify public access, HTTPS, headers and all 16 URLs; submit the sitemap only after these checks. Do not add prices, ratings or registration identifiers without owner approval.\n\nThis package contains no analytics or tracking scripts. Organization details describe the operator, not a claim of legal certification.\n\nSource: https://developers.google.com/search/docs/specialty/international/localized-versions\n');
console.log('Prepared '+entries.length+' launch URLs outside dist. Public indexing remains disabled.');
