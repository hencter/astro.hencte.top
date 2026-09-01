# Astro Content Collections 审计 — 2026-09-02

## 执行摘要

**结论：仓库中不存在名为 "Astron" 的 CMS、模块或配置。** 全库 grep（`Astron` / `astron` / `ASTRON`）、文件名搜索、`.opencode/`、`CONTEXT.md`、`AGENTS.md` 均无命中。

用户所问的「内容管理是否真正用上」——若指 **Astro Content Collections**（`src/content.config.ts` + `astro:content` API），答案是 **是的，已在生产页面全面接入**，不是 dead code。

---

## 1. "Astron" 是什么？

| 候选 | 是否存在 | 说明 |
|------|----------|------|
| Astron CMS / 内部模块 | **否** | 零代码引用、零 npm 依赖、零配置文件 |
| Astro Content Collections | **是** | 站点实际内容系统 |
| Obsidian 同步 | **部分** | `remark-obsidian` 作为 Markdown 渲染插件，非 CMS |
| Nutstore 导入管道 | **是** | `scripts/import-novels.mjs` 写入 `src/content/novel/`，再由 collection loader 消费 |
| @astrojs/markdoc | **已安装但未用于内容** | 无 `.mdoc` 文件；所有内容均为 `.md` |

**判定：用户大概率将 "Astro" 误写为 "Astron"。**

---

## 2. 配置位置

| 组件 | 路径 | 状态 |
|------|------|------|
| Collection 定义 | `src/content.config.ts` | 活跃 — 3 个 collection：`blog`, `connect`, `novel` |
| Astro 集成 | `astro.config.mjs` | markdoc、sitemap、remark-obsidian |
| Markdoc 配置 | `markdoc.config.mjs` | 存在，但无 `.mdoc` 内容 |
| 小说导入 | `scripts/import-novels.mjs` | Nutstore → `src/content/novel/{zh-CN,en}/` |
| Obsidian 语法 | `src/lib/remark-obsidian.ts` | 全局 remark 插件 |
| 术语表（非 collection） | `src/content/novel/_glossary/*.json` | 被 `novel-glossary.ts` 直接 fs 读取，用于 OpenCC 繁体镜像 |

### Collection loader 范围

```typescript
// blog: src/content/blog/**/*.md
// connect: src/content/{zh,en}/**/*.md
// novel: src/content/novel/{zh-CN,en}/**/*.md  ← 不含 _glossary/
```

当前文件计数（2026-09-02）：

| 区域 | .md 文件数 |
|------|-----------|
| blog | 79 |
| novel | 62 |
| connect (zh + en) | 10 |

---

## 3. 内容类型 → 来源 → 消费页面

