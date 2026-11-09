import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root='';
const source=fs.readFileSync(root+'dist/latest-release.js','utf8');
const fallback=JSON.parse(fs.readFileSync(root+'config/site.json','utf8')).products.school.trial;
const repository='mohammednassar101-lgtm/school-system-updates';
const release=(tag='v1.3.34')=>({tag_name:tag,draft:false,prerelease:false,assets:[{name:'SchoolSystemSetup.exe',browser_download_url:`https://github.com/${repository}/releases/download/${tag}/SchoolSystemSetup.exe`,digest:'sha256:'+'a'.repeat(64)}]});
const tests=[];
async function check(name,{data=release(),ok=true,error=false,jsonError=false,panelExists=true,accepted=false,lateLink=false}={}){
 const trial=structuredClone(fallback),initial=structuredClone(fallback);
 const label={textContent:fallback.version};
 const links=[{href:trial.downloadUrl},{href:trial.releaseNotesUrl},{href:'https://example.com/unrelated'}];
 let calls=0,request;
 let resolve;
 const pending=new Promise(r=>resolve=r);
 const context={SITE_CONFIG:{products:{school:{trial}}},document:{getElementById:()=>panelExists?{querySelector:()=>label}:null,querySelectorAll:()=>links},AbortSignal:{timeout:n=>({timeout:n})},fetch:async(url,options)=>{calls++;request={url,options};if(lateLink)await pending;if(error)throw Error('network');return {ok,json:async()=>{if(jsonError)throw Error('invalid JSON');return data;}};}};
 const run=vm.runInNewContext(source,context);
 if(lateLink){links.push({href:initial.downloadUrl});resolve();}
 await run;
 if(panelExists){assert.equal(calls,1);assert.equal(request.options.credentials,'omit');assert.equal(request.options.signal.timeout,5000);assert.equal(request.url,`https://api.github.com/repos/${repository}/releases/latest`);}else assert.equal(calls,0);
 if(accepted){assert.equal(trial.version,data.tag_name);assert.equal(trial.sha256,'a'.repeat(64));assert.equal(label.textContent,data.tag_name);assert.equal(links[0].href,initial.downloadUrl);assert.equal(links[1].href,`https://github.com/${repository}/releases/tag/${data.tag_name}`);if(lateLink)assert.equal(links[3].href,trial.downloadUrl);}
 else {assert.deepEqual(trial,initial);assert.equal(label.textContent,initial.version);assert.equal(links[0].href,initial.downloadUrl);assert.equal(links[1].href,initial.releaseNotesUrl);}
 assert.equal(links[2].href,'https://example.com/unrelated');
 tests.push({name,passed:true});
}
await check('new stable patch updates version, checksum and links',{accepted:true});
await check('numeric minor comparison, not lexical',{data:release('v1.10.0'),accepted:true});
await check('new major version',{data:release('v2.0.0'),accepted:true});
await check('same version retains fallback',{data:release(fallback.version)});
await check('older patch rejected',{data:release('v1.3.1')});
await check('older minor rejected',{data:release('v1.2.99')});
await check('older major rejected',{data:release('v0.99.99')});
await check('draft rejected',{data:{...release(),draft:true}});
await check('prerelease rejected',{data:{...release(),prerelease:true}});
await check('malformed tag rejected',{data:release('1.3.30')});
await check('missing tag rejected',{data:{assets:[]}});
await check('missing assets rejected',{data:{tag_name:'v1.3.31'}});
await check('missing installer rejected',{data:{...release(),assets:[]}});
for(const [name,change] of [['wrong asset name',{name:'Other.exe'}],['external download URL',{browser_download_url:'https://example.com/SchoolSystemSetup.exe'}],['incorrect SHA256',{digest:'sha256:bad'}],['missing SHA256',{digest:undefined}]]){
 const data=release();Object.assign(data.assets[0],change);await check(name+' retains fallback',{data});
}
await check('HTTP refusal or rate limit retains fallback',{ok:false});
await check('connection error or timeout retains fallback',{error:true});
await check('invalid JSON retains fallback',{jsonError:true});
await check('null release retains fallback',{data:null});
await check('non-product page does not request GitHub',{panelExists:false});
await check('download unlocked before release response also updates',{lateLink:true,accepted:true});
const result={date:'2026-11-08',testedSource:'dist/latest-release.js',fallbackVersion:fallback.version,checks:tests.length,errors:0,networkUsed:false,tests};
assert(fallback.downloadUrl.endsWith('/releases/latest/download/SchoolSystemSetup.exe'));
console.log(JSON.stringify({checks:tests.length,errors:0,fallbackVersion:fallback.version}));
