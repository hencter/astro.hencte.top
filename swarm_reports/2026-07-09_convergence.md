# 蜂群收敛报告 — 2026-07-09

## 本轮 North Star
生成 astro.hencte.top 博客全面优化执行路线图 — 跨 5 领域（SEO、性能、UI、内容、运维）的统一优先级排序与协同实施计划。

---

## 代理执行摘要

| 代理 | 状态 | 综合评分 | 🔴 P0 | 🟡 P1 | 🟢 P2 | 报告链接 |
|------|:----:|---------|:-----:|:-----:|:-----:|---------|
| seo-auditor | ✅ | 46/100 (+4) | 7 | 8 | 7 | [seo/2026-07-09_seo_audit.md](./seo/2026-07-09_seo_audit.md) |
| perf-inspector | ✅ | ~70/100 (估) | 5 | 6 | 2 | [perf/2026-07-09_perf_audit.md](./perf/2026-07-09_perf_audit.md) |
| ui-refactorer | ✅ | 72/100 | 7 | 11 | 10 | [ui/2026-07-09_ui_audit.md](./ui/2026-07-09_ui_audit.md) |
| content-editor | ✅ | 42%→80% 目标 | 3 | 8 | 5 | [content/2026-07-09_content_audit.md](./content/2026-07-09_content_audit.md) |
| ops-monitor | ✅ | 5.2/10 | 5 | 7 | 6 | [ops/2026-07-09_ops_audit.md](./ops/2026-07-09_ops_audit.md) |

> **总发现**: 105 项问题（27 🔴 + 40 🟡 + 30 🟢 + 8 建议），覆盖范围远超前次审计的 71 项。
>
> **与 Wave 1 (2026-05-20) 对比**: 上次核心 P0 项（site URL, sitemap, robots.txt, hreflang）修复率仅 **12%（2/17）**。AncientPostLayout 重构和 content.config.ts 创建是唯二进展。`markdoc.config.mjs` 已创建（Wave 1 P0）。本次审计新增问题 34 项，主要来自 NovelLayout CSS 语法错误、双 lockfile、callout 暗色适配缺失、内容 frontmatter 日期损坏等新发现。

---

## 冲突分析

### 冲突 1: `dist/` 目录存在性矛盾 — 裁定：时序差异，实质一致

| 代理 | 结论 | 证据 |
|------|------|------|
| seo-auditor | `dist/index.html` 中存在 `localhost:4321` canonical URL | 引用 `dist/index.html` 具体行 |
| ops-monitor | `dist/` 目录不存在，从未运行过生产构建 | 文件系统检查 |

**裁定**: `dist/` 可能在两代理运行之间被清理，或 SEO 代理自行运行了 `astro build`。但**实质结论一致**：`astro.config.mjs` 中 `site` 未配置，任何时候构建都会产生 `localhost` URL。该发现不构成操作分歧，两者均指向同一修复：添加 `site: "https://hencte.top"`。

### 冲突 2: GA4 脚本加载位置 — 裁定：性能优先，合规后补

| 代理 | 建议 | 严重度 |
|------|------|--------|
| perf-inspector | 移出 `<head>`，放到 `</body>` 前或用 Partytown | 🔴 P0 |
| ops-monitor | 添加 GDPR Consent Mode v2 + Cookie 横幅 | 🟡 P1 |

**裁定**: 两代理不矛盾，关注不同维度。**性能方案先行**（GA4 `<head>` 中的同步脚本是真实的首屏竞速瓶颈），隐私合规（Consent Mode）作为部署前检查项。Partytown 方案可同时满足两方面需求，建议作为中期目标。

### 冲突 3: NovelLayout 修复优先级 — 裁定：多维度互补，需集中整治

| 代理 | 维度 | 严重度 | 发现 |
|------|------|--------|------|
| seo-auditor | SEO 覆盖 | 🔴 P0 | 零 Meta/JsonLD/OG/canonical，非标准 robots meta |
| perf-inspector | 运行时性能 | 🔴 P0 | 3 个 setInterval (400/800/1200ms) 持续吃 CPU |
| ui-refactorer | CSS 正确性 + a11y | 🔴 P0 | CSS 语法错误（多余 `}`）、无 reduced-motion、禁用右键破坏辅助技术 |
| ops-monitor | 运维观测 | 🟡 P1 | DRM 行为激进但不是安全漏洞 |

