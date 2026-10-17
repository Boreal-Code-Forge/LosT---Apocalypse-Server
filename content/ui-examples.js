const scene=new URL(import.meta.url).searchParams.get('scene');
const send=data=>window.postMessage(data,location.origin);
const med={self:true,name:'Mara Winter',level:4,diagnosis:4,health:72,blood:81,pain:24,infection:3,station:1,realStation:1,field:false,canRest:true,needs:'fed',regions:{head:{},torso:{dmg:15},larm:{bleed:1,dmg:28,dirty:true},rarm:{},lleg:{fracture:2,dmg:12},rleg:{}},items:{bandage:4,sterile_gauze:2,disinfectant:1,medkit:1,antibiotics:1,zombie_serum:0}};
if(scene==='medical'){
 await new Promise(r=>setTimeout(r,500));send({action:'medicalOpen',view:med,style:'tactical'});
}else if(scene==='social'){
 const {createSocial}=await import('/r/ls_hud/web/apocalypse/social.js');
 const names=['Mara Winter','Jonas Keller','Lena Brandt','Tom Berger'];
 const players=names.map((name,i)=>({id:i+1,ref:String(i+1).padStart(24,'0'),name,online:true,faction:i===2?'new_dawn':i===3?'neutral':'sara',tag:i===3?'':'GLUT'}));
 const fixture={ok:true,self:players[0],stats:{seconds:25200,session:3900,zombies:83},players,friends:players.slice(1),invitations:[],group:{leader:true,members:players.slice(0,3)},clan:{name:'Abendglut',tag:'GLUT',leader:true,canInvite:true,members:players.slice(0,3)},clans:[{name:'Abendglut',tag:'GLUT'}],camps:[],preferences:{muted:{},blocked:{}},feed:[]};
 const social=createSocial({root:document.getElementById('players-overlay'),back:()=>{},getPager:()=>({enabled:false,channels:{}}),setPager:()=>{},request:async r=>r.action==='open'?fixture:r.action==='history'?{ok:true,messages:[{id:1,sender:{name:'Jonas Keller'},time:1792237200,text:'Bin am Camp. Wer kommt mit auf Vorratssuche?'}]}:{ok:true}});social.open();
}else{
 const {initialState,itemTypes,garments}=await import('/r/ls_inventory/web/model.js?v=0520');
 const {previewJournal}=await import('/r/ls_inventory/web/journal-view.js?v=0520');
 const catalog=await fetch('/r/ls_inventory/shared/catalog.json').then(r=>r.json());
 const images=await fetch('/item-art.json').then(r=>r.json());
 const definitions=await fetch('/r/ls_inventory/shared/journal-quests.json').then(r=>r.json());
 const state=initialState();state.revision=1;state.quickSlots={'1':'item-10','4':'item-5','5':'item-1','6':'item-0'};
 state.items=state.items.map(i=>({...i,count:1,meta:{condition:i.type==='medkit'?84:94}}));
 // Existing preview layout, with the real catalog's own item artwork.
 const additions={};for(const type of [...new Set(state.items.map(i=>i.type)),...Object.values(state.equipped),'raw_meat','cloth','cooked_meat','vehicle_toolkit','vehicle_gearbox_pkw','scrap','dirty_water']){
  const d=itemTypes[type]||garments[type]||catalog[type];if(d){additions[type]={...d,image:images[type]||catalog[type]?.image||d.image};if(garments[type]?.slot)additions[type].garment={...garments[type]};}
 }
 const journal=previewJournal(definitions);journal.unread=false;
 const payload={ok:true,state,catalogAdditions:additions,journal,recipes:{},crafting:{maxBatch:10,access:{}},loot:null};
 if(scene==='skills'){
  const branches=[{id:'pkw',label:'PKW'},{id:'motorcycle',label:'Motorräder'},{id:'heavy',label:'Transporter / LKW'},{id:'special',label:'Spezialfahrzeuge'},{id:'upgrades',label:'Leistungs-Upgrades'}];
  const nodes=[{id:'basics',label:'Grundwissen',cost:0,tier:0,learned:true,available:true,effects:['Ausbauen, zerlegen und erforschen.']}];
  for(const b of branches)for(let tier=1;tier<=3;tier++)nodes.push({id:`${b.id}_${tier}`,label:b.id==='upgrades'?`Tier ${tier}`:['Einfache Reparaturen','Komplexe Bauteile','Motor & Chassis'][tier-1],branch:b.id,family:b.id,tier,cost:1,learned:b.id==='pkw'&&tier===1,available:tier===1||(b.id==='pkw'&&tier===2),requires:[tier===1?'basics':`${b.id}_${tier-1}`],effects:[b.id==='upgrades'?'Passende Werkstatt und Teile erforderlich.':['Räder, Türen und Klappen instand halten.','Batterie, Bremsen und weitere Baugruppen.','Motor und Chassis instand halten.'][tier-1]]});
  journal.skills={available:true,entries:[['mechanics','Mechanik',true,4],['medicine','Medizin',true,3],['crafting','Handwerk',false,0],['building','Bauen',false,0],['cooking','Kochen',false,0],['farming','Farming',false,0],['survival','Überleben',false,0],['looting','Plündern',false,0],['body','Körper',true,2],['weapon_tech','Waffentechnik',false,0],['melee','Nahkampf',true,2],['firearms','Schusswaffen',true,3],['explosives','Explosives',true,1]].map(([id,label,active,level])=>({id,label,active,level,maxLevel:15})),mechanics:{level:4,maxLevel:15,current:235,required:600,diagnosis:'Zustandsbereiche erkennen',tree:{id:'mechanics',branches,nodes,points:{available:3,spent:1}},catalog:[],rules:{}}};
 }
 additions.dirty_water={name:'Unbehandeltes Wasser',category:'Versorgung',icon:'water',image:images.dirty_water,w:1,h:2,weight:1,description:'Vor dem Trinken abkochen.',stackMax:20};
 const recipe={id:'boiled_water',label:'Wasser abkochen',category:'Kochen',discipline:'Kochen',level:1,duration:8000,available:true,maxBatch:10,tools:[],ingredients:[{type:'dirty_water',count:1}],results:[{type:'water',count:1}]};
 if(scene==='crafting'){payload.recipes={bandage:{label:'Einfacher Verband',description:'Sauberen Stoff für die Erstversorgung vorbereiten.',category:'Unterwegs',discipline:'Handwerk',duration:6000,tools:[],ingredients:[{type:'cloth',count:2}],results:[{type:'bandage',count:1}]}};state.items.push({id:'cloth-demo',type:'cloth',count:6,container:'back',x:0,y:4,meta:{condition:100}});additions.cloth=catalog.cloth;}
 const camp={baseId:'wiki-demo',objectId:'kitchen',moduleId:'cooking',level:2,personal:false,areas:[{id:'general',label:'Allgemein',selected:true}],counts:{dirty_water:5,raw_meat:4,cloth:12},production:{recipes:[recipe,{...recipe,id:'cook_meat',label:'Fleisch braten',duration:10000,ingredients:[{type:'raw_meat',count:1}],results:[{type:'cooked_meat',count:1}]}],power:{powered:true}},workshop:{capacity:4,orders:[{id:'order-1',revision:1,label:'Euros',model:'euros',plate:'GLUT 01',done:2,total:5,selected:true,canSelect:true}],garage:{capacity:4,vehicles:[{id:'v1',model:'euros',label:'Euros',plate:'GLUT 01',stored:true,revision:1},{id:'v2',model:'ratloader',label:'Ratloader',plate:'GLUT 02',stored:false,revision:1}],nearby:[],parkingReady:true,parking:{available:true},canStore:true}}};
 if(['loot','module','garage'].includes(scene)){
  if(scene==='garage'){camp.moduleId='mechanics';camp.objectId='mechanics';}
  payload.loot={id:'demo-crate',revision:1,label:scene==='loot'?'Vorratskiste':'Camp Abendglut',cols:8,rows:6,items:[{id:'loot-water',type:'water',count:2,container:'loot',x:0,y:0},{id:'loot-beans',type:'beans',count:3,container:'loot',x:2,y:0},{id:'loot-bandage',type:'bandage',count:2,container:'loot',x:4,y:0}],...(scene==='loot'?{}:{camp})};
 }
 // Open messages use the production NUI interface. No game connection or writes.
 await new Promise(r=>setTimeout(r,600));
 send({action:'hudStyle',style:'tactical'});send({action:'open',view:['skills','journal'].includes(scene)?'journal':scene==='vehicle'?'inventory':scene,payload});
 if(scene==='skills'){
  const timer=setInterval(()=>{const b=document.querySelector('[data-journal-section="skills"]');if(b){clearInterval(timer);b.click();}},100);setTimeout(()=>clearInterval(timer),3000);
 }
 if(scene==='vehicle'){
 const slot=(id,label,condition,maintenance='field')=>({id,label,condition,maintenance});
 const groups=[{id:'fahrwerk',label:'Fahrwerk',slots:['front_left','front_right','rear_left','rear_right'].flatMap((n,i)=>[slot('wheel_'+n,['Rad vorne links','Rad vorne rechts','Rad hinten links','Rad hinten rechts'][i],i===0?43:84),slot('brake_'+n,'Bremse',76),slot('shock_'+n,'Stoßdämpfer',88,'workshop')])},{id:'motorraum',label:'Motorraum',slots:[{...slot('engine','Motor',72,'workshop'),oilLevel:58,coolantLevel:81},slot('gearbox','Getriebe',82,'workshop'),{...slot('battery','Batterie',88),chargeLevel:64},{...slot('fuel_tank','Tank',94,'workshop'),fuelLevel:37}]},{id:'karosserie',label:'Karosserie',slots:[slot('door_0','Tür vorne links',91),slot('door_1','Tür vorne rechts',96),slot('hood','Motorhaube',86),slot('trunk','Heckklappe',89),slot('chassis','Chassis',92,'workshop')]}];
 send({action:'vehicleOpen',vehicle:{model:'euros',label:'Euros',images:{side:true,top:true},group:'pkw',plate:'GLUT 01',identity:{id:'wiki-euros'},diagnosis:{level:7,mode:'Genaue Diagnose'},groups,workplace:{available:true,context:{label:'Camp Abendglut · Mechanik II'}},service:{slots:{wheel_front_left:[{action:'repair',label:'Reparieren',duration:20000,available:true,requirements:[{label:'Mechaniker-Werkzeugkoffer',available:true,tool:true,status:'ready',condition:94,minimum:1,wear:1},{label:'Wagenheber',available:true,tool:true,status:'ready',condition:88,minimum:1,wear:1},{label:'Reparaturmaterial',available:true,count:2}]}]}}}});
 }
}
