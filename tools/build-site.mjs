import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'content/wiki.json'), 'utf8'));
const out = path.join(root, '_site');
// Copy without deletion so only this site's generated files are touched.
fs.mkdirSync(out, { recursive: true });
fs.cpSync(path.join(root, 'website/regelwerk'), out, { recursive: true });
const wiki = path.join(out, 'wiki');
fs.mkdirSync(wiki, { recursive: true });
fs.cpSync(path.join(root, 'website/wiki-assets'), path.join(wiki, 'assets'), { recursive: true });
const base = 'https://boreal-code-forge.github.io/LosT---Apocalypse-Server/';
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const active = data.articles.filter(a => a.status !== 'planned');
const planned = data.articles.filter(a => a.status === 'planned');
const categories = [...new Set(data.articles.map(a => a.category))];
const ids = new Set();
for (const a of data.articles) {
  if (!/^[a-z0-9-]+$/.test(a.slug) || ids.has(a.slug)) throw Error('Invalid or duplicate slug: ' + a.slug);
  ids.add(a.slug);
  if (!a.sources?.length) throw Error('Missing sources: ' + a.slug);
  if (a.status === 'planned' && (a.sections?.length || a.summary)) throw Error('Planned article must be empty: ' + a.slug);
  if (a.status !== 'planned' && !a.sections?.length) throw Error('Empty article: ' + a.slug);
}
for (const a of data.articles) for (const s of a.related ?? []) if (!ids.has(s)) throw Error('Missing related article: '+s);
const date = new Intl.DateTimeFormat('de-DE',{dateStyle:'long',timeZone:'Europe/Berlin'}).format(new Date(data.reviewedAt+'T12:00:00Z'));
function renderSection(s, i) {
  let body = s.text ? `<p>${esc(s.text)}</p>` : '';
  if (s.steps) body += `<ol>${s.steps.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>`;
  if (s.list) body += `<ul>${s.list.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;
  if (s.table) body += `<div class="table-wrap" tabindex="0" role="region" aria-label="${esc(s.title)}"><table><thead><tr>${s.table.headers.map(x=>`<th scope="col">${esc(x)}</th>`).join('')}</tr></thead><tbody>${s.table.rows.map(r=>`<tr>${r.map(x=>`<td>${esc(x)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  return `<section class="article-section" id="abschnitt-${i+1}"><h2>${esc(s.title)}</h2>${body}</section>`;
}
function renderMedia(article, prefix) {
  if (!article.media?.length) return '';
  return `<section class="ui-gallery" aria-label="Original-Spieloberflächen"><div class="media-heading"><h2>So sieht’s aus</h2><span>Original-UI · Beispieldaten</span></div>${article.media.map(m=>`<figure><a class="ui-image-link" href="${prefix}assets/${esc(m.file)}" target="_blank" rel="noopener" data-ui-image data-caption="${esc(m.title)}"><img src="${prefix}assets/${esc(m.file)}" alt="${esc(m.alt)}" width="1920" height="1080" loading="lazy"><span class="image-zoom">Groß ansehen ↗</span></a><figcaption><strong>${esc(m.title)}</strong><p>${esc(m.caption)}</p></figcaption></figure>`).join('')}<p class="media-note">Die originalen HTML-Oberflächen mit erfundenen Beispielwerten. Dein gewählter HUD-Stil und deine Ausrüstung können die Ansicht verändern.</p></section>`;
}
function renderMap(prefix) {
  return `<section class="atlas" aria-label="Karte in Originalauflösung"><div class="atlas-toolbar"><span>FELDATLAS · 8.192 × 9.216</span><div><button type="button" data-map-action="out" aria-label="Karte verkleinern">−</button><output id="map-scale" aria-live="polite">Übersicht</output><button type="button" data-map-action="in" aria-label="Karte vergrößern">+</button><button type="button" data-map-action="reset">Einpassen</button><button type="button" data-map-action="full">8K laden</button></div></div><div class="atlas-viewport" id="atlas-viewport" tabindex="0" role="region" aria-label="Verschiebbare Karte; Pfeiltasten oder Scrollen zum Navigieren"><img id="atlas-image" src="${prefix}assets/maps/atlas-preview.jpg" data-full="${prefix}assets/maps/lost-santos-atlas-8k.png" alt="Vollständiger Lost-Santos-Feldatlas mit Straßen, Landschaft und eingezeichneten Gebieten" draggable="false"></div><div class="atlas-footer"><p id="map-status" role="status">Schnelle Vorschau. Die volle Auflösung wird erst beim Vergrößern geladen.</p><a href="${prefix}assets/maps/lost-santos-atlas-8k.png" target="_blank" rel="noopener">8K-Original öffnen · 54 MB ↗</a></div></section>`;
}
function renderPage(article) {
  const prefix = article ? '../' : '';
  const rulePrefix = article ? '../../' : '../';
  const title = article ? article.title : 'Das Wissen fürs Überleben';
  const description = article?.status === 'planned' ? 'Bald verfügbar.' : article?.summary ?? 'Das Spieler-Wiki für Lost Santos Apocalypse. Einstieg, Ausrüstung, Campbau, Fahrzeuge und die Welt entdecken.';
  const nav = categories.map(c=>`<div class="nav-group"><p>${esc(c)}</p>${data.articles.filter(a=>a.category===c).map(a=>`<a href="${prefix}${a.slug}/"${article?.slug===a.slug?' aria-current="page"':''}><span>${esc(a.title)}</span>${a.status==='planned'?'<span class="nav-soon">Bald</span>':''}</a>`).join('')}</div>`).join('');
  let body;
  if (!article) {
    body = `<div class="wiki-banner"><img src="${rulePrefix}assets/banners/wiki.png" width="2120" height="742" alt="Lost Santos – Wiki" fetchpriority="high"></div><section class="welcome"><p class="eyebrow">DAS FELDHANDBUCH / LOST SANTOS</p><h1>Eine veränderte Welt.<br><em>Finde deinen Weg.</em></h1><p>Von den ersten Vorräten bis zur eigenen Werkstatt: Hier findest du die wichtigsten Handgriffe fürs Leben nach der Katastrophe.</p><div class="welcome-links"><a class="primary" href="erste-schritte/">Hier anfangen <span aria-hidden="true">↗</span></a><a href="steuerung/">Tasten nachschlagen →</a></div><span class="index-mark" aria-hidden="true">LS<br><small>FELDHANDBUCH</small></span></section>
    <a class="atlas-teaser" href="karte/"><img src="assets/maps/atlas-preview.jpg" alt="Ausschnitt des Feldatlas" width="220" height="180" loading="lazy"><div><p class="eyebrow">LOS SANTOS AUF EINEN BLICK</p><h2>Der Feldatlas in voller 8K-Auflösung.</h2><span>Öffnen, vergrößern und deinen nächsten Weg finden ↗</span></div></a>
    <div class="index-heading"><div><p class="eyebrow">NACHSCHLAGEN STATT RÄTSELN</p><h2>Was hast du vor?</h2></div><span>${active.length} Anleitungen</span></div>
    <div class="filters" aria-label="Themen filtern"><button type="button" data-filter="all" aria-pressed="true">Alle Themen</button>${categories.filter(c=>c!=='Bald verfügbar').map(c=>`<button type="button" data-filter="${esc(c)}" aria-pressed="false">${esc(c)}</button>`).join('')}</div>
    <div class="cards">${active.map((a,i)=>`<a class="card" data-card data-category="${esc(a.category)}" href="${a.slug}/"><span class="card-top"><span>${esc(a.category)}</span><span>${String(i+1).padStart(2,'0')}</span></span><h3>${esc(a.title)}</h3><p>${esc(a.summary)}</p><span class="card-arrow" aria-hidden="true">↗</span></a>`).join('')}</div>
    <p id="filter-empty" hidden>Für diesen Filter gibt es keine Themen.</p>
    <section class="coming"><div><p class="eyebrow">AM HORIZONT</p><h2>Bald verfügbar</h2></div><div class="coming-list">${planned.map(a=>`<a href="${a.slug}/"><span>${esc(a.title)}</span><span class="badge">Bald verfügbar</span></a>`).join('')}</div></section>`;
  } else if (article.status === 'planned') {
    body = `<div class="breadcrumbs"><a href="../">Wiki</a><span>/</span><span>${esc(article.title)}</span></div><section class="planned"><p class="eyebrow">AM HORIZONT</p><h1>${esc(article.title)}</h1><span class="badge">Bald verfügbar</span><a class="back-link" href="../">← Zur Themenübersicht</a></section>`;
  } else {
    body = `<div class="breadcrumbs"><a href="../">Wiki</a><span>/</span><span>${esc(article.category)}</span></div><div class="article-layout${article.map?' atlas-layout':''}"><article><header class="article-header"><p class="eyebrow">${esc(article.category)}</p><h1>${esc(article.title)}</h1><p class="lead">${esc(article.summary)}</p></header>${article.map?renderMap(prefix):''}${renderMedia(article,prefix)}${article.sections.map(renderSection).join('')}<div class="article-end"><span>Stand: ${date}</span><button type="button" id="copy-link">Artikellink kopieren</button><span id="copy-status" role="status"></span></div>${article.related?.length?`<section class="related"><p class="eyebrow">DAS PASST DAZU</p>${article.related.map(slug=>{const a=data.articles.find(a=>a.slug===slug);return `<a href="../${slug}/">${esc(a.title)} <span aria-hidden="true">↗</span></a>`}).join('')}</section>`:''}</article><aside class="toc" aria-label="In diesem Artikel"><p>AUF DIESER SEITE</p>${article.sections.map((s,i)=>`<a href="#abschnitt-${i+1}">${esc(s.title)}</a>`).join('')}</aside></div>`;
  }
  const search = data.articles.map(a=>({title:a.title,url:prefix+a.slug+'/',category:a.category,planned:a.status==='planned',text:[a.title,a.summary, ...(a.sections??[]).map(s=>JSON.stringify(s))].join(' ')}));
  const component = {component:{type:17,accent_color:13096090,components:[{type:12,items:[{media:{url:base+'assets/banners/wiki.png'},description:'Lost Santos Apocalypse'}]},{type:10,content:`## Lost Santos · ${article?article.title:'Spieler-Wiki'}\n${article?.status==='planned'?'Bald verfügbar':description}`},{type:1,components:[{type:2,style:5,label:article?'Artikel öffnen':'Wiki entdecken',url:base+'wiki/'+(article?article.slug+'/':'')},{type:2,style:5,label:'Regelwerk',url:base+'regelwerk.html'}]}]}};
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#151c18"><title>${esc(article?article.title:'Spieler-Wiki')} · Lost Santos</title><meta name="description" content="${esc(description)}"><meta property="og:title" content="Lost Santos · ${esc(article?article.title:'Spieler-Wiki')}"><meta property="og:description" content="${esc(description)}"><meta property="og:type" content="website"><meta property="og:image" content="${base}assets/banners/wiki.png"><meta property="og:url" content="${base}wiki/${article?article.slug+'/':''}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${base}assets/banners/wiki.png"><link rel="icon" href="${rulePrefix}assets/logo.png"><link rel="stylesheet" href="${prefix}assets/wiki.css?v=3"><script defer src="${prefix}assets/wiki.js?v=2"></script><script id="wiki-search-data" type="application/json">${JSON.stringify(search).replace(/</g,'\\u003c')}</script><script id="discord:component-embed" type="application/json">${JSON.stringify(component).replace(/</g,'\\u003c')}</script></head><body><a class="skip" href="#inhalt">Zum Inhalt</a><header class="site-header"><a class="brand" href="${prefix||'./'}"><img src="${rulePrefix}assets/logo.png" alt="" width="48" height="48"><span>LOST SANTOS<small>SPIELER-WIKI</small></span></a><nav aria-label="Website"><a href="${prefix||'./'}" aria-current="${article?'false':'page'}">Wiki</a><a href="${rulePrefix}regelwerk.html">Regelwerk ↗</a></nav><span class="header-label">WISSEN FÜR UNTERWEGS</span></header><div class="shell"><aside class="sidebar"><div class="search-box"><label for="wiki-search">WAS SUCHST DU?</label><div><input id="wiki-search" type="search" placeholder="z. B. Wasser, Reparatur …" autocomplete="off" aria-controls="search-results"><button id="clear-search" type="button" aria-label="Suche leeren">×</button></div></div><button id="menu-toggle" type="button" aria-expanded="false" aria-controls="wiki-nav">Themenübersicht <span aria-hidden="true">⌄</span></button><nav id="wiki-nav" aria-label="Wiki-Themen">${nav}</nav><p class="sidebar-note">${date}<br>Lost Santos · Apocalypse</p></aside><main id="inhalt"><section id="search-results" hidden aria-label="Suchergebnisse"><h1>Suche im Wiki</h1><p id="search-status" role="status" aria-live="polite"></p><div id="search-list"></div></section><div id="page-content">${body}</div><footer class="wiki-footer"><span>LOST SANTOS · FELDHANDBUCH</span><p>Das Projekt entwickelt sich weiter. Beachte auch die aktuellen Hinweise im Spiel.</p><a href="${rulePrefix}regelwerk.html">Zum Regelwerk ↗</a></footer></main></div></body></html>`;
}
fs.writeFileSync(path.join(wiki,'index.html'),renderPage(null));
for (const a of data.articles) {
  fs.mkdirSync(path.join(wiki,a.slug),{recursive:true});
  fs.writeFileSync(path.join(wiki,a.slug,'index.html'),renderPage(a));
}
console.log(`Website gebaut: ${active.length} Wiki-Artikel, ${planned.length} Platzhalter und bestehendes Regelwerk.`);
