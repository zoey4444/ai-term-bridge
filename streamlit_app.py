"""AI 术语桥的 Streamlit 演示入口。

本文件负责网页交互、DeepSeek API 调用、资料搜索和结果展示；教学流程从
skill_context.md 读取，作为 system prompt 提供给模型执行。
"""

import json
from pathlib import Path
from urllib.parse import urlparse

import requests
import streamlit as st


API_BASE = "https://api.deepseek.com"
MODEL = "deepseek-flash"
ALLOWED_HOSTS = {
    "github.com", "huggingface.co", "arxiv.org", "developers.google.com",
    "learn.microsoft.com", "cloud.google.com", "pytorch.org",
    "scikit-learn.org", "ibm.com",
}
SKILL_CONTEXT_FILE = Path("skill_context.md")

st.set_page_config(page_title="AI 术语桥", page_icon="🌉", layout="centered")
st.title("AI 术语桥")
st.caption("把 AI 术语讲清楚，再用你熟悉的经验搭一座理解的桥。")
st.info("公开演示版。生成和资料搜索会使用维护者的 DeepSeek API 额度；请勿填写个人隐私或敏感资料。")


def get_key() -> str:
    """从 Streamlit 私密配置读取密钥，不从公开代码或用户输入读取。"""
    try:
        return str(st.secrets["DEEPSEEK_API_KEY"]).strip()
    except Exception:
        return ""


def load_skill_instructions() -> str:
    """读取合并后的 Skill 核心规则，让演示真正执行 Skill 流程。"""
    if not SKILL_CONTEXT_FILE.is_file():
        raise FileNotFoundError(f"找不到 {SKILL_CONTEXT_FILE}")
    return SKILL_CONTEXT_FILE.read_text(encoding="utf-8")


def search_sources(key: str, term: str, language: str) -> list[dict]:
    """先调用 DeepSeek Search，再只保留允许域名的资料作为模型依据。"""
    lang = "zh,en" if language == "中英文都可以" else "zh"
    response = requests.post(
        f"{API_BASE}/v1/tools/search",
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        json={"query": f'"{term}" AI machine learning {"lang:" + lang}', "count": 8, "need_content": True},
        timeout=35,
    )
    response.raise_for_status()
    results = []
    for item in response.json().get("results", []):
        url = str(item.get("url", ""))
        parsed = urlparse(url)
        host = (parsed.hostname or "").lower()
        if parsed.scheme != "https" or not any(host == h or host.endswith("." + h) for h in ALLOWED_HOSTS):
            continue
        results.append({
            "title": str(item.get("title", ""))[:180],
            "url": url,
            "summary": str(item.get("summary") or item.get("snippet") or "")[:1800],
            "content": str(item.get("content") or "")[:3500],
            "date": item.get("date"),
            "authority": item.get("authority"),
        })
        if len(results) >= 5:
            break
    return results


def generate_learning_card(key: str, inputs: dict, sources: list[dict], instructions: str) -> dict:
    """让模型按 Skill 和固定输出约定生成学习卡，并解析 JSON。"""
    system_prompt = f"""你是 AI 术语桥学习助手。遵循下列 Skill 与参考规则执行，不要声称完成了规则未要求的操作。

<skill_instructions>
{instructions}
</skill_instructions>

<output_contract>
请输出合法 JSON 对象，结构如下：
{{"lesson":{{"term":"中文术语","english":"英文全称及缩写","definition":"准确定义","plain":"大白话解释","analogy":{{"title":"类比标题","story":"贴近学习者领域的解释","mappings":[{{"familiar":"熟悉领域事物","ai":"对应的AI机制"}}],"boundary":"类比不成立的边界"}},"usage":"一个用途","misconception":"一个常见误解","resources":[{{"title":"资料标题","url":"必须逐字来自给定来源","why":"为什么推荐","readFirst":"阅读起点","prerequisites":"阅读与运行门槛","verification":"page_content 或 search_summary"}}],"exercise":{{"instruction":"3到10分钟练习","expectedObservation":"观察点"}},"quiz":{{"question":"迁移理解题","options":["选项A","选项B","选项C"],"correctIndex":0,"explanation":"解释正确项与误区"}},"nextConcept":"后续概念"}},"warnings":[]}}

只允许使用给定来源的 URL；没有合适来源时 resources 输出空数组并在 warnings 说明。来源 content 为空时标注 search_summary，不得声称读过网页正文。职业背景只用于类比，不得改变事实定义。只输出 JSON，不要 Markdown 代码围栏。
</output_contract>"""
    user_prompt = json.dumps({"learner": inputs, "verified_search_results": sources}, ensure_ascii=False)
    response = requests.post(
        f"{API_BASE}/chat/completions",
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        json={
            "model": MODEL,
            "messages": [{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}],
            "response_format": {"type": "json_object"},
            "max_tokens": 6000,
            "stream": False,
        },
        timeout=100,
    )
    response.raise_for_status()
    content = response.json()["choices"][0]["message"].get("content") or ""
    result = json.loads(content)
    if not isinstance(result.get("lesson"), dict):
        raise ValueError("AI 返回的学习卡结构不完整。")
    return result


key = get_key()
if not key:
    st.warning("AI 服务尚未配置。部署者需要在 Streamlit 应用的 Secrets 设置中加入 DEEPSEEK_API_KEY。")

