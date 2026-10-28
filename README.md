# AI 术语桥

为没有 AI 基础的学习者生成词义、大白话、熟悉领域的类比及其边界，并提供有来源状态的阅读资料、GitHub 中文导读、练习和理解题。

## 本机试用（无需安装网页依赖）

需要 Node.js 22.13 或更新版本。Windows 可双击 `启动本机预览.cmd`，然后打开 http://127.0.0.1:8768 。这个地址只有运行它的电脑可以使用，不能发给其他人当作公开网站。

首次连接 DeepSeek：打开 http://127.0.0.1:8768/local-setup ，由使用者粘贴密钥并保存。密钥只写入本机 `.dev.vars`，不返回给浏览器，不包含在作品下载包中。填写后点击“返回学习页”。没有密钥也能查看四个预写示例。

也可复制 `.env.example` 为 `.dev.vars`，手动填写 `DEEPSEEK_API_KEY`。默认模型为 deepseek-flash，可按账户权限修改 `DEEPSEEK_MODEL`；把 `DEEPSEEK_SEARCH_ENABLED` 改为 false 可停用资料检索。停用后不会给出声称已核查的资料链接。调用生成和检索使用维护者的 DeepSeek 账户额度。

## 内容与 Skill

- `skill/ai-term-bridge/SKILL.md`：可复用工作流程。
- `skill/ai-term-bridge/references/`：资料导读规则和教学测试方案。
- `lib/bridge.mjs`：输入校验、资料检索、结构化生成和来源校验。
- `public/`：中文网页与明确标记的预写示例。
- `scripts/preview.mjs`：仅监听本机的独立预览服务；设置页只存在于这个服务。
- `app/api/`：线上版本服务端接口，允许访客免登录试用。

修改 Skill 或 public/index.html 后运行 `node scripts/sync-content.mjs`，同步到线上版本使用的内容。输入用户背景会影响类比，不能改变技术定义。

## 自动验证

运行 `node --test tests/bridge.test.mjs tests/local-setup.test.mjs`。这些是使用模拟模型或隔离文件的自动测试，不消耗真实 API 额度，不代表教学质量通过验证。

真实联调脚本 `scripts/test-live.mjs` 需要本机服务运行且密钥已保存。它调用真实服务并产生费用；仅用于维护者手动验收，不会在网站访问时自动运行。

## 线上构建与分享

线上使用 Vinext / Cloudflare Workers 与 Sites 集成。安装依赖后运行项目 build 脚本。Sites 项目标识保存在 `.openai/hosting.json`，继续开发时保留该标识。

线上需要另行配置服务端 `DEEPSEEK_API_KEY`，本机 `.dev.vars` 不上传。公开网站允许访客免登录生成。每位访客每小时最多提交 3 次，整个网站的本轮公开试用最多受理 20 次；总次数使用 Sites D1 数据库原子记录，额度服务不可用时停止生成。计数在调用模型前完成，失败的请求也占用一次。这是网站内的次数限制，不是 DeepSeek 账户的人民币费用上限；如需严格的账户费用上限，应在服务商控制台另行设置。

## 已知限制

资料检索会取得正文片段或摘要，不保证整页已读、每项模型解释都准确，亦不等于已运行仓库代码。示例中的资料有查阅日期；真实生成单独记录本次日期。外部来源会变化，链接和学习门槛需继续核对。

目前未进行真人学习效果评估。Skill 专项设计、测试与复用说明已形成初稿；申报书、贡献说明、AI 使用说明和演示视频仍需按最终报名要求与本人资料完成。

DeepSeek 接口依据：https://api-docs.deepseek.com/guides/search/ 与 https://api-docs.deepseek.com/guides/json_mode/