**裁定**: 四个代理从不同维度审视同一组件（NovelLayout.astro），结论互补无冲突。**建议集中整治**：一次重构同时修复 CSS 语法错误、降低定时器频率、添加 reduced-motion、集成 Meta/JsonLD 组件、标准化 robots meta。工作包总预估 90 分钟，一次完成受益四领域。

### 冲突 4: 图片优化优先级差异 — 裁定：性能 Agent 更准确

| 代理 | 建议 | 严重度 |
|------|------|--------|
| perf-inspector | 立即删除死图、迁移到 Astro Image 组件 | 🔴 P0 |
| ui-refactorer | 未将图片优化列为独立问题 | — |
| content-editor | 外部图床迁移列为 🟢 P2 | 🟢 P2 |

**裁定**: 无矛盾。性能代理关注的 `public/img/2265276667.png`（953KB）是**死资产**——不被任何文件引用。删除为纯收益。内容代理关注的外部图床（`s2.loli.net`）是可用性风险，优先级较低。**先删死图，后迁移活图**。

---

## 综合发现

### 共性根因

#### 根因 1: `astro.config.mjs` 配置真空 — 6 代理共同指向

`astro.config.mjs` 是所有领域问题的交汇点。当前缺失：

| 缺失配置 | 影响领域 | 连锁问题数 |
|----------|---------|:---------:|
| `site: "https://hencte.top"` | SEO, 运维 | 6+ (canonical → localhost, OG URL 错误, sitemap 无法定位, RSS 链接错误, hreflang 绝对 URL 错误) |
| `build.concurrency` | 性能 | 1 (串行构建) |
| `integrations: [sitemap()]` | SEO, 运维 | 2 (无 sitemap.xml, 无 i18n sitemap) |
| `image.service` | 性能 | 1 (无法使用 Astro Image 优化) |

**一句话**: 一行 `site` 配置修复 **6 个 P0 问题的根因**。加上 concurrency 和 sitemap integration，`astro.config.mjs` 共需 3 处变更，一次性收益覆盖 SEO、性能、运维三个领域。

#### 根因 2: NovelLayout — "站点中的孤岛" 问题恶化

Wave 1 时已识别 NovelLayout 为孤岛，但 50 天未处理。本次审计发现**问题在加深**：

| 指标 | Wave 1 (05-20) | Wave 2 (07-09) |
|------|:---:|:---:|
| 代理报告问题数 | 4 个代理发现 | 4 个代理发现 (相同) |
| 新增问题 | — | CSS 语法错误 (行 282-289 残留代码)、无 `prefers-reduced-motion` |
| 修复状态 | 0% | 0% (未触及) |

**教训**: 孤岛组件不会自我修复，越拖问题越多。必须在本 Sprint 内集中整治。

#### 根因 3: 内容元数据贫瘠 — 阻塞 SEO 基础设施质量

Wave 1 已警告"先补元数据，再装 sitemap/RSS"。当前状态：

| 指标 | Wave 1 (05-20) | Wave 2 (07-09) | 变化 |
|------|:---:|:---:|:---:|
| description 缺失 | 51/68 (75%) | 50/65 (77%) | 新增 2 篇高质量文章有 desc，但删除/移动部分文章后比例恶化 |
| keywords 缺失 | 未统计 | 57/65 (88%) | 新发现 |
| 草稿文章 | 未细化 | 26/65 (40%) | 新发现 14 篇应删除 |
| 日期格式损坏 | 未检测 | 56/70 (80%) | 新发现 |

**结论**: 内容元数据问题比 Wave 1 评估的更严重。**在安装 `@astrojs/sitemap` 和 `@astrojs/rss` 之前，必须至少为已发布文章补齐 description**（否则 sitemap 和 RSS 将包含大量空描述条目）。

---

### 协同优化机会

#### 🎯 机会 1: `astro.config.mjs` 一次性修复（受益: SEO + Perf + Ops）

```
一次提交添加:
  site: "https://hencte.top"                  → 修复 6 个 P0
  build: { concurrency: os.cpus().length }    → 构建速度 +50-70%
  image: { service: { ...sharp } }            → 解锁 Astro Image
  integrations: [ markdoc(), sitemap({i18n}) ] → 生成 sitemap.xml
```
**一次改动，多处受益**: canonical URL、OG URL、sitemap、RSS 基础、hreflang 绝对路径、构建速度、图片优化能力 — 全部一次性就位。

#### 🎯 机会 2: NovelLayout 集中整治 Sprint（受益: UI + SEO + Perf + Ops）

