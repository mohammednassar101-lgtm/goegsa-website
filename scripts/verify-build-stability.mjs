// Run after committing intended changes: a clean Git index is the reference.
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const tracked=execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0').filter(Boolean);
assert(!tracked.includes('dist/server/index.js'),'Generated Worker must not be tracked');
const generated=['dist/server/index.js','dist/.openai/hosting.json'];
const hash=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
function build(){execFileSync(process.execPath,['scripts/build.mjs'],{stdio:'inherit'});}
build();
const first=new Map(generated.map(f=>[f,hash(f)]));
build();
for(const [f,sha] of first)assert.equal(hash(f),sha,'Repeated build changed '+f);
// git diff ignores neither tracked output changes nor line-ending normalized content.
const diff=execFileSync('git',['diff','--name-only','HEAD','--',...tracked],{encoding:'utf8'}).trim();
assert.equal(diff,'','Build changed tracked files:\n'+diff);
// An exported LF checkout reproduces a clone on other operating systems.
const files=tracked.filter(f=>/\.(?:js|mjs|css|json|html|md|txt|svg)$/.test(f));
for(const f of files)assert(!fs.readFileSync(f,'utf8').includes('\r'),'Non-canonical line ending: '+f);
console.log('PASS: two builds are byte-stable and leave all tracked files unchanged; generated Worker is excluded from Git.');
