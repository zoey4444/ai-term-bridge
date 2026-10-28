import {spawnSync} from 'node:child_process';
import {existsSync} from 'node:fs';
if(!process.env.npm_execpath)throw new Error('请通过包管理器运行 install:ci。');
const result=spawnSync(process.execPath,[process.env.npm_execpath,'install',existsSync('pnpm-lock.yaml')?'--frozen-lockfile':'--no-frozen-lockfile'],{stdio:'inherit',env:process.env});
if(result.error)throw result.error;
process.exit(result.status??1);