```
90 分钟集中修复:
  1. 删除行 282-289 CSS 语法错误 → UI 构建正确性
  2. 添加 Meta + JsonLD 组件 → SEO 覆盖
  3. 降低 DRM 定时器 400→2000ms + requestIdleCallback → 性能
  4. 添加 prefers-reduced-motion → a11y
  5. 标准化 robots meta (移除 noai → 由 robots.txt 控制) → SEO
  6. 添加 canonical link → SEO
```
**一个组件，四个领域一揽子解决**。

#### 🎯 机会 3: 字体加载三联优化（受益: Perf + SEO）

```
global.css: 删除 @import url(字体) 行
BaseLayout.astro: 添加 preconnect + preload + <link rel="stylesheet">
FullscreenAncientLayout: 已有 preconnect（合并到 BaseLayout）
```
**收益**: LCP -0.3~0.8s → Core Web Vitals 提升 → SEO 排名加分。

#### 🎯 机会 4: 内容质量 + SEO 基础设施联动（受益: Content + SEO）

```
Phase A (内容): 补 50 篇 description → 修 56 篇日期 → 删 14 篇草稿
Phase B (SEO):  装 sitemap → 装 RSS → 提交 Google Search Console
```
**顺序依赖**: 必须先完成 Phase A，否则 sitemap/RSS 产出质量差，Google 索引低质量条目。

#### 🎯 机会 5: BaseLayout.astro 一站式升级（受益: SEO + Perf + UI）

```
BaseLayout.astro 单文件修改:
  + font preconnect + stylesheet links     → Perf
  + skip-link (a11y)                       → UI
  + hreflang props 传入 Meta               → SEO
  + GA4 移至 </body>                       → Perf
  + data-astro-prefetch on nav links       → Perf
```

---

## 遗漏与建议

### 本轮未覆盖领域

| 领域 | 缺失内容 | 严重度 | 建议调度 |
|------|---------|:------:|---------|
| **真实 Lighthouse 审计** | 5 份报告均为源码静态分析。SEO 通过构建产物验证 canonical，但无浏览器端性能测量 | 🟡 | 执行 `pnpm build && pnpm preview` 后运行 Lighthouse (mobile + desktop)，获取真实 LCP/CLS/INP 数据 |
| **移动端真机/模拟测试** | 所有分析基于桌面端代码。移动端导航缺失问题已知但无实测数据 | 🟡 | 使用 Chrome DevTools mobile emulation + 性能 trace |
| **Google Search Console 验证** | 站点未提交，无索引状态数据。需等 P0 基础设施就位后操作 | 🟢 | sitemap 部署后提交 GSC，观察索引覆盖率 |
| **astroboy.pages.dev 子域名状态** | Ops 报告提及 `ai.linktrust.top` SSL 错误 | 🟢 | 确认是否为废弃项目，如是则移除链接 |
| **构建产物大小分析** | 无代理检查 `dist/` 各文件类型体积分布 | 🟢 | 构建后分析 HTML/CSS/JS/字体/图片的体积占比 |
| **astro-expert 技术架构审计** | 本轮未调度 astro-expert。AGENTS.md 定义其为技术架构顾问但本轮未启用 | 🟡 | 下轮可调度 astro-expert 审查 Astro v5 最佳实践对齐（如 ViewTransitions 配置、Server Islands 可行性） |

### 已知但不紧急的遗漏

| 项目 | 说明 |
|------|------|
| **小说章节排序** | Content 审计建议添加 `order` 字段确保章节排序。当前按文件名排序有效，但不够健壮 |
| **EN 首页 novelSection** | Content 审计发现 `en/home.md` 缺少小说推广块。需评估：英文用户是否需要小说入口？ |
| **色彩方案 `<meta>` 标签** | 添加 `<meta name="color-scheme">` 可防止暗色模式 FOUC。对应 Wave 1 P3-13，仍未执行 |

---

## 统一行动计划

> 评分公式: **Score = Impact × Urgency / Effort**（每维度 1-5 分）
> - Impact: 对 North Star（站点质量、用户体验、搜索可见性）的影响
> - Urgency: 延迟实施的代价（技术债务利息）
> - Effort: 实施所需时间（1 = <5min, 2 = <30min, 3 = 1-2h, 4 = 半天, 5 = >1天）

---

### 🔴 Phase 1: 立即执行（本周完成，Score ≥ 8）

