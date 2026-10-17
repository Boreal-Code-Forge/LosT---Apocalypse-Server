import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
if(!process.argv[2])throw Error('Aufruf: node tools/preview-game-ui.mjs <offizielles-repo>');
const source=path.resolve(process.argv[2],'[lost_santos]');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2','.svg':'image/svg+xml'};
http.createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost');let body;
 if(url.pathname==='/medical/')body=`<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="/r/ls_medical/html/medical.css"><style>body{margin:0;background:#18201c}</style></head><body><script src="/r/ls_medical/html/medical.js"></script><script type="module" src="/scene.js?scene=medical"></script></body></html>`;
 if(url.pathname==='/social/')body=`<!doctype html><html><head><meta charset="utf-8"><base href="/r/ls_hud/web/apocalypse/">${['theme','hud-tools','player-dashboard','social'].map(s=>`<link rel="stylesheet" href="/r/ls_hud/web/apocalypse/${s}.css">`).join('')}<style>body{margin:0;background:#18201c}</style></head><body data-hud-style="tactical"><div id="players-overlay" class="players-overlay"></div><script type="module" src="/scene.js?scene=social"></script></body></html>`;
 if(body){res.setHeader('Content-Type','text/html; charset=utf-8');res.end(body);return;}
 let file;
 if(url.pathname==='/item-art.json'){res.setHeader('Content-Type','application/json');res.end(JSON.stringify(Object.fromEntries(fs.readdirSync(path.join(source,'ls_inventory/web/assets/items')).filter(f=>f.endsWith('.png')).map(f=>[f.slice(0,-4),f]))));return;}
 if(url.pathname==='/scene.js')file=path.join(here,'../content/ui-examples.js');
 else if(url.pathname.startsWith('/r/')){file=path.resolve(source,'.'+url.pathname.slice(2));if(!file.startsWith(source+path.sep)){res.writeHead(403);res.end();return;}}
 else {res.writeHead(404);res.end();return;}
 if(!fs.existsSync(file)){res.writeHead(404);res.end();return;}
 res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');
 let data=fs.readFileSync(file);
 if(url.pathname==='/r/ls_inventory/web/index.html'){
   data=data.toString().replace('<head>','<head><script>window.GetParentResourceName=()=>"ls_inventory";const nativeFetch=window.fetch.bind(window);window.fetch=(url,options)=>String(url).startsWith("https://ls_inventory/")?Promise.resolve(new Response(JSON.stringify({ok:true}),{headers:{"Content-Type":"application/json"}})):nativeFetch(url,options);</script>').replace('</body>',`<style>.preview-toolbar,.preview-navigation{display:none!important}.scene{display:none!important}html[data-runtime=game],html[data-runtime=game] body{background:#18201c!important}</style><script type="module" src="/scene.js?scene=${encodeURIComponent(url.searchParams.get('scene')||'inventory')}"></script></body>`);
 }
 if(file.endsWith('medical.js'))data=data.toString().replace('https://cfx-nui-ls_inventory/web/assets/items/','/r/ls_inventory/web/assets/items/');
 res.end(data);
}).listen(8771,'127.0.0.1',()=>console.log('http://127.0.0.1:8771/r/ls_inventory/web/index.html?scene=inventory'));
