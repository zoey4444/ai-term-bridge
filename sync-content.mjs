import fs from 'node:fs';
const files=['skill/ai-term-bridge/SKILL.md','skill/ai-term-bridge/references/workflow-contract.md','skill/ai-term-bridge/references/resource-guide.md','skill/ai-term-bridge/references/review-checklist.md'];
const text=files.map(p=>fs.readFileSync(p,'utf8')).join('\n\n');
fs.writeFileSync('lib/skill-context.mjs','// Generated from the packaged Skill. Run node scripts/sync-content.mjs after edits.\nexport const skillContext='+JSON.stringify(text)+';\n');
fs.writeFileSync('lib/document.mjs','// Generated from public/index.html.\nexport const documentHtml='+JSON.stringify(fs.readFileSync('public/index.html','utf8'))+';\n');