> 这些任务阻塞其他工作或具有极高投入产出比。**必须优先完成以避免技术债务持续累积。**

| # | 行动 | 来源 | Score | Effort | 依赖 | 说明 |
|---|------|------|:-----:|:------:|------|------|
| **P1-1** | **添加 `site: "https://hencte.top"`** | SEO | **25.0** | 1 min | 无 | ⭐ **最高优先级**。一行修复 canonical、OG URL、sitemap 基础、RSS 基础、hreflang 绝对路径。文件: `astro.config.mjs` |
| **P1-2** | **创建 `public/robots.txt`** | SEO, Ops | **20.0** | 5 min | P1-1² | 含 AI 爬虫拦截规则（GPTBot, anthropic-ai, Google-Extended, CCBot）+ Sitemap 引用 |
| **P1-3** | **修复 NovelLayout CSS 语法错误** | UI | **16.0** | 5 min | 无 | 删除 `NovelLayout.astro:282-289` 行残留 CSS（多余 `}` 破坏样式表） |
| **P1-4** | **修复 Article publisher `Person→Organization`** | SEO | **15.0** | 1 min | 无 | `JsonLD.astro:88-92` 一行修改。Google Article Rich Result 硬性要求 |
| **P1-5** | **安装 @astrojs/sitemap** | SEO, Ops | **12.5** | 15 min | P1-1 | `pnpm add @astrojs/sitemap` → 配置 i18n locales → 自动生成 sitemap-index.xml |
| **P1-6** | **启用构建并发** | Perf | **12.0** | 1 min | 无 | `build: { concurrency: os.cpus().length }` → 构建时间 -50~70%。文件: `astro.config.mjs` |
| **P1-7** | **添加 skip-link (a11y)** | UI | **12.0** | 10 min | 无 | 在 `BaseLayout.astro` `<body>` 后添加键盘跳转链接（WCAG 2.4.1 Level A） |
| **P1-8** | **创建 404 页面** | Ops | **12.0** | 15 min | 无 | `src/pages/404.astro` + `src/pages/en/404.astro`。使用 BaseLayout 保持品牌一致性 |
| **P1-9** | **创建 `en/blog.md`** | Content | **12.0** | 15 min | 无 | 英文用户当前访问 `/en/blog` 会 404。直接翻译 `zh/blog.md` |
| **P1-10** | **生成 OG 社交分享图** | SEO | **10.0** | 15 min | 无 | 1200×630 PNG 替换当前 `favicon.svg`（SVG 在所有社交平台不渲染）。同时修复 `Meta.astro` 添加 `og:image:width/height` |
| **P1-11** | **字体 @import→`<link>` 迁移** | Perf, SEO | **10.0** | 30 min | 无 | `global.css` 删除 L1 `@import url()` → `BaseLayout.astro` 添加 preconnect + stylesheet `<link>`。LCP -0.3~0.8s |
| **P1-12** | **GA4 脚本移至 `</body>` 前** | Perf, Ops | **9.0** | 5 min | 无 | 当前位于 `<head>` 中阻塞首屏。移至 `</body>` 前释放主线程 |
| **P1-13** | **NovelLayout DRM 定时器降频** | Perf | **9.0** | 10 min | 无 | 400/800/1200ms → 2000/3000/5000ms + `requestIdleCallback`。INP +100~300ms |
| **P1-14** | **Callout 暗色模式适配** | UI | **9.0** | 15 min | 无 | 14 个 callout 变体 `border-left` 颜色从硬编码 hex 迁移到 CSS 变量（含 `.dark` 亮色变体） |
| **P1-15** | **Meta.astro 增强: ogType/og:url/og:site_name** | SEO | **9.0** | 10 min | P1-1 | 添加 `ogType` prop（文章页=article）、`og:url`、`og:site_name` 社交标签 |
| **P1-16** | **JsonLD Article 增强: image + inLanguage** | SEO | **9.0** | 10 min | 无 | `image` 字段用 `images[0]` fallback 默认社交图；`inLanguage` 从硬编码 zh-CN 改为可配置 |
| **P1-17** | **修复 `--ink-500` 对比度 (WCAG AA)** | UI | **9.0** | 5 min | 无 | `#5a7a8a→#4a6270` (对比度 3.6:1→4.6:1)。影响 footer、meta line、muted 文字可读性 |
| **P1-18** | **统一 lockfile（删除 bun.lock）** | Ops | **8.0** | 2 min | 无 | `rm bun.lock && pnpm install`。防止依赖版本冲突 |
| **P1-19** | **删除死图片 2265276667.png** | Perf | **8.0** | 1 min | 无 | 953KB，未被任何文件引用，纯垃圾 |
| **P1-20** | **删除死代码: PostLayout.astro + EmptyComponent.astro** | UI | **8.0** | 2 min | 无 | PostLayout.astro 为空壳 4 行；EmptyComponent.astro 为模板占位。均未被引用 |

