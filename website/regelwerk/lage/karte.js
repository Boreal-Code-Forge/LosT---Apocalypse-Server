/* Public map viewer. Its feed contains territory information only. */
(()=>{'use strict';
const $=id=>document.getElementById(id),NS='http://www.w3.org/2000/svg',API='https://146.19.191.108/faction-war/';
const names={sara:'S.A.R.A.',new_dawn:'New Dawn',outlaws:'Outlaws'},colours={sara:'#86cbb0',new_dawn:'#e99382',outlaws:'#dbc37c'},kinds={food:'Nahrung',medicine:'Medizin',arms:'Waffen & Munition',materials:'Baustoffe',fuel:'Kraftstoff',parts:'Fahrzeugersatzteile',clothing:'Kleidung',morale:'Moral'};
const fmt=n=>Number(n).toLocaleString('de-DE',{maximumFractionDigits:2}),stamp=n=>new Date(n*1000).toLocaleString('de-DE',{timeZone:'Europe/Berlin',dateStyle:'short',timeStyle:'short'});
const project=p=>({x:(p.x+4140)*(1024/4500)*2.8969039560730754+1027.1407278526583,y:(8400-p.y)*(1024/4500)*2.8930161166098842-6.883368119029959});
let geometry=null,status=null,rows=new Map(),states=new Map(),shapes=new Map(),view=null,selection=null,hovered=null,pointer=null,drag=null,side='',timer=null,active=false,controller=null;
const snapshot=location.protocol==='file:'&&new URLSearchParams(location.search).get('snapshot')==='1';if(snapshot)document.body.classList.add('snapshot');
const validId=id=>typeof id==='string'&&/^[a-f0-9]{16}$/.test(id),revision=v=>typeof v==='string'&&/^[a-f0-9]{64}$/.test(v),num=(v,min=0,max=9999999999)=>Number.isFinite(v)&&v>=min&&v<=max;
function validateStatus(s){
 if(!s||s.version!==1||s.complete!==true||!revision(s.geometryRevision)||!revision(s.revision)||!num(s.confirmedAt)||s.confirmedAt>Date.now()/1000+120||typeof s.online!=='boolean'||s.activitiesAvailable!==false||!Array.isArray(s.territories)||s.territories.length>10000)throw Error('Status unvollständig');
 const ids=new Set();for(const r of s.territories){if(!validId(r.id)||ids.has(r.id)||!Object.hasOwn(names,r.owner)||!num(r.cooldownUntil)||!num(r.changedAt))throw Error('Ungültiger Gebietsstand');ids.add(r.id);}return s;
}
function validateGeometry(g,s){
 if(!g||g.version!==1||g.revision!==s.geometryRevision||!Array.isArray(g.territories)||!Array.isArray(g.arenas)||g.territories.length!==s.territories.length)throw Error('Grenzen passen nicht zum Stand');
 const polygon=p=>Array.isArray(p)&&p.length>=3&&p.length<=1024&&p.every(v=>num(v.x,-30000,30000)&&num(v.y,-30000,30000));const ids=new Set();
 for(const r of g.territories){if(!validId(r.id)||ids.has(r.id)||typeof r.name!=='string'||r.name.length>400||!Object.hasOwn(kinds,r.resource)||!num(r.yield,0,1000000)||!polygon(r.points))throw Error('Ungültiges Gebiet');ids.add(r.id);}
 if(s.territories.some(r=>!ids.has(r.id))||g.arenas.some(r=>!polygon(r.points)))throw Error('Unvollständige Grenzen');return g;
}
function extent(points){const b={minX:Infinity,minY:Infinity,maxX:-Infinity,maxY:-Infinity};for(const p of points){b.minX=Math.min(b.minX,p.x);b.minY=Math.min(b.minY,p.y);b.maxX=Math.max(b.maxX,p.x);b.maxY=Math.max(b.maxY,p.y);}return b;}
function fit(points){if(!points.length)return;const b=extent(points),box=$('map-stage').getBoundingClientRect(),aspect=box.width/Math.max(1,box.height);let w=Math.max(40,b.maxX-b.minX)*1.12,h=Math.max(40,b.maxY-b.minY)*1.12;if(w/h<aspect)w=h*aspect;else h=w/aspect;view={x:(b.minX+b.maxX-w)/2,y:(b.minY+b.maxY-h)/2,w,h};applyView();}
function applyView(){if(view)$('karte').setAttribute('viewBox',`${view.x} ${view.y} ${view.w} ${view.h}`);}
function fitAll(){fit([...rows.values()].flatMap(r=>r.polygon));}
function mapPoint(event){return new DOMPoint(event.clientX,event.clientY).matrixTransform($('karte').getScreenCTM().inverse());}
function zoom(factor,event){if(!view)return;const target=event?mapPoint(event):{x:view.x+view.w/2,y:view.y+view.h/2},width=Math.max(45,Math.min(24000,view.w/factor)),ratio=width/view.w;view={x:target.x-(target.x-view.x)*ratio,y:target.y-(target.y-view.y)*ratio,w:width,h:view.h*ratio};applyView();hideHover();}
function makeGeometry(g){
 const keep=selection;rows=new Map(g.territories.map(r=>[r.id,{...r,polygon:r.points.map(project)}]));shapes=new Map();$('area-layer').replaceChildren();$('arena-layer').replaceChildren();
 for(const arena of g.arenas){const p=document.createElementNS(NS,'path');p.setAttribute('d',path(arena.points.map(project)));$('arena-layer').append(p);}
 for(const row of rows.values()){
  const p=document.createElementNS(NS,'path');p.setAttribute('d',path(row.polygon));p.setAttribute('class','territory');p.dataset.id=row.id;p.setAttribute('role','button');p.setAttribute('tabindex',snapshot?'-1':'0');$('area-layer').append(p);shapes.set(row.id,p);
 }
 selection=rows.has(keep)?keep:null;if(!view)fitAll();
}
function path(points){return points.map((p,i)=>`${i?'L':'M'}${p.x.toFixed(3)},${p.y.toFixed(3)}`).join(' ')+'Z';}
function matches(row){const s=states.get(row.id);return s&&(!side||s.owner===side)&&(!$('resource').value||row.resource===$('resource').value)&&row.name.toLocaleLowerCase('de-DE').includes($('search').value.trim().toLocaleLowerCase('de-DE'));}
function labelYield(row){return row.resource==='morale'?`+${fmt(row.yield)} % Moral`:`${fmt(row.yield)} ${kinds[row.resource]}`;}
function cooldown(s){const seconds=Math.max(0,Math.ceil((s.cooldownUntil-Date.now()/1000)));return seconds?`${Math.ceil(seconds/60)} Min. · bis ${new Date(s.cooldownUntil*1000).toLocaleTimeString('de-DE',{timeZone:'Europe/Berlin',hour:'2-digit',minute:'2-digit'})}`:'Keine Angriffspause';}
function updateList(){
 const list=document.createDocumentFragment();let count=0;
 for(const row of [...rows.values()].sort((a,b)=>a.name.localeCompare(b.name,'de'))){if(!matches(row))continue;count++;const s=states.get(row.id),button=document.createElement('button');button.className='area-item '+s.owner;button.dataset.select=row.id;button.setAttribute('aria-pressed',String(selection===row.id));const title=document.createElement('strong');title.textContent=row.name;const note=document.createElement('small'),owner=document.createElement('span'),resource=document.createElement('span');owner.textContent=names[s.owner];resource.textContent=kinds[row.resource];note.append(owner,resource);button.append(title,note);list.append(button);}
 if(!count){const p=document.createElement('p');p.className='empty';p.textContent='Keine Gebiete für diese Auswahl. Setze die Filter zurück, um alle zu sehen.';list.append(p);}
 const scroll=$('area-list').scrollTop;$('area-list').replaceChildren(list);$('area-list').scrollTop=scroll;$('result-count').textContent=count;
}
function update(){
 const counts={sara:0,new_dawn:0,outlaws:0};for(const s of states.values())counts[s.owner]++;
 for(const [id,n]of Object.entries(counts))document.querySelector(`[data-total="${id}"]`).textContent=fmt(n);
 for(const button of document.querySelectorAll('[data-side]'))button.setAttribute('aria-pressed',String(button.dataset.side===side));
 for(const row of rows.values()){const s=states.get(row.id),p=shapes.get(row.id);p.className.baseVal=`territory ${s.owner}${matches(row)?'':' dim'}${selection===row.id?' selected':''}${s.cooldownUntil>Date.now()/1000?' cooldown':''}`;p.setAttribute('aria-label',`${row.name} · ${names[s.owner]} · ${labelYield(row)}`);p.setAttribute('tabindex',matches(row)&&!snapshot?'0':'-1');}
 updateList();details();if(hovered&&pointer)showHover(hovered,pointer);freshness();$('map-message').textContent=rows.size?'':'Noch keine Kriegsgebiete eingerichtet.';
 if($('map-image').complete||$('map-image').getAttribute('href'))window.__warMapDataReady=true;
}
function details(){
 const row=rows.get(selection),s=states.get(selection);$('details').hidden=!row||!s;if(!row||!s)return;
 $('details').style.setProperty('--accent',colours[s.owner]);$('detail-owner').textContent=names[s.owner]+' · GEBIETSKONTROLLE';$('detail-name').textContent=row.name;$('detail-yield').textContent=labelYield(row);$('detail-cooldown').textContent=cooldown(s);$('detail-note').textContent=row.resource==='morale'?'Moral wirkt als Gebietsbonus. Sie wird nicht als Konvoiladung abgeholt.':'Der Ertrag gehört zum Gebiet. Wie ihr ihn abholt, erklärt euch der Faction-War-Leitfaden.';
}
function select(id,focus=false){if(!rows.has(id))return;selection=id;if(focus)fit(rows.get(id).polygon);hideHover();update();}
function hideHover(){hovered=null;pointer=null;$('tooltip').hidden=true;}
function showHover(id,event){
 const row=rows.get(id),s=states.get(id);if(!row||!s||!matches(row)||snapshot||drag)return hideHover();hovered=id;pointer=event;const tip=$('tooltip');tip.style.setProperty('--accent',colours[s.owner]);$('hover-owner').textContent=names[s.owner];$('hover-name').textContent=row.name;$('hover-yield').textContent=labelYield(row);$('hover-cooldown').textContent=s.cooldownUntil>Date.now()/1000?cooldown(s):'';
 const crest=$('hover-crest');if(crest.dataset.side!==s.owner){crest.replaceChildren();crest.dataset.side=s.owner;const img=document.createElement('img');img.src=`assets/${s.owner}.png`;img.alt='';crest.append(img);}
 tip.hidden=false;const area=$('map-stage').getBoundingClientRect(),box=tip.getBoundingClientRect();let x=event.clientX-area.left+16,y=event.clientY-area.top+16;if(x+box.width+10>area.width)x-=box.width+32;if(y+box.height+10>area.height)y-=box.height+32;tip.style.left=Math.max(8,x)+'px';tip.style.top=Math.max(8,y)+'px';
}
function freshness(failed=false){
 if(!status){$('connection').className='connection stale';$('connection').querySelector('span').textContent='Kartendaten gerade nicht erreichbar';return;}
 const old=Date.now()/1000-status.confirmedAt>180,offline=!status.online;$('connection').className='connection '+(failed||old||offline?'stale':'live');$('connection').querySelector('span').textContent=offline?'Server offline · gespeicherte Lage':old||failed?'Verbindung unterbrochen · letzter Stand':'Aktuelle Gebietslage';$('updated').textContent='Stand '+stamp(status.confirmedAt)+' · Berlin';
}
async function jsonFetch(url,max){const r=await fetch(url,{signal:controller.signal,cache:'no-cache',credentials:'omit',referrerPolicy:'no-referrer'});if(!r.ok)throw Error('Nicht erreichbar');const raw=await r.text();if(raw.length>max)throw Error('Datenbudget überschritten');return JSON.parse(raw);}
async function poll(){
 if(active||document.hidden)return;active=true;controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),12000);
 try{const s=validateStatus(await jsonFetch(API+'status.json',1048576));let g=geometry;if(!g||g.revision!==s.geometryRevision)g=validateGeometry(await jsonFetch(API+'geometry/'+s.geometryRevision+'.json',4194304),s);else validateGeometry(g,s);const changed=!status||status.revision!==s.revision;const newGeometry=!geometry||g.revision!==geometry.revision;geometry=g;status=s;states=new Map(s.territories.map(r=>[r.id,r]));if(newGeometry)makeGeometry(g);if(changed||newGeometry)update();else freshness();}
 catch(error){if(!document.hidden){freshness(true);if(!status)$('map-message').textContent='Die Karte ist gerade nicht erreichbar. Wir versuchen es gleich erneut.';}}
 finally{clearTimeout(timeout);active=false;controller=null;clearTimeout(timer);if(!document.hidden)timer=setTimeout(poll,60000);}
}
$('search').addEventListener('input',()=>{hideHover();update();});$('resource').addEventListener('change',()=>{hideHover();update();});
for(const button of document.querySelectorAll('[data-side]'))button.addEventListener('click',()=>{side=side===button.dataset.side?'':button.dataset.side;hideHover();update();});
$('clear').addEventListener('click',()=>{side='';$('resource').value='';$('search').value='';hideHover();update();});
$('area-list').addEventListener('click',e=>{const id=e.target.closest('[data-select]')?.dataset.select;if(id){select(id,true);if(innerWidth<=760){document.body.classList.remove('show-list');$('list-toggle').setAttribute('aria-expanded','false');$('karte').scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});}}});
$('close-details').addEventListener('click',()=>{selection=null;update();});$('list-toggle').addEventListener('click',()=>{$('list-toggle').setAttribute('aria-expanded',String(document.body.classList.toggle('show-list')));});
$('fit').addEventListener('click',()=>{fitAll();hideHover();});$('zoom-in').addEventListener('click',()=>zoom(1.4));$('zoom-out').addEventListener('click',()=>zoom(1/1.4));
const svg=$('karte');svg.addEventListener('wheel',e=>{e.preventDefault();zoom(e.deltaY<0?1.2:1/1.2,e);},{passive:false});
svg.addEventListener('pointerdown',e=>{if(!view)return;hideHover();drag={x:e.clientX,y:e.clientY,view:{...view},moved:false,id:e.target.closest('[data-id]')?.dataset.id};svg.setPointerCapture(e.pointerId);svg.classList.add('dragging');});
svg.addEventListener('pointermove',e=>{if(drag){const point=mapPoint(e);svg.setAttribute('viewBox',`${drag.view.x} ${drag.view.y} ${drag.view.w} ${drag.view.h}`);const original=mapPoint(e),start=mapPoint({clientX:drag.x,clientY:drag.y});drag.moved||=Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>4;view={...drag.view,x:drag.view.x-(original.x-start.x),y:drag.view.y-(original.y-start.y)};applyView();}else{const id=e.target.closest('[data-id]')?.dataset.id;if(id)showHover(id,e);else hideHover();}});
svg.addEventListener('pointerup',e=>{const old=drag;drag=null;svg.classList.remove('dragging');if(svg.hasPointerCapture(e.pointerId))svg.releasePointerCapture(e.pointerId);if(old&&!old.moved&&old.id)select(old.id);});svg.addEventListener('pointercancel',()=>{drag=null;svg.classList.remove('dragging');hideHover();});svg.addEventListener('pointerleave',()=>{if(!drag)hideHover();});
svg.addEventListener('keydown',e=>{const id=e.target.dataset.id;if((e.key==='Enter'||e.key===' ')&&id){e.preventDefault();select(id);return;}if(['+','=','-','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)&&view){e.preventDefault();if(['+','='].includes(e.key))zoom(1.25);else if(e.key==='-')zoom(.8);else{view.x+=e.key==='ArrowLeft'?-view.w*.1:e.key==='ArrowRight'?view.w*.1:0;view.y+=e.key==='ArrowUp'?-view.h*.1:e.key==='ArrowDown'?view.h*.1:0;applyView();}}});
new ResizeObserver(()=>{if(view){const b=$('map-stage').getBoundingClientRect(),width=view.h*b.width/Math.max(1,b.height);view.x+=(view.w-width)/2;view.w=width;applyView();hideHover();}}).observe($('map-stage'));
document.addEventListener('visibilitychange',()=>{clearTimeout(timer);if(document.hidden)controller?.abort();else if(!snapshot)poll();});setInterval(()=>{if(!document.hidden&&status){freshness();details();}},15000);
if(snapshot){try{const data=JSON.parse($('map-snapshot').textContent),s=validateStatus(data.status),g=validateGeometry(data.geometry,s);geometry=g;status=s;states=new Map(s.territories.map(r=>[r.id,r]));makeGeometry(g);update();}catch{$('map-message').textContent='Kein bestätigter Kartenstand verfügbar.';}}else poll();
})();
