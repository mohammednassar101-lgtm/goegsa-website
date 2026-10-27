import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const source=fs.readFileSync('dist/simple-trial.js','utf8'),config=JSON.parse(fs.readFileSync('config/site.json','utf8'));
for(const lang of ['ar','en'])for(const channel of ['email','whatsapp']){
 let valid=false,opened='';const events={};const status={replaceChildren(){},prepend(){}};const download={hidden:true};const form={reportValidity:()=>valid,addEventListener(n,fn){events[n]=fn;}};const dialog={setAttribute(){},querySelector(s){return s==='form'?form:s==='.lead-status'?status:s==='.trial-download'?download:{};}};const values={name:'Test & <name>',organization:'QA School',email:'test@example.com',phone:'+966500000000',channel,marketing:'on'};
 const document={documentElement:{lang},body:{append(){}},addEventListener(){},createElement(type){return type==='dialog'?dialog:{click(){opened=this.href;}};}};
 vm.runInNewContext(source,{document,SITE_CONFIG:config,FormData:class{get(key){return values[key]||null;}}});
 events.submit({preventDefault(){},currentTarget:form});assert.equal(download.hidden,true);assert.equal(opened,'');
 valid=true;events.submit({preventDefault(){},currentTarget:form});assert.equal(download.hidden,false);assert.equal(download.href,config.products.school.trial.downloadUrl);const target=new URL(opened);assert.equal(channel==='email'?target.protocol:target.hostname,channel==='email'?'mailto:':'wa.me');if(channel==='email')assert.equal(target.pathname,'goegsa.business@gmail.com');else assert.equal(target.pathname,'/'+config.whatsapp.number);const message=target.searchParams.get(channel==='email'?'body':'text');assert(message.includes(values.name));assert(message.includes(values.phone));assert(message.includes(lang==='en'?'Yes':'نعم'));
}
console.log('PASS: both languages/channels, correct recipient and encoding, missing details keep download locked, valid form unlocks download; no network or storage.');