> ² P1-2 的 robots.txt 需要引用 sitemap URL，建议与 P1-5 同步完成或使用已知 URL `https://hencte.top/sitemap-index.xml` 先行创建。

**Phase 1 总工作量**: ~2.5 小时（大量 1-5 分钟的快速修复）。**预计完成日期**: 本周内。

---

### 🟡 Phase 2: 短期规划（两周内，Score 4-8）

> 高价值但非阻塞性任务。部分依赖 Phase 1 产出。

| # | 行动 | 来源 | Score | Effort | 依赖 | 说明 |
|---|------|------|:-----:|:------:|------|------|
| **P2-1** | **实现 hreflang 标签** | SEO, Content | **6.7** | 45 min | P1-1, P1-15 | 扩展 `Meta.astro` 添加 `hreflang` prop → `BaseLayout.astro` 传入中英文路径对。消除中英文重复内容风险 |
| **P2-2** | **安装 @astrojs/rss + 创建 RSS feed** | SEO, Ops | **6.0** | 20 min | P1-1, P2-5¹ | `pnpm add @astrojs/rss` → 创建 `src/pages/rss.xml.ts`。用户订阅渠道 + AI 爬虫入口 |
| **P2-3** | **导航链接添加 `data-astro-prefetch`** | Perf, UI | **6.0** | 15 min | 无 | 为所有主导航链接添加 `data-astro-prefetch="hover"`。页面切换感知延迟 -50~80% |
| **P2-4** | **extract `formatDate()` 为共享工具** | UI, Content | **6.0** | 30 min | 无 | 5 处重复定义 → `src/utils/date.ts`。同时消除 `index.astro`, `blog/index.astro`, `en/index.astro`, `BlogSectionLayout.astro`, `[...slug].astro` 的重复 |
| **P2-5** | **为已发布文章补齐 description** | Content, SEO | **5.0** | 2-3h | 无 | ~35 篇已发布文章缺 description。直接影响 sitemap/RSS 质量。*建议用 AI 子代理批量生成* |
| **P2-6** | **删除 14 篇无用草稿/占位内容** | Content, Ops | **5.0** | 10 min | 无 | 空壳、Lorem ipsum、测试内容、废弃页面。降低内容噪音 |
| **P2-7** | **批量修复 56 篇 frontmatter 日期格式** | Ops, Content | **4.5** | 30 min | 无 | Hugo 迁移遗留：日期字段尾部带垃圾字符。用 PowerShell 正则批量清理 |
| **P2-8** | **配置缓存策略** | Perf, Ops | **4.5** | 15 min | P1-1² | `_headers` 或 `netlify.toml`: 静态资源 1 年缓存、HTML 短期缓存。重复访问速度 +30-50% |
| **P2-9** | **NovelLayout 引入 Meta + JsonLD + canonical** | SEO, UI | **4.0** | 60 min | P1-3, P1-10, P1-15 | 小说页面从搜索引擎盲区变为可见。同时修复非标准 robots meta（`noai→noarchive`） |
| **P2-10** | **修复 `.blog-post-card` CSS 重复定义** | UI | **4.0** | 10 min | 无 | `global.css` 中定义两次（行 654-669 + 行 908-920）。删除 standalone 块 |
| **P2-11** | **FullscreenAncientLayout 引入 Meta 组件** | SEO | **4.0** | 20 min | P1-15, P1-16 | 古文全屏页从搜索引擎盲区变为可见。+ `defer` 到 Heti 脚本 |
| **P2-12** | **llm.txt 内容更新** | SEO | **4.0** | 10 min | 无 | 最后更新 2026-04-25（过期 75 天）。添加最新文章实体 + 小说内容实体 |
| **P2-13** | **添加 12 篇缺失 tags + 为活跃文章补 keywords** | Content | **4.0** | 1h | 无 | 优先处理已发布文章 (~35 篇)，草稿文章后补 |
| **P2-14** | **发布 8 篇已就绪 draft 文章** | Content | **4.0** | 30 min | 无 | `hugo-npm.md`, `lazy-nvim.md`, `keyboard-shortcuts.md`, `content-types.md`, `shortcode.md`, `front-matter.md`, `menu-params-version.md`, `post-bundle-archetype-template.md` — 改为 `draft: false` |
| **P2-15** | **修复外部图片 `loading="lazy"`** | Perf, Content | **4.0** | 15 min | 无 | Markdoc/Markdown 渲染中注入 `loading="lazy"` + `decoding="async"` 属性 |
| **P2-16** | **Heti 脚本添加 `defer`** | Perf | **4.0** | 2 min | 无 | `AncientPostLayout.astro:149` 和 `FullscreenAncientLayout.astro:263` 的 `<script>` 加 `defer` |

