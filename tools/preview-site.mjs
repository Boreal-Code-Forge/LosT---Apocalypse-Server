import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..','_site');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.gif':'image/gif'};
http.createServer((req,res)=>{
  let file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if (!file.startsWith(root+path.sep) && file!==root) {res.writeHead(403);res.end();return;}
  if (fs.existsSync(file)&&fs.statSync(file).isDirectory()) file=path.join(file,'index.html');
  if (!fs.existsSync(file)) {res.writeHead(404);res.end('Nicht gefunden');return;}
  res.setHeader('Content-Type',types[path.extname(file)]??'application/octet-stream');
  res.end(fs.readFileSync(file));
}).listen(8770,'127.0.0.1',()=>console.log('http://127.0.0.1:8770/wiki/'));
