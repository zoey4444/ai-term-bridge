# AI 术语桥 Skill v0.3

这是比赛作品的可复用教学流程。核心入口是 `SKILL.md`；网页 https://ai-term-bridge-study.elvenstar16.chatgpt.site/ 是演示，不能代替 Skill。

使用：把 `ai-term-bridge` 文件夹放入支持 Skill 的助手的技能目录，或让助手读取 `SKILL.md` 并按需读取 `references/`。例如提问：“我是一名教师，不会编程，请用备课场景解释 RAG，推荐一份能直接读的资料，再给一道理解题。”

文件：`references/workflow-contract.md` 定义输入、步骤、输出和失败处理；`resource-guide.md` 定义资料核验；`review-checklist.md` 用于交付前检查；`evaluation-cases.md` 是待测情景；`assets/learning-card-template.md` 可复用为学习卡；`examples/` 是实际模型测试样例并写明人工复核结论。

资源检索需要可用的网页搜索和打开页面能力；离线解释可继续，但不能声称核实了链接。Skill 本身不含 API 密钥，也不要求安装网站。网页演示使用 DeepSeek API；复用 Skill 可由使用者选择其可用模型和工具。

已验证：两种背景的真实 DeepSeek 输出可生成学习卡；Token 样例的资料语言描述未通过人工复核，已保留作为改进证据。尚无真人学习效果评估。