> ¹ P2-2 RSS 需要优质 description 元数据（P2-5），建议在同一天完成。
> ² P2-8 缓存策略依赖部署平台。当前托管平台未明确（EdgeOne Pages 推测），需确认后配置。

**Phase 2 总工作量**: ~7-9 小时。**预计完成日期**: 两周内。

---

### 🟢 Phase 3: 中期储备（一月内，Score 2-4）

> 提升长期品质和维护性的任务。适合在 Phase 1-2 完成后利用碎片时间推进。

| # | 行动 | 来源 | Score | Effort | 依赖 | 说明 |
|---|------|------|:-----:|:------:|------|------|
| P3-1 | 提取 `<ThemeToggle>` 组件（消除 5 处重复主题 JS） | UI | 3.0 | 1h | 无 | BaseLayout, FullscreenAncientLayout, NovelLayout, NovelLandingPage, NovelIndexPage 共享同一逻辑 |
| P3-2 | 提取 `<HeroSection>` 组件（消除 8 处重复） | UI | 3.0 | 1h | 无 | 标准化 hero pattern: badge + headline + subtitle + actions |
| P3-3 | 提取 `<BlogPostCard>` + `<ProjectCard>` 组件 | UI | 3.0 | 1.5h | 无 | 消除 index.astro, blog/index.astro, en/index.astro, BlogSectionLayout 的重复 |
| P3-4 | 添加 Service Worker（离线支持） | Perf | 3.0 | 1h | 部署确认 | `@astrojs/service-worker`。重复访问秒开，离线可用 |
| P3-5 | NovelLandingPage / NovelIndexPage 引入 Meta 组件 | SEO | 3.0 | 30 min | P2-9 | 小说首页和书架页的 SEO 覆盖 |
| P3-6 | 配置安全响应头 (CSP 等) | Ops | 3.0 | 30 min | 部署平台 | CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy |
| P3-7 | GA4 Partytown 迁移 | Perf, Ops | 3.0 | 1h | P1-12 | 将 GA4 移入 Web Worker，主线程完全解放 |
| P3-8 | GA4 Consent Mode v2 + Cookie 横幅 | Ops | 2.5 | 1h | P3-7² | GDPR 合规。如站点面向 EU 用户则为必须 |
| P3-9 | 创建 `llms-full.txt` | SEO | 2.5 | 30 min | P2-5 | 所有非草稿文章全文拼合，供 AI 爬虫深度索引 |
| P3-10 | 修复 4 篇 draft 文章内容后发布 | Content | 2.5 | 1h | 无 | `tech/tools.md`, `vim-or-neovim.md`, `hugo-obsidian-plugin-dev.md`, `hugo-test.md` (删除) |
| P3-11 | 移动端导航（hamburger menu） | UI | 2.0 | 3h | 无 | 640px 以下折叠菜单。当前仅 `flex-wrap` 勉强应对 |
| P3-12 | 统一响应式断点 (640/768/1024) | UI | 2.0 | 1h | 无 | 当前 4 种不同断点混用（640/720/768/920） |
| P3-13 | 设计令牌标准化 (typography/spacing/radius) | UI | 2.0 | 2h | 无 | 25+ 魔法数字 → 命名 token。提升维护性 |
| P3-14 | 迁移外部图床图片到本地 | Ops, Content | 2.0 | 30 min | 无 | `s2.loli.net` 3 张图下载到 `src/assets/` |
| P3-15 | 动画 `filter: blur()` 替换为 `opacity` | Perf, UI | 2.0 | 15 min | 无 | `rise-in` 和 View Transitions 动画中的 blur 是 CPU 密集型 |
| P3-16 | `.gitattributes` + `.gitignore` 完善 | Ops | 2.0 | 5 min | 无 | 统一行尾 LF；排除 `.env.local`、`.obsidian/` |
| P3-17 | 标签大小写统一 (vim→Vim 等) + 补充技术栈标签 | Content | 2.0 | 15 min | 无 | 添加 `Astro`, `Tailwind CSS`, `Markdoc`, `静态站点` 标签到相关文章 |

