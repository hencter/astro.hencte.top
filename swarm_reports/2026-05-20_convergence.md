# 蜂群收敛报告 — 2026-05-20

## North Star
提升 astro.hencte.top 站点的搜索可见性、加载性能和用户体验

## 代理执行摘要

| 代理 | 状态 | 综合评分 | 🔴 严重 | 🟡 中等 | 🟢 轻微 |
|------|:----:|---------|:------:|:------:|:------:|
| SEO审计 | ✅ | 42/100 (GEO 24/60) | 5 | 6 | 5 |
| 性能审计 | ✅ | 构建 3/10, 资源 4/10, 运行时 6/10 | 4 | 5 | 5 |
| UI审计 | ✅ | 72/100 | 3 | 9 | 5 |
| 内容审计 | ✅ | 定量审计 (68篇) | 3 | 5 | 6 |
| 运维审计 | ✅ | 配置 + 安全 + 结构 | 2 | 4 | 4 |

> 5 代理全部完成审计，共发现 **17 项严重问题**、**29 项中等问题**、**25 项轻微问题**。

---

## 冲突分析

### 冲突 #1: `content/config.ts` 存在性 — 裁定：SEO 代理误判

| 代理 | 结论 | 位置 |
|------|------|------|
| SEO | ❌ `src/content/config.ts` 不存在 | SEO 报告 §9 |
| 内容 | ✅ `src/content.config.ts` 存在且完整 | 内容报告 §内容配置 |
| 运维 | ✅ `content.config.ts` 三个集合定义完整 | 运维报告 §1 |

**裁定**: Astro v5 将内容配置文件从 `src/content/config.ts` 迁移至 `src/content.config.ts`（根级）。SEO 代理按旧路径查找导致误报。**实际文件存在且 Zod schema 详尽**。SEO 报告中的技术债务表该条目应标记为「已解决」。

### 冲突 #2: `markdoc.config.mjs` 缺失的严重度 — 裁定：一致为 P0

