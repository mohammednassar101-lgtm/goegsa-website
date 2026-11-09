import assert from 'node:assert/strict';
import fs from 'node:fs';
import {render} from './build.mjs';
const cfg=JSON.parse(fs.readFileSync('config/site.json','utf8'));
for(const lang of ['ar','en']){
 const {html}=render(lang,'products/school-management/');
 const videos=[...html.matchAll(/<video\b[^>]*>/g)].map(m=>m[0]);
 assert.equal(videos.length,2);
 for(const v of videos){assert(v.includes('controls'));assert(v.includes('playsinline'));assert(v.includes('preload="none"'));assert(!/autoplay|\bloop\b/.test(v));}
 assert(html.includes('id="program-videos"'));assert(html.includes('/assets/students-demo-1333.webp'));
 assert(html.includes(lang==='ar'?'صورة توضيحية معدّلة ببيانات وهمية':'edited illustration with fictional data'));
}
const source=fs.readFileSync('dist/server/index.js','utf8');
const {default:worker}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
for(const clip of cfg.products.school.media.clips){
 const file=fs.readFileSync('dist'+clip.src),url='https://goegsa.com'+clip.src;
 const response=await worker.fetch(new Request(url));assert.equal(response.headers.get('content-type'),'video/mp4');assert.equal(response.headers.get('accept-ranges'),'bytes');
 for(const [range,start,end] of [['bytes=0-99',0,99],['bytes=100-',100,file.length-1],['bytes=-40',file.length-40,file.length-1]]){
 const r=await worker.fetch(new Request(url,{headers:{Range:range}}));assert.equal(r.status,206);assert.equal(r.headers.get('content-range'),`bytes ${start}-${end}/${file.length}`);assert.deepEqual(Buffer.from(await r.arrayBuffer()),file.subarray(start,end+1));
 }
 for(const range of ['bytes=999999999-','bytes=20-10','bytes=-0','bytes=0-1,3-4'])assert.equal((await worker.fetch(new Request(url,{headers:{Range:range}}))).status,416);
}
console.log('PASS: AR/EN media, click-to-play, fictional-image label, video MIME and byte ranges.');