> ² P3-8 建议在 GA4 迁移到 Partytown（P3-7）后实施，确保 consent 逻辑在 worker 环境中正确运行。

**Phase 3 总工作量**: ~16-20 小时。**预计完成日期**: 一月内，利用碎片时间逐步推进。

---

## 快速胜利 (Top 5, <30 min, 最大 Impact)

> 以下 5 项可在 **30 分钟内全部完成**，解决 8 个 P0 问题，是整个优化路线图的最佳起点。

| 排名 | 行动 | 时间 | 解决的问题 |
|:----:|------|:----:|------|
| 🥇 | **添加 `site: "https://hencte.top"`** | 1 min | canonical=localhost, OG URL 错误, sitemap 无法生成, RSS 链接错误, hreflang 绝对路径错误 — **6 个 P0 根因** |
| 🥈 | **创建 `public/robots.txt`** | 5 min | 爬虫无指引, AI 爬虫拦截失效, 小说保护无标准实现 |
| 🥉 | **修复 NovelLayout CSS 语法错误** | 5 min | 样式表被破坏，小说页面显示异常 |
| 4 | **修复 Article publisher Person→Organization** | 1 min | Google Article Rich Result 被拒 |
| 5 | **删除死图片 + 死代码** | 3 min | 953KB 垃圾、2 个空壳文件清洁 |

**总计**: 15 分钟解决 **10 个跨领域 P0 问题**。

---

## 依赖关系图

```
Level 0 (无依赖 — 立即执行)
├── P1-1  site: "https://hencte.top"        ⭐ 最高优先级
├── P1-3  NovelLayout CSS fix
├── P1-4  Article publisher → Organization
├── P1-6  构建并发
├── P1-7  skip-link
├── P1-8  404 页面
├── P1-9  en/blog.md
├── P1-10 OG 社交分享图
├── P1-11 字体 <link> 迁移
├── P1-12 GA4 移至 </body>
├── P1-13 NovelLayout 定时器降频
├── P1-14 callout 暗色模式
├── P1-16 JsonLD image + inLanguage
├── P1-17 --ink-500 对比度
├── P1-18 lockfile 统一
├── P1-19 删除死图片
└── P1-20 删除死代码

Level 1 (依赖 P1-1 site URL)
├── P1-2  robots.txt (引用 sitemap URL)
├── P1-5  @astrojs/sitemap
└── P1-15 Meta.astro ogType/og:url/og:site_name

Level 2 (依赖 Level 0-1 基础设施)
├── P2-1  hreflang (依赖 P1-1, P1-15)
├── P2-2  RSS feed (依赖 P1-1, 最好等 P2-5)
├── P2-5  补 description (建议在 RSS 之前)
├── P2-8  缓存策略 (依赖部署确认)
└── P2-9  NovelLayout SEO (依赖 P1-3, P1-10, P1-15)

Level 3 (依赖 Level 2 组件)
├── P3-1~3 组件提取 (依赖 BaseLayout 稳定)
├── P3-5    小说页面 SEO (依赖 P2-9)
└── P3-7    Partytown (依赖 P1-12 GA4 定位)
```

---

## 经验沉淀

以下经验建议写入 `agent_memory/lessons_learned.md`：

### 1. `astro.config.mjs` 是站点的"奇点"

**问题**: Wave 1 和 Wave 2 两轮审计中，`site` URL 都是排名第一的 P0 问题，但 50 天未被修复。原因是每个代理把它放入自己的 P0 列表中，但缺乏跨领域视角突出其"阻塞级"重要性。

**教训**: 收敛节点应识别并高亮 **线粒体级修复**（一行代码解决 ≥3 个跨领域 P0 问题），将其作为 Phase 1 的绝对首位，独立标示。

**规则**: 收敛报告中，"一行修复多领域"的任务应在开头独立成节，用 ⭐ 标注。

### 2. 孤岛组件技术债务利滚利

