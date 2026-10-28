window.BRIDGE_DATA = {
  rag: {
    short:'RAG', name:'检索增强生成', english:'Retrieval-Augmented Generation', aliases:['rag','检索增强生成'],
    plain:'先找相关资料，再让 AI 带着资料回答。',
    definition:'系统先从外部资料中检索与问题相关的内容，再把这些内容交给生成模型，帮助它组织回答。',
    analogies:{
      teacher:{title:'像备课时，先翻教材，再组织讲解。',text:'学生问“这个实验为什么会失败？”你先找到教材里相关的实验条件，再根据材料组织说明。RAG 也会先找到相关资料，把材料交给 AI，帮助它回答问题。',map:[['教材与讲义','外部资料库'],['找相关段落','检索'],['结合材料讲解','生成回答']]},
      business:{title:'像客服先查产品手册，再回答顾客。',text:'顾客问一款商品能不能水洗。你先找这款商品的洗护说明，再用顾客听得懂的话回答。RAG 把查找资料与组织答案接在一起，让回答有相关材料可参考。',map:[['产品手册','资料库'],['查具体型号','检索'],['组织回复','生成']]},
      daily:{title:'像做菜前，先找到合适的食谱。',text:'你想知道没有烤箱能不能做某道菜。先找符合条件的食谱，再结合食谱整理做法。RAG 的基本流程也类似：找资料，把相关内容交给 AI，再组织回答。',map:[['食谱合集','外部资料'],['挑相关做法','检索'],['整理步骤','生成回答']]}
    },
    boundary:'类比到这里就停：AI 可能找错资料，也可能误读资料。用了 RAG，并不保证答案正确；查资料也不等于重新训练模型。',
    source:'https://github.com/microsoft/generative-ai-for-beginners/tree/main/15-rag-and-vector-databases',
    github:{title:'微软生成式 AI 入门 · RAG 一课',english:'Retrieval Augmented Generation (RAG) and Vector Databases',translation:'检索增强生成与向量数据库',what:'这是一节课程，介绍如何把外部资料用于 AI 回答，并配有实践示例。',start:'先读 Introduction 和 How RAGs work，试着找出“资料、检索、回答”这三部分。数据库与代码可以稍后再看。',barrier:'概念文字可以直接阅读；实践涉及编程与 Azure 服务，需另行核查账号、配置和费用。本原型没有运行这些代码。'},
    advanced:{title:'RAG 的原始研究论文',url:'https://arxiv.org/abs/2005.11401',text:'中文题意：面向知识密集型语言任务的检索增强生成。作者研究了把外部检索与生成模型结合的方法。先看摘要；实验和模型细节留待有基础后阅读。'},
    quiz:{question:'AI 查过资料后，给出的回答就一定正确吗？',options:['一定正确，资料已经替它核实了事实。','不一定，检索、资料本身和生成都可能出错。'],correct:1,explanation:'查资料是增加依据的一步。找错材料、材料过时或生成时理解出错，都可能影响结果。'},
    practice:'找一段公开的学校通知。先用原文回答“什么时候报名”，再检查答案是否真的能在通知中找到。这个练习模拟“参考资料回答”，并不等于搭建了完整 RAG 系统。',next:'下一步可以认识 Prompt：资料怎样交给 AI？'
  },
  llm:{
    short:'LLM',name:'大语言模型',english:'Large Language Model',aliases:['llm','大语言模型','语言模型'],
    plain:'从大量语言材料中学到规律，再根据上下文生成文字。',
    definition:'大语言模型是在大量数据上训练的语言模型。它根据上下文计算接下来文本片段的可能性，并逐步生成内容，可用于问答、总结和翻译等任务。',
    analogies:{
      teacher:{title:'像看过很多表达范例的写作助手。',text:'你让一位写作助手参考过往范例，为家长会起草通知。它能模仿通知的结构和语气。类似地，大语言模型在训练中学习表达规律，再根据你提供的内容生成文字。',map:[['范例材料','训练数据'],['当前写作要求','上下文'],['起草通知','生成文字']]},
      business:{title:'像熟悉许多文案形式的起草助手。',text:'你需要一份新品介绍。助手参考学到的语言规律，把你给的特点组织成文案。大语言模型也能根据输入生成文字，但产品参数仍要由人核对。',map:[['过去的语言材料','训练数据'],['本次产品信息','上下文'],['文案草稿','输出']]},
      daily:{title:'像一个很会接着上下文写下去的助手。',text:'给它“周末我们去公园，因为……”这样的开头，它会根据学到的表达规律继续写。通过类似的文本生成过程，也能完成更复杂的解释、总结或翻译。',map:[['见过的语言材料','训练数据'],['你写的开头','上下文'],['接着写出的内容','生成结果']]}
    },
    boundary:'这只是帮助理解的类比。模型不等于一个读过书的人；生成得流畅，也不代表内容有事实依据或具备人的判断力。',
    source:'https://developers.google.com/machine-learning/crash-course/llm',
    github:{title:'微软生成式 AI 入门 · 第一课',english:'Introduction to Generative AI and Large Language Models',translation:'生成式 AI 与大语言模型入门',what:'这是一套公开课程。第一课用教育场景介绍生成式 AI、大语言模型以及它们的用途。',start:'先读 Introduction 与 Learning Goals，随后看应用场景。遇到模型内部机制时，可以先抓住“根据输入逐步生成文字”这个线索。',barrier:'这一阶段只需阅读，无需安装。后续编程课程的依赖需要逐课查看；本原型没有运行代码。',url:'https://github.com/microsoft/generative-ai-for-beginners/tree/main/01-introduction-to-genai'},
    advanced:{title:'Google：大语言模型简介',url:'https://developers.google.com/machine-learning/crash-course/llm',text:'先读 What is a language model?。完整模块要求机器学习、神经网络等基础，暂时读懂基本定义即可。'},
    quiz:{question:'一段回答很流畅、很像专家说的，能据此判断内容正确吗？',options:['不能，表达流畅与事实正确是两件需要分别检查的事。','能，越自然的表达越有事实依据。'],correct:0,explanation:'模型擅长生成合理的语言形式，但仍可能生成不正确的信息。重要事实需要核对可靠来源。'},
    practice:'准备一段你熟悉的公开说明，请任意可用的 AI 助手把它总结成三句话。对照原文检查遗漏和新增内容，观察“写得顺”和“总结得准”的区别。',next:'下一步认识 Token：模型怎样把文字分成片段？'
  },
  prompt:{
    short:'Prompt',name:'提示词',english:'Prompt',aliases:['prompt','提示词','提示'],
    plain:'你交给 AI 的任务要求，以及完成任务需要的背景。',
    definition:'提示词是提供给模型的输入内容，可以包括指令、背景材料、例子和输出要求。它会影响模型如何生成回应。',
    analogies:{
      teacher:{title:'像一份写得清楚的作业要求。',text:'“写作文”与“为四年级同学写一段 100 字的春游通知，说明时间和带什么”会带来不同结果。提示词也可以交代任务、对象、材料与格式，减少含糊之处。',map:[['作业目标','任务指令'],['参考材料','背景内容'],['字数与形式','输出要求']]},
      business:{title:'像交给同事的一份任务简报。',text:'让同事“做个介绍”和说明“面向首次购买的顾客，按这份参数表写三条卖点”，要求的清楚程度不同。提示词把目标、资料和形式交代给 AI。',map:[['任务简报','提示词'],['产品参数','上下文资料'],['三条卖点','输出格式']]},
      daily:{title:'像给朋友交代一件事情。',text:'“帮我买点东西”信息很少；“买两人份晚餐食材，预算 50 元，不要辣”更明确。给 AI 的输入也可以说明目标、约束和已有信息。',map:[['想完成的事','任务'],['预算与偏好','约束'],['已有食材信息','背景']]}
    },
    boundary:'要求清楚通常有帮助，但不能保证 AI 一定遵守或答对。提示词也不限于一句命令，它可以包含材料与示例。',
    source:'https://github.com/microsoft/generative-ai-for-beginners/tree/main/04-prompt-engineering-fundamentals',
    github:{title:'微软课程 · 提示词工程基础',english:'Prompt Engineering Fundamentals',translation:'提示词工程基础',what:'这节课程讲解如何组织输入，让生成式 AI 更清楚地接收任务。',start:'先读 Introduction 与提示词的说明，再比较例子中的任务、背景和输出要求。',barrier:'先读文字说明即可。运行代码例子需要另行检查环境与服务要求；本原型只核对了文档。'},
    advanced:null,
    quiz:{question:'想让 AI 根据通知写摘要，哪一种输入提供了更充分的信息？',options:['“总结一下”，不附任何材料。','附上通知，并说明读者、摘要长度和必须保留的信息。'],correct:1,explanation:'第二种输入给出了材料和输出要求，让任务更明确。但生成后仍需要与通知原文核对。'},
    practice:'用一段公开介绍，分别试“帮我总结”和“为首次接触的人总结成三句话，只使用原文信息”。比较两次结果，再检查它们是否都忠于原文。',next:'下一步认识 RAG：如果资料很多，怎样先找出相关部分？'
  },
  token:{
    short:'Token',name:'文本处理单元',english:'Token',aliases:['token','词元','文本处理单元','令牌'],
    plain:'模型处理文字时，通常先把文字拆成一小块一小块。',
    definition:'在语言模型中，token 是分词器处理文本得到的单元，可能是一个词、词的一部分、字符或标点。不同模型的切分规则可能不同。这里不讨论账号访问令牌。',
    analogies:{
      teacher:{title:'像把一句话拆成便于处理的小卡片。',text:'为了组织句子练习，你把文字拆到卡片上。模型也会先把输入转换成可处理的单元。不过，模型的切分规则由分词器决定，不一定和课堂上的词语划分一致。',map:[['整段句子','输入文本'],['按规则分卡片','分词'],['一张卡片','一个 token']]},
      business:{title:'像把一批材料按规定单位拆开登记。',text:'登记时先按规则把材料分成单位，再逐个处理。模型处理文字也需要这种切分。不过，token 的单位规则由具体分词器决定，不能直接当成字数。',map:[['整批材料','文本'],['拆分规则','分词器规则'],['处理单位','token']]},
      daily:{title:'像把食材切成便于处理的小块。',text:'做菜前先切块，后续才能按块处理。文字进入模型前也会先被切分。但模型怎样切文字有自己的规则，不能用食材大小或汉字数量推算。',map:[['完整食材','文本'],['切分规则','分词规则'],['小块','token']]}
    },
    boundary:'token 不固定等于一个汉字或一个单词。具体数量取决于文本和所用分词器；“卡片”和“切块”都只是切分过程的类比。',
    source:'https://developers.google.com/machine-learning/crash-course/llm',
    github:{title:'微软入门课程 · 文字怎样进入模型',english:'Tokenizer, text to numbers',translation:'分词器：把文本转换成数字',what:'第一课的大语言模型工作原理部分介绍了文本切分与后续生成过程。',start:'在第一课中找到 How do large language models work?，先看 Tokenizer, text to numbers 这一段。',barrier:'这一段可直接阅读，无需编程。更精确的切分实验要选择具体模型的分词器；本原型没有运行分词工具。',url:'https://github.com/microsoft/generative-ai-for-beginners/tree/main/01-introduction-to-genai'},
    advanced:{title:'Google：token 的定义与示例',url:'https://developers.google.com/machine-learning/crash-course/llm',text:'只读 What is a language model? 下方的 token 定义及英文切分例子。完整课程还有其他先修要求，不必一次读完。'},
    quiz:{question:'一段中文有 100 个汉字，它就一定有 100 个 token 吗？',options:['不一定，要看文本及具体分词器的切分规则。','一定，每个汉字固定是一个 token。'],correct:0,explanation:'字符数与 token 数并不一一对应。同一段文字，使用不同分词器时也可能得到不同数量。'},
    practice:'试着用两种方式把一个短句划成小块，观察“怎么切”会影响块数。这个纸面练习只帮助理解规则差异，不能作为真实模型的 token 计数。',next:'下一步认识 LLM：模型如何利用这些片段生成内容？'
  }
};