| 代理 | 严重度 | 说明 |
|------|--------|------|
| 内容 | 🔴 严重 | markdoc.config.json 引用但文件不存在，此为 P0 问题 |
| 运维 | 🔴 高 (P0 #2) | 会导致 Markdoc schema 验证静默失效 |

**裁定**: 两代理评估一致，均列为最高优先级。无冲突。此问题导致所有 Markdoc 内容（68 篇博客 + 9 篇 connect + 6 篇小说）的 schema 验证静默失效，影响面极大。

### 冲突 #3: NovelLayout 版权保护严重度差异 — 裁定：不同维度，互补非冲突

| 代理 | 维度 | 严重度 | 关注点 |
|------|------|--------|------|
| 性能 | 运行时 | 🔴 严重 #3 | `setInterval` 持续轮询(400/800/1200ms)浪费 CPU |
| UI | a11y | 🟡 低 #13 | `user-select:none` 和 copy/cut 拦截影响辅助技术 |
| 运维 | 安全 | ⚠️ 注意 | DRM 脚本不构成安全漏洞但行为激进 |

**裁定**: 三个代理从不同维度审视同一代码块，结论互补。综合判断：**优先处理性能问题（降频），其次修复 a11y 违规，安全方面维持现状**。

---

## 综合发现

### 共性根因

#### 根因 1: Astro v5 迁移不完整 (4 代理共同指向)

| 缺失项 | 发现代理 | 影响链 |
|--------|---------|--------|
| `site` URL 未配置 | SEO 🔴, 运维 🔴 | → canonical/OG URL 错误 → sitemap 无法生成 → 搜索引擎索引受阻 |
| `@astrojs/sitemap` 未安装 | SEO 🔴, 运维 🟡 | → 无 sitemap.xml → 搜索引擎发现延迟 |
| `@astrojs/rss` 未安装 | SEO 🟡, 运维 🟡 | → 无订阅渠道 → 回访率降低 |
| `markdoc.config.mjs` 缺失 | 内容 🔴, 运维 🔴 | → schema 验证静默失效 → 内容质量不可控 |
| build 配置未启用 | 性能 🟡, 运维 🟡 | → 无 compressHTML、concurrency=1 |

**一句话**: 站点从 Hugo 迁移到 Astro v5 后，Astro 生态的标准集成和关键配置均未完成。

#### 根因 2: NovelLayout 自成孤岛 (4 代理共同指向)

NovelLayout (`src/layouts/NovelLayout.astro`, 437 行) 被 4 个代理从不同角度指出问题：

| 维度 | 问题 |
|------|------|
| SEO | ❌ 零 Meta/JsonLD/OG/canonical 覆盖；非标准 robots meta |
| 性能 | 🔴 反爬 `setInterval` 持续高频轮询；无 preconnect |
| UI | 🔴 CSS 语法错误(line 288 多余 `}`)；CSS token 自建一套；WCAG 1.4.4 违规 |
| 运维 | ⚠️ DRM 脚本行为激进 |

**一句话**: NovelLayout 作为独立阅读器，与主站设计系统、SEO 体系、性能策略完全脱节。

#### 根因 3: 内容元数据贫瘠 (2 代理共同指向，1 代理预警告)

| 指标 | 当前值 | 目标 |
|------|--------|------|
| description 覆盖 | 25% (17/68) | 100% (已发布文章) |
| tags 覆盖 | 79.4% (54/68) | 100% |
| 老旧无意义 tags | ~47 篇 | 替换为语义化标签 |

**连锁影响**: SEO 代理计划安装 sitemap/RSS，但内容代理指出 description 缺失会导致 sitemap 条目和 RSS feed 质量低下。**两者存在依赖：先补元数据，再启用 sitemap/RSS**。

### 协同优化机会

#### 机会 1: `astro.config.mjs` 一次性修复 — 受益 4 领域
```
一次提交同时添加:
  site: "https://hencte.top"
  + @astrojs/sitemap integration (含 i18n 配置)
  + build: { compressHTML: true, concurrency: 4 }
```
**受益**: SEO (sitemap + canonical)、性能 (compressHTML + concurrency)、运维 (配置整洁)、内容 (RSS 基础就绪)

#### 机会 2: 字体加载三联优化 — 受益 2 领域
```
删除 @import → 改为 preconnect + preload + stylesheet 三段式
```
**受益**: 性能 (LCP -0.3~0.8s)、SEO (Core Web Vitals 提升 → 搜索排名加分)

#### 机会 3: NovelLayout 集中整治 — 受益 4 领域
```
一次重构同时修复:
  - CSS 语法错误 (UI)
  - 添加 Meta/JsonLD/OG (SEO)
  - 反爬脚本降频 (性能)
  - 移除 user-scalable=no (UI a11y)
  - 统一 CSS token (UI DRY)
```
**受益**: UI、SEO、性能、运维 四个领域一揽子解决

#### 机会 4: 内容元数据补齐 + SEO 基础设施联动
```
Step 1: 补全 description/tags → Step 2: 启用 @astrojs/sitemap + @astrojs/rss
```
**顺序依赖**: 必须先补元数据，否则 sitemap/RSS 产出质量差

---

## 统一行动计划

> 评分公式: **Score = Impact × Urgency / Effort** (每项 1-5 分，Score 范围 0.2~25)

### Phase 1: 立即执行 (本周，Score ≥ 4)

| # | 行动 | 涉及代理 | Score | 工作量 | 文件 | 说明 |
|---|------|---------|-------|--------|------|------|
| P1-1 | 添加 `site` URL + 安装 `@astrojs/sitemap` + 启用 `build` 配置 | SEO, 性能, 运维 | **12.5** | 30min | `astro.config.mjs` | 一次性修复 3 个 🔴 问题；所有 URL 从相对变为绝对；sitemap 自动生成 |
| P1-2 | 创建 `public/robots.txt` | SEO, 运维 | **8.3** | 15min | `public/robots.txt` | 引用 sitemap；配置 GPTBot/anthropic-ai/Google-Extended 规则；替代 NovelLayout 非标准 robots meta |
| P1-3 | 创建 `markdoc.config.mjs` 或移除无效 `markdoc.config.json` | 内容, 运维 | **8.3** | 15min | 项目根目录 | 恢复 Markdoc schema 验证；68 篇博客受益 |
| P1-4 | 字体加载优化：删除 `@import` → preconnect + preload + stylesheet | 性能, SEO | **5.6** | 30min | `global.css:1`, `BaseLayout.astro` | LCP -0.3~0.8s；同时解决 Perf-1 和 Perf-4 |
| P1-5 | 移除 blur 滤镜动画 (`rise-in`, `vt-fade-in/out`) | 性能, UI | **5.0** | 15min | `global.css:303-314, 1028-1040` | INP/TBT -50~150ms；低端设备可感知流畅度提升 |
| P1-6 | 修复 NovelLayout CSS 语法错误 + WCAG 1.4.4 违规 | UI, 性能 | **4.2** | 15min | `NovelLayout.astro:262-288, :37` | 多余 `}` 花括号；删除 `user-scalable=no` 和 `maximum-scale` |
| P1-7 | 实现 hreflang 标签 | SEO, 内容 | **4.0** | 1h | `Meta.astro` / `BaseLayout.astro` | 中英文页面互相关联；消除重复内容风险；i18n SEO 价值兑现 |

### Phase 2: 短期规划 (两周，Score 2~4)

| # | 行动 | 涉及代理 | Score | 工作量 | 文件 | 说明 |
|---|------|---------|-------|--------|------|------|
| P2-1 | 安装 `@astrojs/rss` + 创建 `rss.xml.ts` | SEO, 内容, 运维 | **3.8** | 1h | `astro.config.mjs`, `src/pages/rss.xml.ts` | 用户订阅能力；需先完成 P2-3 (元数据补齐) |
| P2-2 | NovelLayout 添加 Meta + JsonLD + OG 标签 | SEO, UI | **3.3** | 1h | `NovelLayout.astro`, `FullscreenAncientLayout.astro` | 小说/古文页面从搜索引擎不可见变为可见 |
| P2-3 | 为所有 `draft: false` 文章补全 `description` 和 `tags` | 内容, SEO | **3.1** | 3h | `src/content/blog/**/*.md` | 34 篇已发布文章缺 description；14 篇缺 tags；直接影响 sitemap/RSS 质量 |
| P2-4 | 导航链接添加 `data-astro-prefetch` | 性能, UI | **3.0** | 30min | `BaseLayout.astro` | 页面切换感知延迟减半(200-500ms → ~100ms) |
| P2-5 | 提取核心组件 Phase 1: ThemeToggle, HeroSection, BlogPostCard, PostHeader | UI, 内容 | **2.8** | 4h | `src/components/` | 减少 3+ 处重复代码；为后续 SEO 覆盖打基础 |
| P2-6 | NovelLayout 反爬脚本降频 (400ms → 2s) | 性能, UI, 运维 | **2.5** | 30min | `NovelLayout.astro:424-432` | CPU 持续占用降低 80%；仍保留版权保护意图 |
| P2-7 | Partytown 卸载 GA4 脚本 | 性能 | **2.3** | 1h | `astro.config.mjs`, `BaseLayout.astro` | 主线程空闲 +50~120ms（移动端效果显著） |
| P2-8 | 为已发布文章补充 `article:published_time` 和 `article:modified_time` OG 标签 | SEO, 内容 | **2.2** | 30min | `Meta.astro` | 提升文章页社交分享预览丰富度 |
| P2-9 | 修复 JsonLD.astro 中 3 个已知缺陷 | SEO | **2.0** | 30min | `JsonLD.astro:88-92, :71-75, :78-102` | Article publisher→Organization; 移除 SearchAction; 添加 image |
| P2-10 | 解决双 lockfile 问题 (锁定 pnpm) | 运维 | **2.0** | 10min | `.gitignore` | 防止依赖版本不一致 |

### Phase 3: 中期储备 (一月，Score < 2)

| # | 行动 | 涉及代理 | Score | 工作量 | 说明 |
|---|------|---------|-------|--------|------|
| P3-1 | 统一 5 套 CSS token 为 1 套主设计系统 | UI | **1.9** | 3h | NovelLayout/FullscreenAncientLayout/NovelIndexPage/NovelLandingPage 的 token 迁移到 global.css |
| P3-2 | 提取 Phase 2 组件: ChipList, Breadcrumb, TOC, Section, CardGrid | UI | **1.7** | 3h | 影响 2 个页面的组件 |
| P3-3 | 添加 `llms-full.txt` | SEO, 内容 | **1.7** | 2h | 全文版供 AI 爬虫深度索引 |
| P3-4 | 创建 `en/blog.md` 英文博客索引页 | 内容, SEO | **1.7** | 1h | 英文用户当前无法导航博客 |
| P3-5 | 添加 skip-to-content 链接 (WCAG 2.4.1) | UI | **1.5** | 15min | `BaseLayout.astro` |
| P3-6 | 审查 16 篇 tech draft 文章 (发布/归档/删除) | 内容 | **1.3** | 2h | 当前 48.5% draft 率过高 |
| P3-7 | 生成 1200×630 PNG 默认社交分享图 + 添加 `og:image:width/height` | SEO, UI | **1.3** | 1h | 替换当前 SVG 图标 |
| P3-8 | 替换 `color-mix()` 为预计算 CSS 变量 | 性能, UI | **1.3** | 1h | 兼容性 + paint 性能 |
| P3-9 | 添加 `::selection` 品牌色 + `prefers-color-scheme` CSS fallback | UI | **1.0** | 20min | 视觉品质 + 渐进增强 |
| P3-10 | 删除 `posts/` 分区占位内容 (3 篇 Lorem ipsum) | 内容 | **1.0** | 5min | 损害站点专业度 |
| P3-11 | 定义统一响应式断点 token (`--bp-sm` / `--bp-md` / `--bp-lg`) | UI | **0.8** | 30min | 当前 4 种断点混用 |
| P3-12 | `Backdrop-filter` 添加 `will-change: transform` + `reduced-motion` 增强 | 性能, UI | **0.7** | 20min | 滚动流畅度 + iOS 性能 |
| P3-13 | 添加 `<meta name="color-scheme">` 到 BaseLayout | UI | **0.5** | 5min | FOUC 预防 |
| P3-14 | 添加 `twitter:site` / `twitter:creator` | SEO | **0.5** | 10min | Twitter 卡片品牌关联 |
| P3-15 | 清理废弃组件 (Welcome.astro, EmptyComponent.astro) | UI | **0.3** | 5min | 代码清洁度 |
| P3-16 | 提取 `formatDate()` 为共享工具 `src/lib/date.ts` | UI, 内容 | **0.3** | 20min | 消除 3 处重复 |
| P3-17 | 为 `scripts/migrate_hugo_content.py` 添加 `requirements.txt` | 运维 | **0.2** | 5min | 依赖文档化 |

---

## 遗漏检测 & 补充调度建议

### 本轮未覆盖的关键领域

| 领域 | 缺失内容 | 建议调度 |
|------|---------|---------|
| **真实 Lighthouse 审计** | 5 份报告均为源码静态分析，无实际浏览器端性能测量 | 调度 `perf-inspector` 使用 Chrome DevTools 运行 Lighthouse (mobile + desktop) |
| **外部链接存活验证** | 运维代理未对外部链接执行 HTTP HEAD 请求 | 调度 `ops-monitor` 第二轮对外部链接 (12 个已采样) 做连通性检查 |
| **暗色模式视觉审计** | UI 代理确认 token 存在，但未做跨页面暗色模式截图对比 | 调度 `ui-refactorer` 对 5 种布局做 dark mode 视觉一致性检查 |
| **构建产物大小分析** | 无代理检查 `dist/` 构建产物体积 (HTML/CSS/JS 分项大小) | 执行一次 `pnpm build` 后分析输出 |
| **移动端真机测试** | 所有分析基于桌面端代码，无移动端实测数据 | 使用 Chrome DevTools mobile emulation + 性能 trace |

### 无需额外调度的领域

| 声称遗漏 | 实际情况 |
|---------|---------|
| `content/config.ts` 不存在 | 已裁定为 SEO 代理路径误判 — `content.config.ts` 存在 |
| 无 GA4 数据审查 | GA4 需浏览器端实时数据，源码静态分析无法获取 — 此为非代码审计项 |

---

## 经验沉淀

以下经验建议写入 `agent_memory/lessons_learned.md`：

### 1. Astro v5 文件命名约定变更
**问题**: SEO 代理按旧版 Astro 路径查找 `src/content/config.ts` 导致误报缺失。
**教训**: 代理在执行文件存在性检查时，应先确认框架版本的文件路径约定。Astro v5 将 `config.ts` 提升到 `src/content.config.ts`。
**规则**: 所有代理应在审计开始前读取 `astro.config.mjs` 和 `package.json` 了解框架版本。

### 2. NovelLayout 是"测不准"区域
**问题**: 5 个代理中 4 个独立发现了 NovelLayout 的问题，但严重度评估差异大（从 🟡 低到 🔴 严重）。该 Layout 437 行、自建 token 系统、版权保护逻辑、独立样式——与主站脱节程度远超预期。
**教训**: 对高度自包含的 Layout，应指派专门的「全栈」子代理做独立深度审计，而不是拆成 SEO/Perf/UI 分别扫一眼。
**规则**: 以后审计中，对行数 >300 且含 `<style>` + `<script>` 的 Layout，单独调度一个全覆盖代理。

### 3. 元数据质量是 SEO 基础设施的前置依赖
**问题**: SEO 代理将安装 sitemap/RSS 列为 P0，但内容代理发现 75% 文章缺 description。如果先装 sitemap 后补元数据，Google 将索引一批低质量条目。
**教训**: 内容元数据补齐应在 SEO 基础设施上线之前完成，或将两者打包为一个原子任务。
**规则**: 涉及 sitemap/RSS/结构化数据的 SEO 优化，必须先审计内容元数据覆盖率。

### 4. 同一条 CSS 行被多个代理从不同角度审视
**问题**: `global.css:1` 的 `@import url(...)` 被 SEO（字体加载）、性能（阻塞渲染）同时发现，但两个代理独立报告、未交叉引用。
**教训**: 收敛节点应在分解任务时提供"共享上下文片段"——将关键代码行号分发给所有代理，确保多视角交叉覆盖。
**规则**: 收敛节点在分解大任务时，将高频引用文件（`astro.config.mjs`, `global.css`, `BaseLayout.astro`）的路径列表注入每个子代理的 prompt。

---

## 收敛元数据

- **收敛时间**: 2026-05-20
- **Wave**: Wave 1 (5 代理, 全部完成)
- **冲突数**: 3 (1 误报, 2 互补)
- **总发现**: 71 项问题 (17 🔴 + 29 🟡 + 25 🟢)
- **统一行动计划**: 34 项 (P1: 7, P2: 10, P3: 17)
- **遗漏领域**: 5 个 (Lighthouse, 外部链接验证, 暗色模式截图, 构建产物分析, 移动端测试)
- **经验沉淀**: 4 条
- **下一波建议**: Wave 2 — 执行 P1-1~P1-7 + 补齐遗漏领域审计
