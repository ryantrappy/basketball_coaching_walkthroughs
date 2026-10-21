import { test, expect } from '@playwright/test';

test('production playbook reloads and studies previously unvisited lessons offline',async({page,context,request})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/#pick-roll');
 await expect(page.getByRole('status')).toContainText('saved for offline use',{timeout:20000});
 await page.evaluate(async()=>{await navigator.serviceWorker.ready;});
 await context.setOffline(true);
 await page.reload();
 await expect(page.getByRole('heading',{name:'Pick & roll',exact:true})).toBeVisible();
 await expect(page.getByRole('status')).toContainText('Offline');
 await page.goto('/#zone-high-post');
 await expect(page.getByRole('heading',{name:'High post & short corner',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Make the read',exact:true}).click();
 await page.locator('.training-choices button').first().click();
 await expect(page.locator('.read-feedback')).toContainText('Strong read');
 await page.getByRole('slider').fill('3');
 await expect(page.locator('.ball')).toHaveAttribute('transform','translate(409,90)');
 await context.setOffline(false);
 await expect(page.getByRole('status').first()).toContainText('saved for offline use');
 expect(errors).toEqual([]);
 for(const path of ['/sw.js','/manifest.webmanifest','/']){
  const response=await request.get(path);expect(response.status()).toBe(200);expect(response.headers()['cache-control']).toBe('no-cache');
 }
});

test('a new service worker waits for the reader to accept the update',async({page})=>{
 const {createServer}=await import('node:http');
 const {readFileSync}=await import('node:fs');
 const {default:sirv}=await import('sirv');
 let release=1;
 const serve=sirv('dist',{etag:false});
 const server=createServer((req,res)=>{
  if(req.url?.split('?')[0]==='/sw.js'){
   res.writeHead(200,{'Content-Type':'application/javascript','Cache-Control':'no-store'});
   res.end(`${readFileSync('dist/sw.js','utf8')}\n// release ${release}`);
  }else serve(req,res,()=>{res.writeHead(404);res.end();});
 });
 await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));
 try{
  const address=server.address();if(!address||typeof address==='string')throw new Error('Missing test server port');
  await page.goto(`http://127.0.0.1:${address.port}/#pick-roll`);
  await expect(page.getByRole('status')).toContainText('saved for offline use',{timeout:20000});
  await page.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));
  await page.getByRole('slider').fill('1.5');
  release=2;
  await page.evaluate(async()=>{const registration=await navigator.serviceWorker.ready;await registration.update();});
  const update=page.getByRole('button',{name:'Update available · reload'});
  await expect(update).toBeVisible({timeout:20000});
  await expect(page.getByRole('slider')).toHaveValue('1.5');
  await update.click();
  await expect(page.getByRole('slider')).toHaveValue('0');
  await expect(update).toHaveCount(0);
  await expect(page.getByRole('heading',{name:'Pick & roll',exact:true})).toBeVisible();
 }finally{await new Promise<void>((resolve,reject)=>server.close(e=>e?reject(e):resolve()));}
});
