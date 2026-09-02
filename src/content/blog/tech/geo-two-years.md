---
title: "GEO 两年：我翻了 16 个一手信源，把这门生意的真话和谎话分开"
date: 2026-09-02
publishDate: "2026-09-02"
tags: ["GEO", "生成式引擎优化", "AI搜索", "SEO", "实事求是"]
toc: true
description: "16 个一手信源核查后关于 GEO（生成式引擎优化）的深度复盘：论文底子、流量数据、平台口径、证据分级、噪声经济解剖、中国市场与 315 投毒案。"
draft: false
section: "tech"
keywords: ["GEO", "生成式引擎优化", "AI搜索", "SEO", "315", "llms.txt", "Pew"]
---

2026-09-02。这篇写的是 GEO（生成式引擎优化）——让内容被 ChatGPT 这类 AI 问答推荐的技术。这两年它被包装成"SEO 的终结者""AI 时代的免费广告位"，催生了上百家服务商和几十亿融资。但翻完 16 个一手信源之后，我的结论是：真问题存在，神话更厚。

## 一只不存在的智能手环

2026 年 3 月 15 日，央视 315 晚会播出了一个实验<sup id="fnref:1"><a href="#fn:1" rel="footnote">[1]</a></sup>。

业内人士在某电商平台随机购买了一款叫"力擎 GEO 优化系统"的软件。用它自动写了十几篇智能手环的宣传软文，故意编入虚构信息——包括"量子纠缠传感""黑洞级续航"这种一眼假的卖点。发布两小时后，在某 AI 大模型问"Apollo-9 智能手环怎么样"，模型开始头头是道地介绍起来，连虚构卖点都照搬了。

接着他们用同一软件炮制了 8 篇"专家测评"+2 篇"行业排名"+1 篇"用户测评"，共 11 篇，三天内发布。再问"智能健康手环推荐"——两个 AI 大模型推荐了这款不存在的手环，排名靠前。

力擎的运营者李总（北京力思文化传媒有限公司）在晚会上说得很直白：GEO 业务受热捧，就是能帮客户在 AI 大模型里"喂料投毒"，实现客户的商业目的。

这个实验同时证明了 GEO 的两面性：它确实能让内容被 AI 引用；它也能让谎言被 AI 引用。下面把所有证据分层摆出来。

## GEO 从哪来：40% 的真实边界

GEO 这个词来自一篇 KDD 2024 论文，作者来自印度理工学院德里分校和普林斯顿<sup id="fnref:2"><a href="#fn:2" rel="footnote">[2]</a></sup>。论文做了三件事：为"生成式引擎"定义框架；构建了一万条查询的基准（GEO-bench）；测试了九种优化方法。结论是——引用来源、引用原话、加入统计数字，能让内容的"引用可见度"提升最高 40%<sup id="fnref:2b"><a href="#fn:2" rel="footnote">[2]</a></sup>。

这里需要说清楚 40% 的边界。论文衡量的是"可见度（visibility）"——基于位置调整的引用指标，比如你的内容在 AI 回答里被引用了多少、占了多长篇幅。**不是点击量，更不是收入**。

同年有一个有意思的注脚：维基百科的 GEO 词条挂着"新造词（neologism）"的质疑模板，截至 2026 年初，学术文献里这些词仍然没有共识定义<sup id="fnref:3"><a href="#fn:3" rel="footnote">[3]</a></sup>。AEO、AIO、LLMO 一堆近义词混着用。说白了，这是一个营销词跑在学术词和行业词前面的领域。

## 引擎怎么决定引用谁

Google 官方文档把自家 AI 概览和 AI 模式的机制写得清清楚楚<sup id="fnref:4"><a href="#fn:4" rel="footnote">[4]</a></sup>：两者都基于检索增强生成（RAG），用核心搜索排名系统从同一个索引里检索网页，再交给大模型组织答案。并且有 query fan-out（查询扇出）——一个问题拆成多个子查询。

