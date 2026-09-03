# i18n 首页语言/内容混排审计 — 2026-09-03

**代理**: content i18n auditor (subagent)  
**状态**: 审计完成（未改代码；避免与并发 Banner/HomeSections 冲突）  
**相关**: [[2026-09-02_i18n_tw_hk]], [[2026-09-02_astro_content_collections_audit]], [[2026-09-03_locale_select_unification]], [[2026-09-03_home_hub_singlepage]]

---

## 1. 根因（用户报告：首页中英文章混排）

### 结论

**根因不在 `HomeSections.astro` 展示层，而在数据层：`getLatestPosts()` 未按 locale 过滤博客 collection。**

四套首页壳页都调用无 locale 参数的同一 helper，因此 `/`、`/en`、`/tw`、`/hk` 拿到的「最新写作」列表是同一批全局按日期排序的文章——中文与英文标题会并排出现。

### 精确调用链

| 步骤 | 文件 | 行为 |
|------|------|------|
| 1 | `src/pages/index.astro` L15 | `const latestPosts = await getLatestPosts();`（无 locale） |
| 1b | `src/pages/en/index.astro` L15 | 同上 |
| 1c | `src/pages/tw/index.astro` L10 | 同上 |
| 1d | `src/pages/hk/index.astro` L10 | 同上 |
| 2 | `src/lib/blog-helpers.ts` L12–24 | `getLatestPosts(limit)`：`getCollection("blog")` → 去 draft → section 白名单 → 非 index → **按 date 排序 → slice**；**无 lang/locale 过滤** |
| 3 | `src/components/connect/HomeSections.astro` L127–136 | 原样渲染 `latestPosts.slice(0, 4)` 的 `title` / `href` |

### 内容模型缺口（为何 filter 无处可挂）

| 维度 | blog | novel（对照：正确） |
|------|------|---------------------|
| 物理分区 | 扁平 `src/content/blog/{log,tech,...}/`，中英同目录 | `src/content/novel/{zh-CN,en}/` 前缀分区 |
| schema `lang`/`locale` | **无**（`content.config.ts` blog schema 无语言字段） | 有可选 `locale`；路径前缀即语言 |
| 英文化约定 | 仅凭 slug 后缀 `-en`（当前唯一：`tech/geo-two-years-en.md`） | `hasNovelLocalePrefix` / `getHomeNovels(locale)` |
| 首页 helper | `getLatestPosts()` 无 locale | `getHomeNovels(locale)` **有** locale，且过滤正确 |

触发混排的具体内容对（同日 `2026-09-02`，易同时进入 top-N）：

- `src/content/blog/tech/geo-two-years.md`（中文）
- `src/content/blog/tech/geo-two-years-en.md`（英文）

### 对照：哪些首页数据是对的

- **Connect 文案**：`zh/home` / `en/home` / TW·HK OpenCC 镜像 — 按 locale 正确。
- **UI 字符串**：`getHomeStrings(locale)` — 正确。
- **小说落地列表**：`getHomeNovels("zh-CN"|"zh-TW"|"zh-HK")` — 路径前缀过滤正确；但 `HomeSections` 当前 **未消费** `homeNovels` prop（页面仍传入，组件 Props 已无该字段）——与混排无关，属死 prop / 后续清理项。
- **英文首页**：`en/index.astro` 未传 `homeNovels`（与 zh/tw/hk 不一致）。

---

## 2. 同类错配风险清单

| 表面 | 路径 | 风险 | 证据 |
|------|------|------|------|
| **首页最新写作** | `/` `/en` `/tw` `/hk` | **P0 已现** | `getLatestPosts()` 无 locale |
| **博客索引** | `/blog` `/en/blog` `/tw/blog` `/hk/blog` | **P0 同类** | `getBlogIndexData()` 同样拉全量 blog，仅用 locale 做日期格式/小说计数；`BlogIndexView` 会列出中英标题混排 |
| **栏目落地 / 文章页** | `/tech/*` `/log/*` 等（`[...slug].astro`） | **P1** | 共享单一 slug 树；无 en 镜像路由；relatedPosts 也会跨语言打分互推 |
| **古文栏目** | `/ancient` | 低（内容全中文） | 无 locale 过滤但内容本身无 EN |
| **RSS** | `/rss.xml` | P2 | 通常全站订阅；需产品决策是否分语言 feed |
| **书架 /shelf** | `/shelf` `/en/shelf` `/tw/shelf` `/hk/shelf` | **基本正确** | `novel-page` / `novel-helpers` 按 `zh-cn/` vs `en/` 前缀过滤；TW/HK 镜像 zh-CN |
| **小说章节** | 同上 + `[...slug]` | **基本正确** | 独立 `LocaleSelect` + `getNovelLanguageLinks`；缺 EN 时回退策略已有 |
| **Connect 静态页** | about/projects/links | 文案正确 | 不依赖 blog listing |
| **Obsidian 插件页** | `/obsidian/plugins` vs `/en/...` | 文案分离正确 | **无** `connectPage` → header **无** LocaleSelect（仅 Meta alternates） |

### 次要一致性问题（非混排根因）

1. `en/index.astro` 未调用 `getHomeNovels`；zh/tw/hk 传入但 `HomeSections` 已不渲染 — 死代码路径。
2. Blog 文章页 / 栏目页 **不传** `connectPage` → BaseLayout **不显示** LocaleSelect（见下节）。
3. Blog 无 `lang` 字段时，仅靠 `-en` 后缀脆弱；下一篇英文稿若命名不当会再次泄漏进中文列表。

