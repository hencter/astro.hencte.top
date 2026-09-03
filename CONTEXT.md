# CONTEXT.md — astro.hencte.top 领域术语表

> 本文档定义本蜂群的领域特定语言 (Ubiquitous Language)。
> 所有代理和 Skill 应使用统一的术语，避免歧义。

## 调度与执行

| 术语 | 英文 | 定义 |
|------|------|------|
| 蜂群指挥官 | Swarm Commander | 主代理，负责拆解任务和调度子代理，不直接编码 |
| 子代理 | SubAgent | 通过 Task tool 调用的独立代理，执行具体任务 |
| 原子任务 | Atom Task | 不可再分的最小任务单元 |
| 依赖树 | Dependency Tree | 原子任务之间依赖关系的有向图 |
| 北极星目标 | North Star | 本轮调度的最高优先级目标 |
| 精锐代理 | Registered Agent | 已固化到 `.opencode/agent/` 的高频代理 |
| 交叉审核 | Cross Audit | 两个独立代理对同一问题给出结论并相互校验 |
| 收敛节点 | Convergence Node | `swarm-convergence` 代理，负责整合多代理输出 |
| WIP | Work In Progress | 当前正在执行的子代理数 |
| Sprint | Sprint | 一轮完整的 Decompose → Focus → Convergence 循环 |
| DoD | Definition of Done | 任务完成标准（产出已归档 + index.md 已更新） |
| Backlog | Backlog | AGENTS.md 中的待办事项列表 |

## 知识管理

| 术语 | 英文 | 定义 |
|------|------|------|
| 维基链接 | Wikilink | `[[文件名]]` 格式的跨文件知识关联 |
| 记忆固化 | Memory Solidification | 将会话中的重要发现写入 `agent_memory/` |
| 经验沉淀 | Lessons Learned | 写入 `agent_memory/lessons_learned.md` 的可复用经验 |
| 代理固化 | Agent Solidification | 将高频临时代理转为注册代理 |
| 自举进化 | Self-Evolution | 系统通过审查自身流程来改进自身 |

## 站点领域

| 术语 | 英文 | 定义 |
|------|------|------|
| 博客 | Blog | `src/content/blog/` 下的技术文章，分 4 个 section |
| 小说 | Novel | `src/content/novel/` 下的原创小说章节；公开路由主路径为 `/shelf/`（旧 `/novel/` 永久重定向） |
| 书架 | Shelf | `/shelf` 作品库索引页：封面朝前，分区含原创与教程钩子 |
| 连接页 | Connect Page | `src/content/connect/` 下的 i18n 静态页面内容 |
| 布局 | Layout | `src/layouts/` 下的 Astro 布局组件 |
| 设计系统 | Design System | `src/styles/global.css` 中定义的 CSS 自定义属性体系 |
| 古籍 | Ancient | `src/content/blog/ancient/` 下的古文内容，使用 Heti 排版 |
| 品牌手记 | Brand Notes | `/pages` 路由的静态页面 |

## SEO/GEO 领域

| 术语 | 英文 | 定义 |
|------|------|------|
| 结构化数据 | Structured Data | JSON-LD 格式的 Schema.org 标记 |
| llms.txt | llms.txt | `public/llm.txt` —— LLM/AI 爬虫友好的站点描述文件 |
| 面包屑导航 | BreadcrumbList | JsonLD 组件中的 Schema.org 面包屑结构 |
| 规范链接 | Canonical URL | 防止重复内容的首选 URL |
| hreflang | hreflang | i18n 页面间的语言关系标记 |

## 性能领域

| 术语 | 英文 | 定义 |
|------|------|------|
| CWV | Core Web Vitals | LCP, INP, CLS 三项核心性能指标 |
| LCP | Largest Contentful Paint | 最大内容绘制时间 |
| CLS | Cumulative Layout Shift | 累计布局偏移 |
| 视图过渡 | View Transitions | Astro 的 SPA 式页面切换动画 |
| 预取 | Prefetch | 提前加载用户可能访问的页面资源 |

## 运维领域

| 术语 | 英文 | 定义 |
|------|------|------|
| 新鲜度 | Content Freshness | 内容最后一次更新的距今时间 |
| 死链 | Dead Link / Broken Link | 返回 404 或其他错误的链接 |
| GA4 | Google Analytics 4 | 站点分析工具 |
| 搜索控制台 | Search Console | Google Search Console |
| 印象 | Impression | 搜索结果中出现但未被点击的次数 |
