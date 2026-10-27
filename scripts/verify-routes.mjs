import assert from 'node:assert/strict';
import {render} from './build.mjs';
const pages=[['','home'],['products/','catalog'],['products/school-management/','product'],['services/','services'],['about/','about'],['contact/','contact'],['privacy/','privacy'],['terms/','terms']];
for(const lang of ['ar','en'])for(const [route,page] of pages){
 const {html}=render(lang,route);
 assert(html.includes(`class="page-${page}"`),`${lang}/${route}: wrong page content`);
 const expected=(lang==='en'?'/':'/en/')+route;
 const match=html.match(/<a class="lang" href="([^"]+)"/);
 assert.equal(match?.[1],expected,`${lang}/${route}: language destination`);
 const destination=new URL(match[1],'https://goegsa.clearearth128.chatgpt.site');
 assert.equal(destination.hostname,'goegsa.clearearth128.chatgpt.site');
}
console.log('PASS: all 16 page types and language destinations stay on the correct site.');