---

## 3. 语言切换器：是否应仅限首页？

### 现状

- **出现条件**：`BaseLayout` 仅当传入 `connectPage` 时调用 `getLanguageLinks` 并渲染 `LocaleSelect`。
- **已有切换器的页面**：home / about / projects / blog / links（四语言壳）+ 404（指向 home alternates）+ **小说/书架**（独立 layout，自带 `LocaleSelect`）。
- **无切换器**：单篇 blog、section landing、`/ancient`、obsidian/plugins（有 hreflang Meta 但无 UI）。
- **解析方式**：`src/lib/i18n.ts` 的 `PAGE_PATHS` / `getPageAlternates` — 映射到**等价 connect 页**（如 `/blog` ↔ `/en/blog`），不是「一律回首页」。

### 产品建议（强烈：**不要**做成仅首页可切换）

对个人品牌双语站，语言切换应是**全局能力**，但必须满足：

1. **等价页映射**：about→about、blog→blog、shelf 章节→同 slug 他语；不要每次切语言都踢回首页（打断阅读与分享链路）。
2. **无等价内容时的降级**：无 EN 译本的中文博文 → 切 EN 可落到 `/en/blog` 或该文「原文保留 + 提示」，而不是假 URL。
3. **品牌连续感**：读者从项目页、友链、书架任一入口都应能切语言，而无需先找到首页——这是「可被国际读者记住的技术品牌」的基本 UX。

**首页-only 切换的代价**：深链分享失效、SEO/hreflang 与 UI 不一致、书架已有全局切换形成体验分裂。

**推荐落地**：保持并扩展全局 `LocaleSelect`；补齐 blog 文章 / section / obsidian 的 alternates + 切换目标；内容层用 `lang` +（可选）`translationOf` 驱动映射。

---

## 4. 统一修复计划（有序，供后续 Sprint）

> 本轮 **未实施**（非一行安全补丁；需 schema/产品决策，且 HomeSections 有并发 Banner 代理风险）。

### Step 0 — 产品规则（先定，再写代码）

| 规则 | 建议 |
|------|------|
| 中文壳（zh-CN / zh-TW / zh-HK）最新列表 | **排除** `lang=en`（或 `-en` 启发式） |
| 英文壳 `/en` 最新列表 | **优先** `lang=en`；若不足 N 篇，是否回填中文？建议：**不回填**，改「暂无更多英文」+ 链到中文 blog，避免再次混排 |
| TW/HK 博客正文 | 短期继续共用简体文章 URL（与 i18n MVP 一致）；UI 繁体、正文简体可接受或后续 OpenCC 镜像 |
| 配对翻译 | 增加可选 `translationOf: string`（对方 entry id）供切换器与 hreflang |

### Step 1 — Schema（`content.config.ts`）

- blog 增加 `lang: z.enum(["zh-CN", "en-US"]).default("zh-CN")`（或 `zh`/`en`）。
- 给 `geo-two-years-en.md` 标 `lang: en-US`；其余默认 zh。
- （可选）`translationOf`。

### Step 2 — 数据层（`blog-helpers.ts`，隔离改动，避开 HomeSections）

1. `getLatestPosts(limit, locale)`：按 `lang`（过渡期兼容 `id.endsWith("-en")`）过滤。
2. `getBlogIndexData(..., locale)`：同样过滤 posts；小说计数已按 locale，保持。
3. 四套首页改为 `getLatestPosts(6, locale)`。

### Step 3 — 页面壳对齐

- `en/index.astro`：与 zh 一致决定是否展示小说；清理未使用的 `homeNovels` 传参或恢复渲染（二选一，避免死 prop）。
- `[...slug].astro` relatedPosts：同语言优先。

### Step 4 — Locale 切换补齐（非首页限定）

- Blog 文章：有 `translationOf` → 切到译本；无 → 切到对应 locale 的 `/blog` 或首页。
- Obsidian / ancient：补 `connectPage` 或显式 `languageLinks`。
- 扩展 `PAGE_PATHS` / 通用 `getAlternateHref(pathname, locale)`。

### Step 5 — 验证

- 目视：`/` 最新写作无英文标题；`/en` 无中文标题（或符合 Step 0 回填规则）。
- `/blog` vs `/en/blog` 列表语言一致。
- `/shelf` 四语言仍只显示本 locale 书目。
- `pnpm build` + 抽查 hreflang。

### 可选极小热修（若需立刻止血、且同意启发式）

仅在 `getLatestPosts` 内：`locale !== "en-US"` 时 `!id.endsWith("-en")`，`en-US` 时只留 `-en`。  
**代价**：命名约定脆弱；en 首页可能只剩 1 篇。仍建议走 Step 0–2 正式方案。

---

## 5. 本轮决策记录

| 项 | 决定 |
|----|------|
| 是否改代码 | **否**（审计 + 计划；避免与 Banner/HomeSections 并发冲突） |
| Git commit | **否**（用户约束） |
| pnpm build | **未跑**（无代码变更） |
| Locale 是否首页-only | **否** — 全局切换 + 等价页映射 |

---

## 6. 一句话摘要

首页中英混排是因为 **`getLatestPosts()`（及同样的 `getBlogIndexData`）把无 `lang` 字段的整库 blog 当全局 feed**；小说侧已按路径 locale 过滤可作范本。语言切换应保持全局，修好等价路由与内容 `lang`，而不是锁死在首页。
