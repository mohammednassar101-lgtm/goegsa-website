import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const code=fs.readFileSync('dist/analytics.js','utf8');
function harness(saved=null,hostname='goegsa.com'){
 const scripts=[],events={},buttons={},storage=new Map(saved?[['goegsa.analytics.v1',JSON.stringify({choice:saved,time:Date.now()})]]:[]);
 const element=()=>({hidden:false,append(){},setAttribute(){},addEventListener(name,fn){this[name]=fn;},focus(){},querySelector(selector){return buttons[selector]??=(element());}});
 const document={documentElement:{lang:'ar'},referrer:'https://example.com/page?email=secret@example.com',cookie:'',head:{append(s){scripts.push(s);}},body:element(),createElement:element,querySelector(){return element();},addEventListener(name,fn){events[name]=fn;}};
 const context={document,location:{hostname,pathname:'/products/school-management/',search:'?email=secret@example.com',hash:'#phone123'},localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},URL,Date,Set,window:{addEventListener(){}}};
 vm.runInNewContext(code,context);
 return {scripts,events,buttons,context,storage,accept(){buttons['[data-analytics-accept]'].click();},reject(){buttons['[data-analytics-reject]'].click();},queue(){return (context.window.dataLayer||[]).map(v=>Array.from(v));}};
}
let h=harness();assert.equal(h.scripts.length,0);assert.equal(h.queue().length,0);h.reject();assert.equal(h.scripts.length,0);assert.equal(h.context.window['ga-disable-G-ZE9MX5P93B'],true);
h=harness();h.accept();assert.equal(h.scripts.length,1);h.accept();assert.equal(h.scripts.length,1);assert.equal(h.queue().filter(x=>x[0]==='config').length,1);assert.equal(h.queue().find(x=>x[0]==='config')[2].send_page_view,true);assert.equal(h.queue().filter(x=>x[0]==='event'&&x[1]==='page_view').length,0);
assert.ok(h.queue().every(x=>!JSON.stringify(x).includes('secret@example.com')));
const trial={matches:s=>s==='[data-simple-trial]'};
h.events.click({target:{closest:()=>trial}});assert.equal(h.queue().at(-1)[1],'trial_form_open');
const download={matches:()=>false,hidden:false,href:'https://github.com/mohammednassar101-lgtm/school-system-updates/releases/download/v1.3.30/SchoolSystemSetup.exe'};
h.events.click({target:{closest:()=>download}});assert.equal(h.queue().at(-1)[1],'file_download');
let n=h.queue().length;download.href+='?phone=secret';h.events.click({target:{closest:()=>download}});assert.equal(h.queue().length,n);
const form={matches:()=>true,checkValidity:()=>false,querySelector:()=>({value:'email'})};h.events.submit({target:form});assert.equal(h.queue().length,n);form.checkValidity=()=>true;h.events.submit({target:form});assert.equal(h.queue().at(-1)[1],'trial_request_open');assert.equal(h.queue().at(-1)[2].channel,'email');
h.reject();n=h.queue().length;h.events.click({target:{closest:()=>trial}});assert.equal(h.queue().length,n);assert.equal(h.context.window['ga-disable-G-ZE9MX5P93B'],true);
assert.equal(harness('denied').scripts.length,0);assert.equal(harness('accepted').scripts.length,1);assert.equal(harness(null,'localhost').scripts.length,0);
console.log('PASS: no analytics before consent or after rejection, single script/page view, safe URLs/events, valid forms, trusted downloads, persisted preferences and production-only tracking.');
