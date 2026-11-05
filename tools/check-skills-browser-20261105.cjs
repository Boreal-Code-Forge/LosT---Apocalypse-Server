const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('C:/Users/Galen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..'),site=path.join(root,'_site'),out=path.join(root,'docs/wiki-skills-20261105');
const scope=JSON.parse(fs.readFileSync(path.join(out,'scope.json'),'utf8'));
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 try{
 const page=await browser.newPage({reducedMotion:'reduce'}),errors=[],missing=[],rows=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',async route=>{
  const u=new URL(route.request().url());if(u.hostname!=='wiki.test')return route.abort();
  let rel=decodeURIComponent(u.pathname).replace(/^\/LosT---Apocalypse-Server\//,'');
  if(rel.endsWith('/'))rel+='index.html';const p=path.resolve(site,rel);
  if(!p.startsWith(site+path.sep)||!fs.existsSync(p)||!fs.statSync(p).isFile()){missing.push(rel);return route.fulfill({status:404,body:''})}
  const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.png':'image/png','.gif':'image/gif','.jpg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2'};
  return route.fulfill({status:200,body:fs.readFileSync(p),contentType:mime[path.extname(p)]||'application/octet-stream'});
 });
 const base='http://wiki.test/LosT---Apocalypse-Server/wiki/';
 for(const width of [1440,390,320]){
  await page.setViewportSize({width,height:width===1440?1000:844});
  for(const slug of scope.articles){
   await page.goto(base+slug+'/');
   assert.equal(await page.locator('.quick-guide li').count(),3,'three quick facts '+slug);
   assert.ok(await page.locator('.article-section').count()===2,'two initial sections '+slug);
   assert.equal(await page.locator('.article-detail[open]').count(),0,'details start closed '+slug);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'page overflow '+slug+'/'+width);
   const first=page.locator('.article-detail').first();await first.locator('summary').click();assert.equal(await first.getAttribute('open'),'');
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'expanded overflow '+slug+'/'+width);
   const images=await page.locator('img[src]').evaluateAll(es=>es.filter(e=>e.getAttribute('src')&&e.complete&&!e.naturalWidth).map(e=>e.src));assert.deepEqual(images,[]);
   rows.push({slug,width,noPageOverflow:true,collapsedDetails:true,detailsOpen:true});
   if((slug==='faehigkeiten'&&width===1440)||(slug==='berufe'&&width===390)){
    await first.locator('summary').click();await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(out,slug+'-'+width+'.png'),fullPage:false});
   }
  }
 }
 await page.setViewportSize({width:390,height:844});await page.goto(base+'faehigkeiten/');
 await page.locator('#wiki-search').fill('Waffenwerkbank');await page.locator('#search-list a[href$="waffentechnik/"]').click();assert.ok(page.url().endsWith('/waffentechnik/'));
 await page.locator('#menu-toggle').click();assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'),'true');
 await page.locator('#wiki-nav a[href$="kochen/"]').click();assert.ok(page.url().endsWith('/kochen/'));
 await page.goto(base+'temperatur/');assert.ok((await page.locator('#page-content').innerText()).toLocaleLowerCase('de').includes('bald verfügbar'));
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
 const result={passed:true,articleLayouts:rows,searchAndNavigation:true,mobileMenu:true,plannedStillEmpty:true,pageErrors:errors,missing,nativeGame:false};
 fs.writeFileSync(path.join(out,'browser.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({...result,articleLayouts:rows.length}));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
