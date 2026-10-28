import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
const token=crypto.randomBytes(32).toString('hex');
const page=`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AI 术语桥 · 本机设置</title><style>body{margin:0;background:#f6f3eb;color:#233c33;font-family:system-ui,"Microsoft YaHei",sans-serif;line-height:1.8}main{max-width:520px;margin:8vh auto;padding:32px;background:#fffefa;border:1px solid #dcded2;border-radius:20px}h1{font-size:28px}label{display:block;font-weight:600;margin:24px 0 8px}input{box-sizing:border-box;width:100%;padding:14px;border:1px solid #adb9ae;border-radius:8px;font-size:16px}button{margin-top:24px;background:#264e40;color:white;border:0;border-radius:8px;padding:14px 22px;font-size:16px;cursor:pointer}small{color:#65736a}a{color:#264e40}#message{min-height:28px}@media(max-width:600px){main{margin:24px 16px;padding:24px}}</style><main><small>AI 术语桥 / 仅本机设置</small><h1>连接你的 DeepSeek</h1><p>把已有的 API 密钥粘贴到下方。保存后，可以回到学习页生成讲解。</p><form id="setup"><label for="key">DeepSeek API 密钥</label><input id="key" type="password" placeholder="粘贴完整密钥" required autocomplete="off" spellcheck="false" maxlength="512"><small>密钥会保存在本机项目的 .dev.vars 文件中。网页不回显密钥，也不会把它包含在下载的作品里。</small><br><button id="save">保存到本机</button><p id="message" role="status"></p></form><p><a href="/">返回学习页 →</a></p><small>生成讲解时，学习内容会发送给 DeepSeek，并按你的 API 账户计费。此页只配置本机预览；线上网站需要另行配置。</small></main><script>document.getElementById('setup').addEventListener('submit',async e=>{e.preventDefault();const b=document.getElementById('save'),m=document.getElementById('message'),k=document.getElementById('key');b.disabled=true;m.textContent='正在保存…';try{const r=await fetch('/local-setup',{method:'POST',headers:{'Content-Type':'application/json','X-Setup-Token':'${token}'},body:JSON.stringify({key:k.value})});const d=await r.json();if(!r.ok)throw new Error(d.error);k.value='';m.textContent='已保存。点击下方“返回学习页”，就可以生成讲解了。';}catch(e){m.textContent=e.message||'保存失败，请重试。';}finally{b.disabled=false;}});</script></html>`;
export async function handleLocalSetup(req,res,root){
 const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Referrer-Policy':'no-referrer'};
 const reply=(status,body)=>{res.writeHead(status,{...headers,'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(body));};
 if(req.method==='GET'){res.writeHead(200,{...headers,'Content-Type':'text/html; charset=utf-8'});res.end(page);return;}
 if(req.method!=='POST'){reply(405,{error:'请在设置页填写。'});return;}
 if(!['http://127.0.0.1:8768','http://localhost:8768'].includes(req.headers.origin)||req.headers['x-setup-token']!==token){reply(403,{error:'请重新打开本机设置页。'});return;}
 let raw='';for await(const c of req){raw+=c;if(raw.length>2048){reply(413,{error:'密钥内容过长。'});return;}}
 let key;try{key=JSON.parse(raw).key;}catch{reply(400,{error:'请重新填写密钥。'});return;}
 if(typeof key!=='string'||!/^[-A-Za-z0-9_]{12,512}$/.test(key.trim())){reply(400,{error:'请粘贴完整密钥，不要包含空格、引号或换行。'});return;}
 const dest=path.join(root,'.dev.vars');let config='';try{config=fs.readFileSync(dest,'utf8');}catch{}
 const line='DEEPSEEK_API_KEY='+key.trim();config=/^DEEPSEEK_API_KEY=.*$/m.test(config)?config.replace(/^DEEPSEEK_API_KEY=.*$/m,line):config+'\n'+line+'\n';
 fs.writeFileSync(dest,config,{encoding:'utf8',mode:0o600});reply(200,{saved:true});
}

