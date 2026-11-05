"""Existing Pages workflow and public readback. Never print credentials."""
from pathlib import Path
import json,sys,subprocess,urllib.request,datetime,hashlib,concurrent.futures
R=Path(__file__).resolve().parents[1];D=R/'docs/wiki-skills-20261105'
REPO='Boreal-Code-Forge/LosT---Apocalypse-Server';BASE='https://boreal-code-forge.github.io/LosT---Apocalypse-Server/'
def save(n,v):(D/n).write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def git(*a):return subprocess.check_output(['git',*a],cwd=R,text=True).strip()
def api(route,data=None):
 result=subprocess.run(['git','credential','fill'],input='protocol=https\nhost=github.com\n\n',cwd=R,capture_output=True,text=True,check=True)
 fields=dict(line.split('=',1)for line in result.stdout.splitlines()if '='in line);secret=fields.get('password');assert secret,'Keine gespeicherte GitHub-Anmeldung'
 req=urllib.request.Request('https://api.github.com/repos/'+REPO+route,headers={'Accept':'application/vnd.github+json','Authorization':'Bearer '+secret,'X-GitHub-Api-Version':'2022-11-28','User-Agent':'LostSantos-Wiki-Publication'},data=None if data is None else json.dumps(data).encode())
 with urllib.request.urlopen(req,timeout=25)as r:raw=r.read();return json.loads(raw)if raw else None
mode=sys.argv[1];commit=git('rev-parse','HEAD')
if mode=='dispatch':
 assert git('rev-parse','origin/main')==commit,'Erst veröffentlichen'
 api('/actions/workflows/regelwerk-pages.yml/dispatches',{'ref':'main'})
 save('publication-request.json',{'commit':commit,'requestedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'workflow':'regelwerk-pages.yml','publicMessages':False})
 print(json.dumps({'requested':True,'commit':commit}))
elif mode=='status':
 request=json.loads((D/'publication-request.json').read_bytes());runs=api('/actions/workflows/regelwerk-pages.yml/runs?per_page=10')['workflow_runs']
 matches=[r for r in runs if r['head_sha']==request['commit']and r['event']=='workflow_dispatch'];assert matches,'Workflow noch nicht sichtbar'
 r=max(matches,key=lambda r:r['id']);v={k:r[k]for k in ['id','head_sha','status','conclusion','html_url']};save('publication.json',v);print(json.dumps(v))
elif mode=='verify':
 publication=json.loads((D/'publication.json').read_bytes());assert publication['status']=='completed'and publication['conclusion']=='success'
 data=json.loads((R/'content/wiki.json').read_bytes());names=['wiki/index.html']+['wiki/'+a['slug']+'/index.html'for a in data['articles']]+['wiki/assets/wiki.js','wiki/assets/wiki.css','assets/ingame.js','index.html','regelwerk.html']
 def check(name):
  expected=(R/'_site'/name).read_bytes()
  # Pages copies repository assets on Linux; the Windows checkout may use CRLF.
  # Compare copied files to the exact committed blob, not a normalized download.
  copied=('website/wiki-assets/'+name.removeprefix('wiki/assets/'))if name.startswith('wiki/assets/')else('website/regelwerk/'+name)if not name.startswith('wiki/')else None
  if copied:
   blob=subprocess.check_output(['git','cat-file','-p',publication['head_sha']+':'+copied],cwd=R)
   assert expected.replace(b'\r\n',b'\n')==blob.replace(b'\r\n',b'\n'),('Lokale Vorlage abweichend',name)
   expected=blob
  with urllib.request.urlopen(urllib.request.Request(BASE+name+'?skills='+publication['head_sha'][:12],headers={'User-Agent':'LostSantos-Wiki-Readback'}),timeout=30)as r:actual=r.read();status=r.status
  assert actual==expected,('Öffentliche Datei weicht ab',name)
  return{'path':name,'status':status,'bytes':len(actual),'sha256':hashlib.sha256(actual).hexdigest(),'fullByteEqual':True}
 with concurrent.futures.ThreadPoolExecutor(max_workers=4)as ex:rows=list(ex.map(check,names))
 result={'passed':True,'siteCommit':publication['head_sha'],'workflowRun':publication['id'],'url':BASE+'wiki/','files':rows,'gameServerControl':False,'publicMessages':False}
 save('public-verification.json',result);print(json.dumps({k:v for k,v in result.items()if k!='files'}|{'files':len(rows)}))
else:raise ValueError(mode)
