document.documentElement.classList.add('js');
const input = document.querySelector('#wiki-search');
const results = document.querySelector('#search-results');
const content = document.querySelector('#page-content');
const list = document.querySelector('#search-list');
const status = document.querySelector('#search-status');
const data = JSON.parse(document.querySelector('#wiki-search-data').textContent);
const normalize = text => text.toLocaleLowerCase('de').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ß/g,'ss');
function search() {
  const query = normalize(input.value.trim());
  results.hidden = !query;
  content.hidden = Boolean(query);
  list.replaceChildren();
  if (!query) return;
  const words = query.split(/\s+/);
  const matches = data.filter(a => words.every(word => normalize(a.text).includes(word)));
  status.textContent = `${matches.length} ${matches.length === 1 ? 'Treffer' : 'Treffer'} für „${input.value.trim()}“`;
  if (!matches.length) status.textContent += '. Versuche einen anderen Begriff, zum Beispiel Inventar oder Werkstatt.';
  for (const a of matches) {
    const link = document.createElement('a'); link.href = a.url;
    const category = document.createElement('small'); category.textContent = a.planned ? 'Bald verfügbar' : a.category;
    const title = document.createElement('strong'); title.textContent = a.title;
    const excerpt = document.createElement('p'); excerpt.textContent = a.summary || 'Dieser Bereich ist noch in Entwicklung.';
    link.append(category, title, excerpt); list.append(link);
  }
}
input.addEventListener('input', search);
document.querySelector('#clear-search').addEventListener('click', () => { input.value=''; search(); input.focus(); });
input.addEventListener('keydown', e => { if (e.key==='Escape') {input.value='';search();} });
const toggle = document.querySelector('#menu-toggle');
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded',String(open));
  document.querySelector('#wiki-nav').classList.toggle('is-open',open);
});
for (const button of document.querySelectorAll('[data-filter]')) button.addEventListener('click', () => {
  for (const b of document.querySelectorAll('[data-filter]')) b.setAttribute('aria-pressed',String(b===button));
  let count = 0;
  for (const card of document.querySelectorAll('[data-card]')) {
    card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
    if (!card.hidden) count++;
  }
  document.querySelector('#filter-empty').hidden = count > 0;
});
document.querySelector('#copy-link')?.addEventListener('click', async () => {
  const url = new URL(location.href); url.hash=''; url.search='';
  try { await navigator.clipboard.writeText(url.href); document.querySelector('#copy-status').textContent='Link kopiert.'; }
  catch { document.querySelector('#copy-status').textContent='Kopiere den Link aus der Adresszeile.'; }
});
if (document.querySelector('[data-ui-image]')) {
  const dialog=document.createElement('dialog'); dialog.className='ui-lightbox';
  const close=document.createElement('button'); close.type='button'; close.textContent='Schließen ×';
  const title=document.createElement('p'); title.id='ui-lightbox-title';
  const image=document.createElement('img');
  const original=document.createElement('a');original.textContent='Original öffnen ↗';original.target='_blank';original.rel='noopener';
  dialog.setAttribute('aria-labelledby',title.id);dialog.append(close,original,title,image);document.body.append(dialog);
  close.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
  for(const link of document.querySelectorAll('[data-ui-image]')) link.addEventListener('click',event=>{
    event.preventDefault();image.src=link.href;original.href=link.href;image.alt=link.querySelector('img').alt;title.textContent=link.dataset.caption;dialog.showModal();
  });
}
const mapImage=document.querySelector('#atlas-image');
if(mapImage){
  const viewport=document.querySelector('#atlas-viewport'),label=document.querySelector('#map-scale'),status=document.querySelector('#map-status');
  let scale=1,full=false,loading=null,baseWidth=0;
  const measure=()=>{baseWidth=Math.min(viewport.clientWidth,viewport.clientHeight*8192/9216);};
  function loadFull(){
    if(full)return Promise.resolve();if(loading)return loading;
    status.textContent='8K-Original wird geladen … etwa 54 MB.';
    loading=new Promise((resolve,reject)=>{const original=new Image();original.onload=()=>{mapImage.src=original.src;full=true;status.textContent='8K-Original geladen. Ziehen, scrollen oder mit den Tasten vergrößern.';resolve();};original.onerror=()=>{loading=null;status.textContent='Das Original konnte nicht geladen werden. Versuche es erneut oder öffne den Originallink.';reject(new Error('Kartenbild nicht geladen'));};original.src=mapImage.dataset.full;});
    return loading;
  }
  function draw(next){
    const oldWidth=mapImage.getBoundingClientRect().width||baseWidth;
    const x=(viewport.scrollLeft+viewport.clientWidth/2)/oldWidth,y=(viewport.scrollTop+viewport.clientHeight/2)/(oldWidth*9216/8192);
    scale=Math.max(1,Math.min(8192/baseWidth,next));mapImage.style.width=`${baseWidth*scale}px`;
    label.textContent=scale===1?'Übersicht':`${Math.round(baseWidth*scale/8192*100)} %`;
    requestAnimationFrame(()=>{viewport.scrollLeft=x*baseWidth*scale-viewport.clientWidth/2;viewport.scrollTop=y*baseWidth*scale*9216/8192-viewport.clientHeight/2;});
  }
  measure();draw(1);
  for(const button of document.querySelectorAll('[data-map-action]'))button.addEventListener('click',()=>{
    const action=button.dataset.mapAction;
    if(action==='reset'){measure();draw(1);return;}
    if(action==='out'){draw(scale/1.6);return;}
    draw(action==='full'?Math.max(3,scale):scale*1.6);loadFull().catch(()=>{});
  });
  let drag;
  viewport.addEventListener('pointerdown',event=>{if(event.pointerType!=='mouse'||event.button!==0)return;drag={x:event.clientX,y:event.clientY,left:viewport.scrollLeft,top:viewport.scrollTop};viewport.setPointerCapture(event.pointerId);viewport.classList.add('dragging');});
  viewport.addEventListener('pointermove',event=>{if(!drag)return;viewport.scrollLeft=drag.left+drag.x-event.clientX;viewport.scrollTop=drag.top+drag.y-event.clientY;});
  for(const name of ['pointerup','pointercancel','lostpointercapture'])viewport.addEventListener(name,()=>{drag=null;viewport.classList.remove('dragging');});
  window.addEventListener('resize',()=>{measure();draw(scale);});
}

// Read progress and section marker; no timers or network traffic.
const progressBar=document.querySelector('.reading-progress');
let progressQueued=false;
function updateProgress(){
  progressQueued=false;
  const distance=document.documentElement.scrollHeight-innerHeight;
  progressBar.style.width=`${distance>0?Math.min(100,Math.max(0,scrollY/distance*100)):0}%`;
}
if(progressBar){
  addEventListener('scroll',()=>{if(!progressQueued){progressQueued=true;requestAnimationFrame(updateProgress);}},{passive:true});
  addEventListener('resize',updateProgress);updateProgress();
}
if('IntersectionObserver' in window && document.querySelector('.toc')){
  const links=[...document.querySelectorAll('.toc a')];
  const observer=new IntersectionObserver(entries=>{
    const current=entries.find(e=>e.isIntersecting);if(!current)return;
    for(const link of links){if(link.hash===`#${current.target.id}`)link.setAttribute('aria-current','true');else link.removeAttribute('aria-current');}
  },{rootMargin:'-5% 0px -60% 0px',threshold:0});
  document.querySelectorAll('.article-section').forEach(s=>observer.observe(s));
}