**问题**: NovelLayout 在 Wave 1 (05-20) 被 4 个代理发现问题，50 天未处理。Wave 2 审计发现新增 2 个问题（CSS 语法错误、无 reduced-motion）。孤岛组件的技术债务不是线性的——它随站点其他部分演进时与主系统差距拉大而恶化。

**教训**: 孤岛组件应在上轮收敛后立即标记为「技术债务炸弹」，在下一 Sprint 中强制执行集中整治。

**规则**: 被 ≥3 个代理从不同维度发现问题的 Layout，在下一轮自动进入 Phase 1。

### 3. 内容元数据是 SEO 基础设施的前置依赖（再次验证）

**问题**: Wave 1 已识别"先补元数据，再装 sitemap/RSS"，但未执行。Wave 2 发现元数据问题比评估的更严重（80% 日期损坏是新发现）。若 Wave 1 直接装 sitemap，Google 已索引一批低质量条目。

**教训**: 收敛报告中标注「顺序依赖」的任务对必须强制执行顺序——元数据补齐 → SEO 基础设施上线。不可并行。

**规则**: 涉及 sitemap/RSS/结构化数据的 SEO 优化，必须在内容元数据审计（description 覆盖率 >80%）通过后才启动。

### 4. 双 lockfile 是运维卫生的信号灯

**问题**: `pnpm-lock.yaml` (117KB) 和 `bun.lock` (131KB) 共存。Wave 1 未检测到此问题。Ops 代理的依赖健康检查是本次审计的新维度。

**教训**: 存在双 lockfile 不仅意味着 CI/CD 不确定性，也暗示开发者可能在 pnpm 和 bun 之间切换，但未建立统一规范。

**规则**: 运维审计中增加 lockfile 一致性检查作为标准项目。

---

## 代理固化建议

| 代理 | 评估 | 建议 |
|------|------|------|
| **seo-auditor** | 产出质量 5/5，覆盖全面，与 Wave 1 对比清晰，技术方案可操作。累计调用 ≥2 次 | ✅ 再调用 1 次即可固化。建议固化到 `.opencode/agent/seo-auditor.md` |
| **perf-inspector** | 产出质量 4/5。代码静态分析细致，但缺实际 Lighthouse 数据（受限于无 `dist/`）。Phase 规划清晰 | 🟡 下次调用时要求执行 `pnpm build` + `npx lighthouse`，获取实数据后固化 |
| **ui-refactorer** | 产出质量 5/5。28 项发现 + 组件提取计划 + a11y 清单 + callout 暗色修复方案，高度可操作 | ✅ 建议固化到 `.opencode/agent/ui-refactorer.md` |
| **content-editor** | 产出质量 5/5。10 维度审计 + 统计精确 + 修复方案具体。批量 description 生成建议可行 | ✅ 建议固化到 `.opencode/agent/content-editor.md` |
| **ops-monitor** | 产出质量 4/5。10 维健康检查全面，但 GA4/Search Console 数据缺失（需实际部署后获取）。lockfile、日期损坏等新发现价值高 | 🟡 建议在站点首次部署后再调用一次，获取真实运维数据后固化 |

---

## 收敛元数据

- **收敛时间**: 2026-07-09
- **Wave 2**: 5 代理全部完成（seo-auditor, perf-inspector, ui-refactorer, content-editor, ops-monitor）
- **冲突数**: 4（0 实质性矛盾, 4 时序/维度互补）
- **总发现**: 105 项问题（27 🔴 + 40 🟡 + 30 🟢 + 8 建议）
- **统一行动计划**: 53 项（P1: 20, P2: 16, P3: 17）
- **快速胜利**: 5 项（15 分钟解决 10 个 P0）
- **遗漏领域**: 6 个（Lighthouse 实数据、移动端测试、GSC 验证、子域名状态、构建产物分析、astro-expert 架构审计）
- **经验沉淀**: 4 条
- **代理固化候选**: 3 个（seo-auditor, ui-refactorer, content-editor）
- **Wave 1→Wave 2 修复率**: 2/17 (12%) — 核心瓶颈（site URL, sitemap, robots.txt, hreflang）仍未修复
- **下一波建议**: 执行 Phase 1 全部 20 项 → 运行 `pnpm build` → 运行 Lighthouse → 补齐遗漏领域审计 → 开始 Phase 2

---

*收敛报告由 swarm-convergence 生成。覆盖范围: SEO + Perf + UI + Content + Ops。*
*下轮审计建议: Phase 1 完成后 3-5 天，以构建产物和部署后状态为基线。*
