import { statSync } from 'node:fs';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import sirv from 'sirv';

const directory=fileURLToPath(new URL('../dist/',import.meta.url));
// Fail at startup if the production build is missing.
statSync(new URL('../dist/index.html',import.meta.url));
const port=Number(process.env.PORT || 8080);
if(!Number.isInteger(port)||port<1||port>65535)throw new Error('PORT must be between 1 and 65535');

// Leave caching policy to Cloudflare. Hash-based app routes only need index.html.
const serve=sirv(directory,{dev:false,etag:true,extensions:['html'],single:false});
const server=createServer((request,response)=>{
 if(request.method!=='GET'&&request.method!=='HEAD'){
  response.writeHead(405,{'Allow':'GET, HEAD','Content-Type':'text/plain; charset=utf-8'});
  response.end('Method not allowed');
  return;
 }
 if(request.url?.split('?')[0]==='/healthz'){
  response.writeHead(200,{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store'});
  response.end(request.method==='HEAD'?undefined:'ok');
  return;
 }
 serve(request,response,()=>{
  response.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});
  response.end(request.method==='HEAD'?undefined:'Not found');
 });
});
server.listen(port,'0.0.0.0',()=>console.log(`Second Read listening on port ${port}`));
for(const signal of ['SIGTERM','SIGINT'] as const){
 process.once(signal,()=>server.close(()=>process.exit(0)));
}
