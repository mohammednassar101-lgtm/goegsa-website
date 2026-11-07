import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const source=fs.readFileSync('dist/server/index.js','utf8');
const {default:worker}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const paths=[];
function walk(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){if(['server','.openai','_headers'].includes(item.name))continue;const f=path.join(dir,item.name);if(item.isDirectory())walk(f);else paths.push(f);}}
walk('dist');
for(const file of paths){
 const pathname='/'+path.relative('dist',file).split(path.sep).join('/');
 const res=await worker.fetch(new Request('https://goegsa.com'+pathname+'?v=test'));
 assert.equal(res.status,200,pathname);
 assert.deepEqual(Buffer.from(await res.arrayBuffer()),fs.readFileSync(file),pathname);
 for(const h of ['content-security-policy','strict-transport-security','permissions-policy','referrer-policy','x-content-type-options','x-robots-tag'])assert.ok(res.headers.get(h),h);
 assert.equal(res.headers.get('cache-control'),'private, no-store');
 const head=await worker.fetch(new Request('https://goegsa.com'+pathname,{method:'HEAD'}));assert.equal((await head.arrayBuffer()).byteLength,0);
}
for(const prefix of ['','en/'])for(const route of ['','products/','products/school-management/','services/','about/','contact/','privacy/','terms/']){
 const p='/'+prefix+route;const r=await worker.fetch(new Request('https://goegsa.com'+p));assert.equal(r.status,200,p);
}
assert.equal((await worker.fetch(new Request('https://goegsa.com/services?q=1'))).headers.get('location'),'/services/?q=1');
assert.equal((await worker.fetch(new Request('https://goegsa.com/absent'))).status,404);
assert.equal((await worker.fetch(new Request('https://goegsa.com/%E0%A4%A'))).status,400);
assert.equal((await worker.fetch(new Request('https://goegsa.com/',{method:'POST'}))).status,405);
console.log(`Worker verified: ${paths.length} files byte-identical, 16 routes, HEAD, redirect, 404, 400, 405 and security headers.`);
