import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const repo = args.find(a => !a.startsWith('--'));
if (!repo) throw Error('Aufruf: node tools/wiki-sources.mjs <offizielles-repo> [--record]');
const git = (...args) => execFileSync('git', ['-C',path.resolve(repo),...args],{encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
const data = JSON.parse(fs.readFileSync(path.join(root,'content/wiki.json'),'utf8'));
const lockPath = path.join(root,'content/wiki-sources.json');
const current = {repository:'https://github.com/MaxSmoke87/-LosT-.git',commit:git('rev-parse','HEAD'),reviewedAt:data.reviewedAt,articles:{}};
for (const a of data.articles) {
  current.articles[a.slug] = {};
  for (const p of a.sources) {
    try { current.articles[a.slug][p] = git('rev-parse','--verify',`HEAD:${p}`); }
    catch { throw Error('Quelldatei nicht im offiziellen Git-Stand: '+p); }
  }
}
if (args.includes('--record')) {
  fs.writeFileSync(lockPath,JSON.stringify(current,null,2)+'\n');
  console.log(`Quellenstand für ${data.articles.length} Artikel dokumentiert: ${current.commit}`);
} else {
  const old = JSON.parse(fs.readFileSync(lockPath,'utf8'));
  let changed = 0;
  for (const [slug,paths] of Object.entries(current.articles)) {
    const delta = Object.entries(paths).filter(([p,blob])=>old.articles[slug]?.[p]!==blob);
    const removed = Object.keys(old.articles[slug]??{}).filter(p=>!(p in paths));
    if (delta.length || removed.length) { changed++; console.log(`${slug}: prüfen\n${[...delta.map(([p])=>'  '+p),...removed.map(p=>'  Quelle entfernt: '+p)].join('\n')}`); }
  }
  console.log(changed ? `${changed} Themen benötigen redaktionelle Prüfung. Keine Texte automatisch geändert.` : 'Alle zugeordneten Quelldateien sind seit der Prüfung unverändert.');
  process.exitCode = changed ? 2 : 0;
}
