import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {render,pages} from './build.mjs';
const code=fs.readFileSync('dist/site-config.js','utf8')+'\n'+fs.readFileSync('dist/app.js','utf8');
let checked=0;
for(const lang of ['ar','en'])for(const [route] of pages){
 const original=render(lang,route);
 assert(original.html.includes('<main'),'Empty-root rendering still builds the page');
 const existingRoot={firstElementChild:{tagName:'DIV'}};
 Object.defineProperty(existingRoot,'innerHTML',{set(){throw new Error('Existing server-rendered markup was replaced');}});
 const context={...original.context,document:{...original.context.document,getElementById(){return existingRoot;}}};
 vm.createContext(context);vm.runInContext(code,context);
 assert.equal(typeof context.buildMailto,'function','Interactive helpers remain initialized');checked++;
}
console.log('PASS: '+checked+' routes preserve existing markup; empty-root build and interaction initialization remain available.');
