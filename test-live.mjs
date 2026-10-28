import fs from 'node:fs';
import path from 'node:path';
const started=Date.now();
const [testId='rag-teacher-revised',term='RAG',background='中学语文教师，熟悉备课、教案与学生提问']=process.argv.slice(2);
const payload={term,background,coding:'不会编程',goal:'理解概念',language:'优先中文'};
const res=await fetch('http://127.0.0.1:8768/api/learn',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(100000)});
const result=await res.json();
const out=path.resolve('../../outputs/ai-term-bridge-project/live-tests');fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(path.join(out,testId.replace(/[^a-z0-9-]/g,'')+'.json'),JSON.stringify({testedAt:new Date().toISOString(),durationMs:Date.now()-started,httpStatus:res.status,input:payload,result},null,2));
console.log(JSON.stringify({status:res.status,seconds:Math.round((Date.now()-started)/1000),result},null,2));

