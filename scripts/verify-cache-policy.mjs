import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHandler} from '../worker/handler.mjs';
const revision='123456abcdef';
const files={
 '/index.html':{type:'text/html; charset=utf-8',data:btoa('home')},
 '/404.html':{type:'text/html; charset=utf-8',data:btoa('missing')},
 '/app.js':{type:'text/javascript; charset=utf-8',data:btoa('app')},
 '/assets/logo.svg':{type:'image/svg+xml',data:btoa('<svg/>')}
};
const current=JSON.parse(fs.readFileSync('worker/cache-policy.json','utf8'));
assert.equal(current.publicCachingEnabled,false,'Public caching must stay disabled pending the owner launch decision');
const privateWorker=createHandler(files,{publicCaching:current.publicCachingEnabled,cacheRevision:revision});
for(const p of ['/','/app.js?v='+revision,'/assets/logo.svg','/missing']){
 const response=await privateWorker.fetch(new Request('https://goegsa.com'+p));
 assert.equal(response.headers.get('cache-control'),'private, no-store');
 assert.equal(response.headers.get('x-robots-tag'),'noindex, nofollow');
}
const future=createHandler(files,{publicCaching:true,cacheRevision:revision});
for(const [p,policy] of [['/','no-cache'],['/app.js?v='+revision,'public, max-age=31536000, immutable'],['/app.js?v=wrong','public, max-age=3600, must-revalidate'],['/assets/logo.svg','public, max-age=3600, must-revalidate'],['/missing','private, no-store']]){
 const response=await future.fetch(new Request('https://goegsa.com'+p));
 assert.equal(response.headers.get('cache-control'),policy,p);
 assert.ok(response.headers.get('content-security-policy'));
}
assert.equal((await future.fetch(new Request('https://goegsa.com/',{method:'POST'}))).headers.get('cache-control'),'private, no-store');
console.log('PASS: current private responses remain no-store; staged public cache distinguishes HTML, verified revision, mutable filenames and errors.');
