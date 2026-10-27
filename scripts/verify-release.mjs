import fs from 'node:fs';import assert from 'node:assert/strict';import {render} from './build.mjs';
const c=JSON.parse(fs.readFileSync('config/site.json','utf8')).products.school.trial;
assert.match(c.sha256,/^[a-f0-9]{64}$/);assert(c.downloadUrl.includes('/download/'+c.version+'/'));assert(c.releaseNotesUrl.endsWith('/tag/'+c.version));
for(const lang of ['ar','en']){const a=render(lang,'products/school-management/','https://one.example').html,b=render(lang,'products/school-management/','https://two.example').html;assert.equal(a,b);assert(a.includes(c.sha256));assert(a.includes('id="download-integrity"'));assert(a.includes(c.version));assert(!a.includes('clearearth128.chatgpt.site'));assert(!a.includes('تشغيل على أي حال'));}
const roots=[...fs.readFileSync('dist/design-system.css','utf8').matchAll(/:root\{/g)];assert.equal(roots.length,1);
const template=fs.readFileSync('scripts/build.mjs','utf8');assert(template.includes("'simple-trial.js','simple-trial.css'"));
console.log('PASS: version-pinned download/checksum, both languages, host-independent output, one color token source and cache revision includes trial assets.');

const english=render('en','products/school-management/').html;const arabic=render('ar','products/school-management/').html;
assert(english.includes('href="/assets/SchoolSystem-README.en.md"'));assert(arabic.includes('href="/assets/SchoolSystem-README.md"'));assert(english.includes('class="installation-content" lang="en" dir="ltr"'));assert(english.includes('9) Help'));assert(!english.includes('guide below is in Arabic'));assert(!english.includes('Arabic README'));assert(fs.readFileSync('dist/assets/SchoolSystem-README.en.md','utf8').includes('Get-FileHash'));
console.log('PASS: complete English guide, language-specific README downloads and text direction.');
