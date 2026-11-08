import fs from 'node:fs';
import assert from 'node:assert/strict';
import './prepare-launch.mjs';
const config=JSON.parse(fs.readFileSync('config/site.json','utf8'));
const metadata=JSON.parse(fs.readFileSync('docs/launch-ready/metadata.json','utf8'));
assert.equal(config.publication.publicLaunchApproved,true);
assert.equal(config.publication.indexing,true);
assert.equal(metadata.status,'active');
assert.equal(metadata.pages.length,16);
assert.equal(new Set(metadata.pages.map(p=>p.url)).size,16);
for(const page of metadata.pages){
 const actual=fs.readFileSync('dist/'+(page.lang==='en'?'en/':'')+page.route+'index.html','utf8');
 assert.equal(page.url,page.canonical);
 assert(actual.includes('content="index,follow"'));
 assert(!actual.includes('content="noindex,nofollow"'));
 assert(!actual.includes('class="preview-note"'));
 assert(actual.includes('<link rel="canonical" href="'+page.canonical+'">'));
 for(const [lang,url] of Object.entries(page.alternatives))assert(actual.includes('<link rel="alternate" hreflang="'+lang+'" href="'+url+'">'));
 assert(actual.includes('property="og:url" content="'+page.url+'"'));
 assert(actual.includes('property="og:image" content="'+page.image+'"'));
 assert(actual.includes('name="twitter:card" content="summary_large_image"'));
 const org=JSON.parse(actual.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
 assert.equal(org.legalName,config.company.legalName);
 assert.equal(org.url,'https://goegsa.com/');
 assert.equal(org.address.addressCountry,'SA');
 assert(!('aggregateRating' in org));assert(!('taxID' in org));
}
assert.equal(fs.readFileSync('dist/robots.txt','utf8'),'User-agent: *\nAllow: /\nSitemap: https://goegsa.com/sitemap.xml\n');
assert.equal(fs.readFileSync('dist/sitemap.xml','utf8'),fs.readFileSync('docs/launch-ready/sitemap.xml','utf8'));
assert.equal((fs.readFileSync('dist/sitemap.xml','utf8').match(/<loc>/g)||[]).length,16);
for(const lang of ['ar','en']){
 const png=fs.readFileSync('dist/assets/social-'+lang+'.png');
 assert.equal(png.subarray(1,4).toString(),'PNG');
 assert.equal(png.readUInt32BE(16),1200);assert.equal(png.readUInt32BE(20),630);
}
assert(fs.readFileSync('dist/404.html','utf8').includes('content="noindex,nofollow"'));
console.log('PASS: approved public launch, 16 canonical/language/OG/JSON-LD pages, preview bar removed, sitemap/robots active, social images valid and 404 noindex.');
