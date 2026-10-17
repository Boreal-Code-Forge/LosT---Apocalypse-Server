import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..','_site');
const files = [];
function walk(dir) { for (const d of fs.readdirSync(dir,{withFileTypes:true})) d.isDirectory()?walk(path.join(dir,d.name)):files.push(path.join(dir,d.name)); }
walk(root);
const errors = [];
for (const file of files.filter(f=>f.endsWith('.html'))) {
  const html = fs.readFileSync(file,'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  if (new Set(ids).size !== ids.length) errors.push(`${file}: doppelte IDs`);
  for (const m of html.matchAll(/(?:href|src|srcset)="([^"]+)"/g)) {
    const url = m[1].replace(/&amp;/g,'&');
    if (/^(?:https?:|data:|mailto:)/.test(url)) continue;
    const [local,fragment] = url.split('#');
    let target = local ? path.resolve(path.dirname(file),local.split('?')[0]) : file;
    if (!target.startsWith(root+path.sep) && target!==root) {errors.push('Pfad verlässt Site: '+url);continue;}
    if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target=path.join(target,'index.html');
    if (!fs.existsSync(target)) {errors.push(`${file}: Ziel fehlt ${url}`);continue;}
    if (fragment && target.endsWith('.html')) {
      const targetHtml = target===file?html:fs.readFileSync(target,'utf8');
      if (!targetHtml.includes(`id="${fragment}"`)) errors.push(`${file}: Sprungziel fehlt ${url}`);
    }
  }
  for (const m of html.matchAll(/<script[^>]*type="application\/json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try { const value=JSON.parse(m[1]); if (value.component && Buffer.byteLength(m[1])>3000) errors.push('Discord-Karte zu groß: '+file); }
    catch {errors.push('Ungültiges JSON in '+file);}
  }
}
if (errors.length) throw Error(errors.join('\n'));
console.log(`${files.filter(f=>f.endsWith('.html')).length} HTML-Seiten: lokale Links, Bilder, Sprungziele und JSON geprüft.`);
