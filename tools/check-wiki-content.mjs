import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const data=read('content/wiki.json'),lock=read('content/wiki-sources.json'),media=read('content/wiki-media.json');
// Public article routes from the first published edition; also works in shallow CI.
const oldRoutes='erste-schritte steuerung karte inventar looten crafting medizin faehigkeiten fahrzeuge mechanik fahrzeuglager camp camp-lager jagd versorgung orientierung gruppen gebiete zombies ereignisse jahreszeiten gesten radios angeln farming fraktionen berufe ueberlebensbaum temperatur'.split(' ');
const slugs=new Set(data.articles.map(a=>a.slug));
const removed=oldRoutes.filter(slug=>!slugs.has(slug));
if(removed.length)throw Error('Bestehende Artikeladressen verloren: '+removed);
for(const a of data.articles){
  if(a.reviewedAt!==data.reviewedAt)throw Error('Abgleichdatum fehlt: '+a.slug);
  for(const s of a.sources)if(!lock.articles[a.slug]?.[s])throw Error('Unbelegte Quelle: '+a.slug+' '+s);
  if(a.status!=='planned'&&a.quick?.length!==3)throw Error('Kurzinfo fehlt: '+a.slug);
  if(a.status==='planned'&&(a.summary||a.sections?.length))throw Error('Anleitung für geplanten Inhalt: '+a.slug);
}
const used=data.articles.flatMap(a=>a.media??[]).map(a=>a.file);
if(used.some(p=>!media.images.some(a=>a.file===p)))throw Error('Medienquelle fehlt');
if(media.images.some(a=>!used.includes(a.file)))throw Error('Veraltetes UI-Medium wird noch ausgeliefert');
const text=data.articles.flatMap(a=>a.sections??[]).map(s=>JSON.stringify(s)).join(' ');
for(const wrong of ['Bauradius von 15 Metern','Montag 00:00 UTC','Fraktionen folgen später','beide sind auf zehn Mitglieder begrenzt']){
  if(text.includes(wrong))throw Error('Überholte Aussage: '+wrong);
}
for(const a of data.articles){
  const html=fs.readFileSync(path.join(root,'_site/wiki',a.slug,'index.html'),'utf8');
  if(!html.includes('assets/ingame.js?v=2'))throw Error('F4-Brücke fehlt: '+a.slug);
  if(/(?:146\.19\.191\.108|sc_inventory_state|BEGIN TRANSACTION|webhook|ssh-ed25519)/i.test(html))throw Error('Interner Inhalt in Seite: '+a.slug);
  if(!html.includes('assets/banners/wiki.png'))throw Error('Discord-Wikibanner fehlt: '+a.slug);
}
console.log(`${data.articles.length} Artikel: alte Adressen, Quellen, Kurzinfos, Medien, F4 und öffentliche Inhaltsgrenzen geprüft.`);
