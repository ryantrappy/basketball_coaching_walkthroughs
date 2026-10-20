import { test, expect } from '@playwright/test';

test('serves the build and assets without imposing a Cloudflare cache policy',async({request})=>{
 const index=await request.get('/');
 expect(index.status()).toBe(200);
 expect(index.headers()['content-type']).toContain('text/html');
 const html=await index.text();
 const script=html.match(/src="([^\"]+\.js)"/);
 expect(script).not.toBeNull();
 const asset=await request.get(script![1]);
 expect(asset.status()).toBe(200);
 expect(asset.headers()['content-type']).toContain('javascript');
 expect(asset.headers()['cache-control']).toBeUndefined();
 const etag=asset.headers().etag;
 expect(etag).toBeTruthy();
 const cached=await request.get(script![1],{headers:{'If-None-Match':etag}});
 expect(cached.status()).toBe(304);
});

test('health, HEAD, missing assets and unsupported methods behave correctly',async({request})=>{
 const health=await request.get('/healthz');
 expect(health.status()).toBe(200);expect(await health.text()).toBe('ok');
 expect(health.headers()['cache-control']).toBe('no-store');
 const head=await request.head('/');
 expect(head.status()).toBe(200);expect(await head.text()).toBe('');
 expect(Number(head.headers()['content-length'])).toBeGreaterThan(0);
 for(const path of ['/assets/missing.js','/package.json','/server/index.ts','/%2e%2e/package.json']){
  const missing=await request.get(path);expect(missing.status()).toBe(404);
 }
 const post=await request.post('/');
 expect(post.status()).toBe(405);expect(post.headers().allow).toBe('GET, HEAD');
});

test('the production Node server runs the React playbook',async({page})=>{
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('/#inbounds/inbound-return');
 await expect(page.getByRole('heading',{name:'Inbounder give-and-go',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Next step',exact:true}).click();
 await expect(page.getByRole('img',{name:/step 2/})).toBeVisible();
 await page.getByRole('navigation',{name:'Playbook views'}).getByRole('link',{name:/Defense/}).click();
 await expect(page.getByRole('heading',{name:'Drop coverage',exact:true})).toBeVisible();
 expect(errors).toEqual([]);
});
