// Preserve every existing static asset byte while adding response headers in Workers.
import fs from 'node:fs';
import path from 'node:path';
import {gzipSync} from 'node:zlib';
const root = path.resolve('dist');
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.txt':'text/plain; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.ico':'image/x-icon','.woff':'font/woff','.woff2':'font/woff2','.xml':'application/xml; charset=utf-8'};
const entries = {};
function walk(dir) {
  for (const item of fs.readdirSync(dir, {withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))) {
    if (['server','.openai'].includes(item.name)) continue;
    const file = path.join(dir,item.name);
    if(item.isDirectory()) walk(file);
    else if (item.name !== '_headers') {
      const key = '/' + path.relative(root,file).split(path.sep).join('/');
      entries[key] = {type:types[path.extname(file)] || 'application/octet-stream',data:fs.readFileSync(file).toString('base64')};
    }
  }
}
walk(root);
const handler = fs.readFileSync('worker/handler.mjs','utf8');
const output = handler + '\nexport default createHandler('+JSON.stringify(entries)+');\n';
if(gzipSync(output).length > 3*1024*1024) throw new Error('Worker exceeds conservative compressed size budget');
fs.mkdirSync(path.join(root,'server'),{recursive:true});
fs.writeFileSync(path.join(root,'server/index.js'),output);
fs.mkdirSync(path.join(root,'.openai'),{recursive:true});
fs.copyFileSync('.openai/hosting.json',path.join(root,'.openai/hosting.json'));
console.log(`Worker built: ${Object.keys(entries).length} files; ${gzipSync(output).length} bytes compressed.`);
