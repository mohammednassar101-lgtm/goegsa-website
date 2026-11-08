import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const source=fs.readFileSync('dist/simple-trial.js','utf8'),config=JSON.parse(fs.readFileSync('config/site.json','utf8'));
assert.match(source,/name="marketing" type="checkbox" required/);assert(!source.includes('(optional)'));assert(!source.includes('(اختياري)'));
for(const lang of ['ar','en'])for(const channel of ['email','whatsapp']){
 const events={},clicks=[],status={replaceChildren(){},prepend(){}},submit={disabled:true};
 const values={name:'Test & <name>',organization:'QA School',email:'test@example.com',phone:'+966500000000',channel,marketing:'on'};
 const inputs=Object.fromEntries(['name','organization','email','phone'].map(name=>[name,{get value(){return values[name];},custom:'',setCustomValidity(message){this.custom=message;}}]));
 const download={hidden:true,setAttribute(){},click(){clicks.push({type:'download',href:this.href,target:this.target});}};
 const form={querySelector(s){const name=s.match(/name="([^"]+)"/)[1];return inputs[name];},reportValidity(){return this.checkValidity();},checkValidity(){return Object.values(inputs).every(x=>!x.custom)&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)&&values.marketing==='on';},addEventListener(n,fn){events[n]=fn;}};
 const dialog={setAttribute(){},querySelector(s){return s==='form'?form:s==='.lead-submit'?submit:s==='.lead-status'?status:s==='.trial-download'?download:s==='.trial-fields'?{prepend(){}}:{};}};
 const document={documentElement:{lang},body:{append(){}},addEventListener(){},createElement(type){return type==='dialog'?dialog:{append(){},click(){clicks.push({type:'message',href:this.href});}};}};
 vm.runInNewContext(source,{document,SITE_CONFIG:structuredClone(config),FormData:class{get(key){return values[key]||null;}}});
 assert.equal(submit.disabled,false);
 for(const [name,bad] of [['name',' '],['organization',''],['email','wrong'],['phone','12345678'],['phone','+...........'],['phone','+966123456789012345678'],['marketing','']]){
  const prior=values[name];values[name]=bad;events.input();assert.equal(submit.disabled,true,name+' must disable submit');events.submit({preventDefault(){}});assert.equal(clicks.length,0);assert.equal(download.hidden,true);values[name]=prior;events.change();assert.equal(submit.disabled,false);
 }
 values.phone='0020 105 009 6068';events.input();assert.equal(submit.disabled,false);
 events.submit({preventDefault(){}});assert.equal(download.hidden,false);assert.equal(clicks.length,2);assert.equal(clicks[0].type,'download');assert.equal(clicks[0].target,'_self');assert.equal(clicks[0].href,config.products.school.trial.downloadUrl);assert.equal(clicks[1].type,'message');
 const target=new URL(clicks[1].href);assert.equal(channel==='email'?target.protocol:target.hostname,channel==='email'?'mailto:':'wa.me');if(channel==='email')assert.equal(target.pathname,config.contacts.sales);else assert.equal(target.pathname,'/'+config.whatsapp.number);
 const message=target.searchParams.get(channel==='email'?'body':'text');assert(message.includes(values.name));assert(message.includes(values.phone));assert(message.includes(lang==='en'?'Yes':'نعم'));assert(message.includes('\n'));
}
console.log('PASS: required details/marketing, email and international phone validation, both languages/channels, download requested before message handoff, encoded recipient and retry link. No network or messages sent.');