这意味着两件事：第一，你没进索引，AI 里就没有你——"特殊优化"建立在"能被抓能被收录"这个地基上；第二，你原来为一个关键词优化，现在得为问题树优化。

更有冲击力的动向来自 Cloudflare。2025 年 7 月 1 日，CEO Matthew Prince 宣布"内容独立日"：**默认阻止 AI 爬虫，除非它们付费**<sup id="fnref:5"><a href="#fn:5" rel="footnote">[5]</a></sup>。同一天推出 pay-per-crawl 私测 —— 爬虫要么按 HTTP 402 付费获取内容，要么被拒（Allow/Charge/Block 三档）。Cloudflare 自己点破了这层含义：互联网上"我们爬你、你获得引荐"这个维持了 30 年的契约，已经失效了<sup id="fnref:5b"><a href="#fn:5" rel="footnote">[5]</a></sup>。

## 流量真相：数字盘

Pew Research 2025 年 7 月发布的研究给出了两组关键对比<sup id="fnref:6"><a href="#fn:6" rel="footnote">[6]</a></sup>：

| 指标 | 遇 AI 摘要时 | 无 AI 摘要时 |
|------|-------------|-------------|
| 用户点击传统结果 | 8% 的访问 | 15% 的访问 |
| 直接结束浏览走人 | 26% 的页面 | 16% 的页面 |
| 点击 AI 摘要内链接 | 仅 1% 的访问 | — |

AI 摘要在显著压缩点击量。被引用的百科全书类来源占比 26%，但几乎没人点进去。

Ahrefs 的研究把镜头拉到了搜索排名侧<sup id="fnref:7"><a href="#fn:7" rel="footnote">[7]</a></sup>。三十万关键词样本中，出现 AI 概览时，排名第一页面的点击率比同类无 AI 概览关键词低 34.5%（2025 年 4 月）。2026 年 2 月复测，差距恶化到了 58%。

但这里有个诚实声明：**点击率下降不等于总流量下降**。Google 官方的说法是 AI 概览提升了用户满意度。目前没有公开研究能把因果闭环——那 58% "没点第一名"的用户最后去了 AI 答案里的其他链接、还是什么都没点——这仍是未知<sup id="fnref:8"><a href="#fn:8" rel="footnote">[8]</a></sup>。

另一个冷静的数字：Similarweb 的研究称 AI 聊天机器人引荐流量只占全站访问的约 1%，其中 ChatGPT 占 92.4%<sup id="fnref:9"><a href="#fn:9" rel="footnote">[9]</a></sup>（这条一手页直连失败，待核实）。

## 平台说人话，卖方说神话

Google 官方文档有两句原话<sup id="fnref:4b"><a href="#fn:4" rel="footnote">[4]</a></sup>：

> "要出现在 AI 概览或 AI 模式里，没有额外要求，也不需要特殊优化。"
> "从 Google 的角度，为生成式 AI 搜索做优化，就是为搜索体验做优化，所以这还是 SEO。"

Google 搜索总监 Sullivan 说得更直接："好 SEO 就是好 GEO。"<sup id="fnref:10"><a href="#fn:10" rel="footnote">[10]</a></sup> Illyes 2025 年 7 月也说过类似的："你只需要做正常的 SEO。"

对照一下卖方的话术。Profound（累计融资 $58.5M）的 PR 稿称"部分客户 AI 引荐流量 +700%"<sup id="fnref:11"><a href="#fn:11" rel="footnote">[11]</a></sup>。国内某服务商宣传"语义匹配准确度 99.7%""首月销售 800 万"<sup id="fnref:12"><a href="#fn:12" rel="footnote">[12]</a></sup>——均无验证方法。

最值得点名的一条：业内流传的一份落地指南，引用了一份所谓"OpenAI《GEO 优化团队协作指南》"，称分工得当效率提升 70%——**但我把能搜的引擎都搜了一遍，OpenAI 从来没有发布过这份文件，这是条虚构引用**<sup id="fnref:13"><a href="#fn:13" rel="footnote">[13]</a></sup>。

