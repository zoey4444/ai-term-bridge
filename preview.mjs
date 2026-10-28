import http from 'node:http';
import {handleLocalSetup} from './local-setup.mjs';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createLesson,BridgeError} from '../lib/bridge.mjs';
import {skillContext} from '../lib/skill-context.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.zip':'application/zip','.svg':'image/svg+xml'};
function config(){const env={};let text='';try{text=fs.readFileSync(path.join(root,'.dev.vars'),'utf8');}catch{}for(const line of text.split(/\r?\n/)){const m=line.match(/^(DEEPSEEK_API_KEY|DEEPSEEK_MODEL|DEEPSEEK_SEARCH_ENABLED)=(.*)$/);if(m)env[m[1]]=m[2].trim().replace(/^['"]|['"]$/g,'');}return {key:env.DEEPSEEK_API_KEY||process.env.DEEPSEEK_API_KEY,model:env.DEEPSEEK_MODEL||process.env.DEEPSEEK_MODEL||'deepseek-flash',searchEnabled:env.DEEPSEEK_SEARCH_ENABLED!=='false',skill:skillContext};}
let active=false, count=0,reset=Date.now()+3600000;
const server=http.createServer(async(req,res)=>{
 const reply=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data));};
 try {
  const origin='http://127.0.0.1:8768';if(!['127.0.0.1:8768','localhost:8768'].includes(req.headers.host||'')){reply(403,{error:'仅支持本机预览。'});return;}
  if(req.headers.origin&&!['http://localhost:8768',origin].includes(req.headers.origin)){reply(403,{error:'请从本地预览页面提交。'});return;}
  const url=new URL(req.url,origin);
  if(url.pathname==='/local-setup'){await handleLocalSetup(req,res,root);return;}
  if(url.pathname==='/api/status'){const c=config();reply(200,{ready:Boolean(c.key?.trim()),model:c.model,searchEnabled:c.searchEnabled});return;}
  if(url.pathname==='/api/learn'&&req.method==='POST'){
   if(Date.now()>reset){reset=Date.now()+3600000;count=0;}if(active||count>=20){reply(429,{error:'请等待上一条完成，或稍后再试。'});return;}
   let text='';for await(const chunk of req){text+=chunk;if(text.length>10000){reply(413,{error:'输入内容过长。'});return;}}
   let input;try{input=JSON.parse(text);}catch{reply(400,{error:'输入格式不正确。'});return;}
   active=true;count++;try{reply(200,await createLesson(input,config()));}catch(e){reply(e instanceof BridgeError?e.status:500,{error:e instanceof BridgeError?e.message:'服务暂时不可用。',code:e instanceof BridgeError?e.code:'SERVER_ERROR'});}finally{active=false;}return;
  }
  if(req.method!=='GET'&&req.method!=='HEAD'){reply(405,{error:'不支持的请求。'});return;}
  const allowed=new Set(['/','/index.html','/style.css','/data.js','/app.js','/ai-term-bridge-v0.3.zip','/favicon.svg']);
  if(!allowed.has(url.pathname)){reply(404,{error:'页面不存在。'});return;}
  const file=path.join(root,'public',url.pathname==='/'?'index.html':url.pathname.slice(1));if(!fs.existsSync(file)){reply(404,{error:'页面不存在。'});return;}
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});if(req.method==='HEAD')res.end();else fs.createReadStream(file).pipe(res);
 } catch {if(!res.headersSent)reply(500,{error:'请求未能完成。'});else res.end();}
});
server.listen(8768,'127.0.0.1',()=>console.log('AI 术语桥预览：http://127.0.0.1:8768（仅本机）'));


