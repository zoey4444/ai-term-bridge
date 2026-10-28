import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createLesson } from '../lib/bridge.mjs';
import { skillContext } from '../lib/skill-context.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const keyLine=fs.readFileSync(path.join(root,'.dev.vars'),'utf8').split(/\r?\n/).find(x=>x.startsWith('DEEPSEEK_API_KEY='));
const key=keyLine?.slice('DEEPSEEK_API_KEY='.length).trim().replace(/^['"]|['"]$/g,'');
if(!key)throw new Error('本机没有设置 DeepSeek 密钥');
const fixtures=[
 {id:'rag-teacher-v02',term:'RAG',background:'中学语文教师，熟悉备课、教案与学生提问',coding:'不会编程',goal:'理解概念',language:'优先中文'},
 {id:'token-cook-v02',term:'Token',background:'厨师，熟悉备菜、食谱和出餐，不懂编程',coding:'不会编程',goal:'理解概念',language:'优先中文'},
];
const out=path.resolve(root,'../../outputs/ai-term-bridge-project/skill-tests');
fs.mkdirSync(out,{recursive:true});
for(const fixture of fixtures.filter(f=>!process.argv[2]||f.id===process.argv[2])){
 const {id,...input}=fixture;
 const start=Date.now();
 try{
  const result=await createLesson(input,{key,model:'deepseek-flash',searchEnabled:true,skill:skillContext});
  const record={testId:id,skillVersion:'0.2',environment:'DeepSeek live model with injected Skill context via local website engine',testedAt:new Date().toISOString(),durationMs:Date.now()-start,input,result};
  fs.writeFileSync(path.join(out,id+'.json'),JSON.stringify(record,null,2));
  console.log(JSON.stringify({testId:id,ok:true,seconds:Math.round(record.durationMs/1000),resources:result.lesson?.resources?.length,mappings:result.lesson?.analogy?.mappings?.length}));
 }catch(error){console.log(JSON.stringify({testId:id,ok:false,code:error.code||'ERROR',message:error.message}));process.exitCode=1;break;}
}