结构上的利益冲突很清楚：平台靠内容生态繁荣吃饭，所以它劝你别焦虑；服务商靠你的焦虑吃饭，所以它催你赶紧上车。两边都听，但要知道谁在赚你的钱。

## 什么真的有效：三级证据

### 高置信（有研究或官方文件支撑）

- SEO 基本盘：可抓取、可收录、速度快——这是所有 AI 引用的前置条件<sup id="fnref:4c"><a href="#fn:4" rel="footnote">[4]</a></sup>
- 一手、独特、事实性的内容——Google 官方明确说一手评测比复述别人的有优势<sup id="fnref:4d"><a href="#fn:4" rel="footnote">[4]</a></sup>
- 引用来源、引语、统计数字——论文实验证明提升引用可见度超 40%<sup id="fnref:2"><a href="#fn:2" rel="footnote">[2]</a></sup>
- 品牌实体在各渠道的一致性表述
- 在 Reddit、知乎、评测站等第三方语料中的真实存在——CXL 转述的 Semrush 研究发现 ChatGPT 常引用 Google 排名 21 位开外的页面<sup id="fnref:14"><a href="#fn:14" rel="footnote">[14]</a></sup>

### 中置信（有逻辑但证据薄）

- llms.txt：Jeremy Howard 2024 年 9 月提出的建议标准。托管 2 万域名的用户实测报告没有 AI 爬虫来抓。Google 的 Mueller 原话："**据我所知没有任何 AI 服务声明在使用 llms.txt——翻服务器日志就知道，它们连查都不查**"<sup id="fnref:15"><a href="#fn:15" rel="footnote">[15]</a></sup>
- GEO 监测工具："有没有被提及"可测，但"被提及→收入"没人能归因

### 低置信 / 高风险

- 隐藏文本、prompt 注入、刷共识——违反平台政策，315 案已示范法律与监管风险<sup id="fnref:1"><a href="#fn:1" rel="footnote">[1]</a></sup>
- "保证 AI 推荐位"的服务——AI 答案由黑箱+随时变的模型决定，"保证"在技术上讲不通

## 噪声经济：这门生意的钱怎么流动

全球来看，红杉领投的 Profound 累计融资 5850 万美元<sup id="fnref:11"><a href="#fn:11" rel="footnote">[11]</a></sup>。国内，弯弓研究院追踪到 110 多家 GEO 服务商，其中拿到过融资的只有约 19 家，合计 55 亿元，渗透率不到 15%<sup id="fnref:16"><a href="#fn:16" rel="footnote">[16]</a></sup>。它自己还点破了一句：很多公司融资时讲的是 GEO 的故事，资本投的其实是它原来的营销业务——"GEO 更像是讲给市场听的新故事"。

营销数字流水线也在运转：无署名机构造出"71% 企业已入局""转化率提升 2.8 倍"，被转载、进内参、变决策依据——全程没有一个可核验的原始出处。我连自己库里的旧蜂群报告都翻了一遍，里面"AI 流量年增 693%""转化率高 4.4 倍"的数字，追到源头全是厂商博客<sup id="fnref:17"><a href="#fn:17" rel="footnote">[17]</a></sup>。

## 最后，你能做的

今天就能做三件事：确认自己的网站能被正常收录<sup id="fnref:4"><a href="#fn:4" rel="footnote">[4]</a></sup>；把产品关键事实页写成问题-答案结构，填上一手数据；给自己建一个 20 个问题的清单，每周问一遍主流 AI，记录它提没提到你——当自己的监测工具。

别买的是这四样：保证 AI 推荐位的服务、无出处的"XX% 提升"案例集、llms.txt 一键部署神器、拿虚构信源做背书的方案。

说到底，GEO 的核心方法论——让 AI 更好地认识你——大部分是好 SEO 的老手艺加一点新认知。真正的分水岭不在技术：你是想被 AI 准确引用的内容创作者，还是想给 AI 投毒的人。315 之后，这个选择不只是道德问题，是法律问题。