| 内容类型 | 物理来源 | Collection | 消费方（build-time） | 语言 |
|----------|----------|------------|---------------------|------|
| 博客文章 | `src/content/blog/{log,tech,ancient,posts}/` | `blog` | `[...slug].astro`（/log/*, /tech/*, /ancient/*, /posts/*） | zh-CN（正文无 en 副本） |
| 博客栏目索引 | 同上（带 `legacyPath: *_index.md`） | `blog` | `[...slug].astro` 栏目落地页 | zh-CN |
| 博客列表 | connect `zh/blog` + `blog` collection | `connect` + `blog` | `/blog`, `/en/blog` | zh-CN, en-US |
| 古籍列表 | `blog` collection 过滤 ancient | `blog` | `/ancient` | zh-CN |
| 首页/关于/项目 | `src/content/{zh,en}/{home,about,projects}.md` | `connect` | `/`, `/about`, `/projects`, `/en/*` | zh-CN, en-US |
| 繁体首页/关于/项目 | `connect` zh/* + OpenCC 镜像 | `connect`（间接） | `/tw/*`, `/hk/*` via `getMirroredConnect()` | zh-TW, zh-HK |
| Obsidian 插件页 | `src/content/{zh,en}/obsidian/plugins.md` | `connect` | `/obsidian/plugins`, `/en/obsidian/plugins` | zh-CN, en-US |
| 小说书目/章节 | `src/content/novel/{zh-CN,en}/` | `novel` | `/novel/*`, `/en/novel/*`, `/tw/novel/*`, `/hk/novel/*` | 4 语言 |
| 小说术语表 | `_glossary/*.json` | **非 collection** | OpenCC 繁体转换保护词 | TW/HK 镜像 |
| RSS | `blog` collection | `blog` | `/rss.xml` | zh-CN |
| llms.txt / llms-full.txt | `blog` + `novel-bibliography` | `blog` + `novel` | `/llms.txt`, `/llms-full.txt` | zh-CN |
| UI 标签文案 | `src/lib/ui-strings.ts` | **硬编码** | 各 Layout 组件 | 4 语言（OpenCC 转换） |

### 数据流（小说）

```
Nutstore (Obsidian vault)
    │  scripts/import-novels.mjs
    ▼
src/content/novel/{zh-CN,en}/*.md
    │  glob loader (content.config.ts)
    ▼
getCollection("novel") / render()
    │  novel-page.ts, novel-helpers.ts, novel-render.ts
    ▼
/novel/[...slug].astro  →  静态 HTML
```

Nutstore 导入**不绕过** Content Collections——它写入 collection 扫描目录，构建时由 loader 正常加载。

---

## 4. 是否真正在用？（vs dead code）

### 活跃（生产路径）

- **`getCollection("blog")`** — 15+ 调用点：`[...slug].astro`, `blog/index.astro`, `ancient.astro`, `blog-helpers.ts`, `rss.xml.ts`, `llms*.ts`
- **`getEntry("connect", ...)`** — 首页、关于、项目、博客索引、Obsidian 插件页
- **`getCollection("novel")`** — 全部 novel 路由 + 首页小说卡片 + llms 书目元数据
- **`getMirroredConnect()`** — TW/HK 静态页（home/about/projects）
- **`render()` from astro:content** — 博客文章、Obsidian 插件页、小说章节

### 配置但未用于内容

| 项 | 状态 | 影响 |
|----|------|------|
| `@astrojs/markdoc` | 已集成，0 个 `.mdoc` 文件 | 低 — Callout 组件存在但无 markdoc 内容消费 |
| `connect` schema 部分字段 | 大 schema + `.passthrough()` | 无功能影响；字段供 frontmatter 扩展 |
| `blog` 根目录遗留 | 2026-05 审计提到 `about.md`, `legacy-home.md` | 需确认是否仍 publish（非本次重点） |

### 非 collection 但活跃

- `ui-strings.ts` — 页面 UI 标签（非内容 body）
- `novel/_glossary/*.json` — 繁体镜像术语保护（fs 直读，合理设计）

---

## 5. 缺口与行动项

| 优先级 | 缺口 | 建议 |
|--------|------|------|
| P2 | TW/HK 无 `/tw/blog`、`/hk/blog` | 添加 `getMirroredConnect("blog", variant)` 路由，或文档说明 TW/HK 博客仍走 `/blog` |
| P2 | `@astrojs/markdoc` 零内容 | 移除集成（减依赖）或迁移 Obsidian callout 到 markdoc tag |
| P3 | 博客无 en-US 正文 | 架构决策：connect 有 en/blog 索引，但 blog collection 仅 zh-CN 文章 |
| P3 | EN ai-counter-taming 仅 4 章 | Nutstore 有 100+ 章草稿；按发布策略增量 `pnpm import:novels` |
| P3 | `_glossary` 不在 content.config | 可接受；若需类型安全可改为 `defineCollection` + JSON loader |
| 信息 | "Astron" 术语不存在 | 在 `CONTEXT.md` 补充「内容系统 = Astro Content Collections」术语表条目（可选） |

**无需大规模重构。** Content Collections 已正确接线；主要改进点是 TW/HK 博客镜像和 markdoc 去留决策。

---

## 6. 验证方法

```bash
pnpm build          # 应通过；所有 getStaticPaths 依赖 collection
pnpm import:novels  # Nutstore → novel collection 源文件
```

构建产物中 `/novel/sky-tax-ch01/`、`/log/*`、`/` 等均来自 collection 查询，非硬编码 HTML。

---

## 相关报告

- [[2026-05-20_content_audit]] — 初版内容审计（novel 仅 6 篇，现已 62 篇）
- [[2026-09-02_novel_i18n]] — Nutstore 导入 + 小说 i18n
- [[2026-09-02_i18n_tw_hk]] — TW/HK 镜像 MVP