with st.form("learn_form"):
    term = st.text_input("想了解哪个 AI 术语？", placeholder="例如：RAG、Token、Embedding")
    background = st.text_input("你熟悉的领域或生活经验", placeholder="例如：中学语文教学、会计、烹饪、日常购物")
    col1, col2 = st.columns(2)
    with col1:
        coding = st.selectbox("编程基础", ["不会编程", "了解一点编程", "能独立写代码"])
        goal = st.selectbox("这次想达到什么程度？", ["理解概念", "尝试一个小例子", "寻找编程实践"])
    with col2:
        language = st.selectbox("资料语言偏好", ["优先中文", "中英文都可以"])
        mode = st.selectbox("讲解节奏", ["快速学习卡", "互动学习（先生成一张卡）"])
    submitted = st.form_submit_button("生成我的学习卡", type="primary", disabled=not bool(key))

if submitted:
    if not term.strip() or not background.strip():
        st.error("请填写术语和熟悉的领域。")
    else:
        inputs = {"term": term.strip(), "background": background.strip(), "coding": coding, "goal": goal, "language": language, "mode": mode}
        try:
            instructions = load_skill_instructions()
            with st.spinner("正在查找资料……"):
                sources = search_sources(key, term.strip(), language)
            with st.spinner("Skill 正在组织学习卡……"):
                card = generate_learning_card(key, inputs, sources, instructions)
            st.session_state["learning_card"] = card
        except requests.HTTPError as exc:
            status = exc.response.status_code if exc.response is not None else "未知"
            if status == 402:
                st.error("DeepSeek 账户余额不足，请维护者检查服务商账户。")
            elif status == 401:
                st.error("DeepSeek 密钥无效或未正确配置，请维护者检查 Streamlit Secrets。")
            elif status == 429:
                st.error("DeepSeek 服务当前请求较多，请稍后再试。")
            else:
                st.error(f"资料或生成服务暂时不可用（HTTP {status}）。请稍后再试。")
        except FileNotFoundError as exc:
            st.error(f"Skill 规则文件没有找到：请确认 {SKILL_CONTEXT_FILE.name} 与 streamlit_app.py 一起放在仓库根目录。")
        except requests.Timeout:
            st.error("连接 DeepSeek 超时。请稍后重试；这次请求可能已产生部分搜索费用。")
        except requests.RequestException as exc:
            status = exc.response.status_code if getattr(exc, "response", None) is not None else "无 HTTP 状态码"
            st.error(f"连接 DeepSeek 时失败：{type(exc).__name__}（{status}）。请勿重复点击，先把这条错误发给我。")
        except (ValueError, KeyError) as exc:
            st.error(f"收到的结果格式不符合预期：{type(exc).__name__}。没有显示原始响应或密钥；请把这条错误发给我。")
        except Exception as exc:
            st.error(f"应用内部遇到未分类错误：{type(exc).__name__}。没有显示原始请求或密钥；请把这条错误发给我。")

card = st.session_state.get("learning_card")
if card and isinstance(card.get("lesson"), dict):
    lesson = card["lesson"]
    st.divider()
    st.header(lesson.get("term", term))
    st.caption(lesson.get("english", ""))
    st.subheader("准确定义")
    st.write(lesson.get("definition", ""))
    st.subheader("大白话说")
    st.write(lesson.get("plain", ""))
    analogy = lesson.get("analogy", {})
    st.subheader("用熟悉的经验理解")
    st.markdown(f"**{analogy.get('title', '')}**  \n{analogy.get('story', '')}")
    for mapping in analogy.get("mappings", []):
        st.markdown(f"- **{mapping.get('familiar', '')}** → {mapping.get('ai', '')}")
    st.info("类比边界：" + analogy.get("boundary", ""))
    st.subheader("用途与常见误解")
    st.markdown(f"**用途：** {lesson.get('usage', '')}  \n**常见误解：** {lesson.get('misconception', '')}")
    st.subheader("接着学：阅读资料和 GitHub")
    for i, resource in enumerate(lesson.get("resources", []), 1):
        title = resource.get("title") or f"资料 {i}"
        with st.expander(f"{i}. {title}", expanded=(i == 1)):
            st.write(resource.get("why", ""))
            st.markdown("**阅读起点：** " + resource.get("readFirst", ""))
            st.markdown("**门槛：** " + resource.get("prerequisites", ""))
            st.caption("核验范围：" + resource.get("verification", "未说明"))
            if resource.get("url", "").startswith("https://"):
                st.link_button("打开资料", resource["url"])
    exercise = lesson.get("exercise", {})
    st.subheader("试着练习")
    st.write(exercise.get("instruction", ""))
    with st.expander("练习观察点"):
        st.write(exercise.get("expectedObservation", ""))
    quiz = lesson.get("quiz", {})
    st.subheader("理解检查")
    st.write(quiz.get("question", ""))
    options = quiz.get("options", [])
    if options:
        selected = st.radio("选择一个答案", options, index=None, key="quiz_answer")
        if st.button("查看反馈"):
            if selected is None:
                st.warning("请先选一个答案。")
            else:
                right = options.index(selected) == quiz.get("correctIndex")
                st.success("回答正确。" + quiz.get("explanation", "")) if right else st.warning("这里有个理解点需要修正：" + quiz.get("explanation", ""))
    st.markdown("**下一步：** " + lesson.get("nextConcept", ""))
    for warning in card.get("warnings", []):
        st.caption("提示：" + str(warning))

st.divider()
st.caption("公开访客可直接生成，模型调用和资料搜索会消耗维护者的 DeepSeek 额度。请核对来源；推荐代码仓库不会自动运行。")
st.markdown("原版网页：[AI 术语桥](https://ai-term-bridge-study.elvenstar16.chatgpt.site/)")