*English version: [GEO, Two Years In: What 16 Primary Sources Reveal About the Truth, the Lies, and the Money](/tech/geo-two-years-en)*

---

<ol>
  <li id="fn:1" style="font-size:0.875rem">
    央视 315 晚会《AI大模型遭"投毒"？给AI"洗脑"已成产业链》，2026-03-15。腾讯新闻/猎云网转述：<a href="https://news.qq.com/rain/a/20260315A073XU00">news.qq.com/rain/a/20260315A073XU00</a> <a href="#fnref:1" rev="footnote">↩</a>
  </li>
  <li id="fn:2" style="font-size:0.875rem">
    Aggarwal et al. <em>GEO: Generative Engine Optimization</em>. KDD 2024, doi:10.1145/3637528.3671900. arXiv:<a href="https://arxiv.org/abs/2311.09735">2311.09735</a>. 全文 html: <a href="https://arxiv.org/html/2311.09735v3">arxiv.org/html/2311.09735v3</a> <a href="#fnref:2" rev="footnote">↩</a>
  </li>
  <li id="fn:3" style="font-size:0.875rem">
    Wikipedia, <em>Generative engine optimization</em>, 截至 2026-08 挂 neologism 模板；"学术文献截至 2026 年初无共识定义"。<a href="https://en.wikipedia.org/wiki/Generative_engine_optimization">en.wikipedia.org/wiki/Generative_engine_optimization</a> <a href="#fnref:3" rev="footnote">↩</a>
  </li>
  <li id="fn:4" style="font-size:0.875rem">
    Google Search Central, <em>Optimizing for generative AI</em> + <em>AI features</em>：「There are no additional requirements nor special optimizations necessary.」2026 年仍在线更新。<a href="https://developers.google.com/search/docs/fundamentals/ai-optimization-guide">developers.google.com/search/docs/fundamentals/ai-optimization-guide</a> <a href="#fnref:4" rev="footnote">↩</a>
  </li>
  <li id="fn:5" style="font-size:0.875rem">
    Cloudflare Blog: <em>Content Independence Day: no AI crawl without compensation</em> (2025-07-01), <em>Introducing pay per crawl</em> (2025-07-01), <em>Your site, your rules</em> (2026-07-01). <a href="https://blog.cloudflare.com/content-independence-day-no-ai-crawl-without-compensation/">blog.cloudflare.com/...</a> <a href="#fnref:5" rev="footnote">↩</a>
  </li>
  <li id="fn:6" style="font-size:0.875rem">
    Pew Research Center, <em>Google users are less likely to click on links when an AI summary appears</em>, 2025-07-22. <a href="https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/">pewresearch.org/...</a> <a href="#fnref:6" rev="footnote">↩</a>
  </li>
  <li id="fn:7" style="font-size:0.875rem">
    Ryan Law &amp; Xibeijia Guan, Ahrefs: <em>AI Overviews Reduce Clicks by 34.5%</em> (2025-04-17)；<em>Update: AI Overviews Reduce Clicks by 58%</em> (2026-02-04). 30 万关键词, GSC CTR.<a href="https://ahrefs.com/blog/ai-overviews-reduce-clicks/">ahrefs.com/...</a> <a href="#fnref:7" rev="footnote">↩</a>
  </li>
  <li id="fn:8" style="font-size:0.875rem">
    诚实的因果缺口：Ahrefs 测的是"有 AI Overivew 时第一名 CTR 更低"；Google 官方称 AI Overviews 提升满意度。点击去了哪里（其他结果/AI 内链/零点击）——无公开全链路归因。此为推断。 <a href="#fnref:8" rev="footnote">↩</a>
  </li>
  <li id="fn:9" style="font-size:0.875rem">
    Similarweb / authoritytech.io 转述："AI 引荐流量约占全站访问 1%，ChatGPT 占 92.4%"。一手页（similarweb.com）直连 SSL 失败，降级为待核实。 <a href="#fnref:9" rev="footnote">↩</a>
  </li>
  <li id="fn:10" style="font-size:0.875rem">
    Danny Goodwin, Search Engine Land: <em>Google's Danny Sullivan: "Good SEO is good GEO"</em>, 2025-09-02. Keynote at WordCamp US 2025-08-28. <a href="https://searchengineland.com/google-danny-sullivan-good-seo-good-geo-461464">searchengineland.com/...</a> <a href="#fnref:10" rev="footnote">↩</a>
  </li>
  <li id="fn:11" style="font-size:0.875rem">
    Profound PR Newswire, 2025-08-12：$35M Series B led by Sequoia, total $58.5M. "700 percent increase in AI referrals in some cases" 为厂商宣传口径。 <a href="https://www.prnewswire.com/news-releases/profound-raises-35m-series-b-as-ai-search-becomes-the-next-platform-shift-302527764.html">prnewswire.com/...</a> <a href="#fnref:11" rev="footnote">↩</a>
  </li>
  <li id="fn:12" style="font-size:0.875rem">
    智推时代融资稿，搜狐 2025-10-29（三七互娱领投、趣睡科技跟投）。其落地指南声称"语义匹配 99.7%""搜索量+220%""首月销售 800 万"——无验证方法。 <a href="https://www.sohu.com/a/949150771_121419396">sohu.com/a/...</a> <a href="#fnref:12" rev="footnote">↩</a>
  </li>
  <li id="fn:13" style="font-size:0.875rem">
    "OpenAI《GEO 优化团队协作指南》(2026-02)" 出现在知识库内流传的《企业品牌 GEO 优化完整落地指南》中。多引擎（DDG/Bing/Google）精确短语检索零命中。判定为虚构引用。 <a href="#fnref:13" rev="footnote">↩</a>
  </li>
  <li id="fn:14" style="font-size:0.875rem">
    Tarek Reslan, CXL: <em>Is AEO/GEO Just SEO Hype? What the Data Actually Shows</em>, 2026-01-27.<a href="https://cxl.com/blog/aeo-geeo-seo-reality-check/">cxl.com/blog/\...</a> 该文转述了 Semrush 研究发现。 <a href="#fnref:14" rev="footnote">↩</a>
  </li>
  <li id="fn:15" style="font-size:0.875rem">
    Roger Montti, Search Engine Journal: <em>Google Says LLMs.Txt Comparable To Keywords Meta Tag</em>, 2025-04-17。原文引用 Mueller：「AFAIK none of the AI services have said they're using LLMs.TXT (and you can tell when you look at your server logs that they don't even check for it).」<a href="https://www.searchenginejournal.com/google-says-llms-txt-comparable-to-keywords-meta-tag/544804/">searchenginejournal.com/544804</a> <a href="#fnref:15" rev="footnote">↩</a>
  </li>
  <li id="fn:16" style="font-size:0.875rem">
    弯弓研究院，腾讯新闻 2026-07-17：追踪 110+ 家 GEO 服务商，仅 ~19 家获 21 笔融资合计 55 亿元，渗透率 <15%。该院自身有图谱/评选/白皮书业务，利益相关已标注。<a href="https://news.qq.com/rain/a/20260717A055M100">news.qq.com/rain/a/20260717A055M100</a> <a href="#fnref:16" rev="footnote">↩</a>
  </li>
  <li id="fn:17" style="font-size:0.875rem">
    库内 2026-05-29 蜂群报告（swarm_reports/2026-05-29_geo-ad/）曾采信的 "35% 额外点击 /4.4x 转化 /693% 增长 /50.5% CAGR"——本次复核追踪至 Searchable、AirOps、Moz 等厂商博客，未过一手源标准，降级为待核实。本文不引用这些数字。 <a href="#fnref:17" rev="footnote">↩</a>
  </li></ol>