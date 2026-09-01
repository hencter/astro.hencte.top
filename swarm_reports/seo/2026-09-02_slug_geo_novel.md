# Slug 优化 (SEO + GEO) + 小说 GEO — 2026-09-02

## 执行摘要

完成博客 slug 语义化迁移（6 篇）、Astro 301/meta-refresh 重定向、llms.txt/llms-full.txt 小说书目元数据段、小说 landing/index JSON-LD Book  schema，以及 novel 路由 build 修复。`pnpm build` exit 0，197 pages。

---

## Part 1: Slug 变更表

| 旧 URL | 新 URL | 策略 |
|--------|--------|------|
| `/2026-05-19-ai-token-plan` | `/log/ai-token-carrier-pricing` | 移入 log 分区 + 关键词 slug + redirect |
| `/2026-05-19-cancer-village` | `/log/cancer-village-news-cycle` | 同上 |
| `/2026-05-19-changxin-chip` | `/log/changxin-chip-semiconductor` | 同上 |
| `/ai-guardrail` | `/tech/ai-guardrail` | 移入 tech 分区（frontmatter section 已匹配） |
| `/ai-memory-bottleneck` | `/tech/ai-memory-bottleneck` | 同上 |
| `/chatgpt-health-data` | `/tech/chatgpt-health-data` | 同上 |

### 未变更（有意保留）

| URL 模式 | 原因 |
|----------|------|
| `/ancient/周髀算经`、`/ancient/出师表` | 古文栏目惯例：中文 slug + 文化语义 |
| `/novel/sky-tax-ch{nn}` | 已符合 `{series}-ch{nn}` 规范，双语一致 |
| `/log/2022-03-09-tree` 等历史 log | 低流量 legacy slug，改动 ROI 低；已有 legacyPath 追溯 |

### 重定向

`astro.config.mjs` 配置 6 条 permanent redirect；静态构建产出 meta-refresh HTML（含 canonical 指向新 URL）。

---

## Part 2: 小说 GEO 优化

### llms.txt / llms-full.txt

新增 `src/lib/novel-bibliography.ts`，动态生成：

- **AI 训练政策声明**（reader-only，非训练素材）
- 各系列：标题（中英）、作者、slug、体裁 tags、章节数、四 locale 入口 URL
- 书架索引：`/novel/`、`/en/novel/`、`/tw/novel/`、`/hk/novel/`
- 章节目录 slug 模式：`/{series}-ch{nn}`

`llms-full.txt` 在正文博客之前插入书目段；**不含章节正文**。

### public/llm.txt

新增 `FICTION_POLICY`、`FICTION_INDEX_*`、`FICTION_SLUG_PATTERN`、`FICTION_SERIES` 键值对。

### JSON-LD（保留 noindex/noai）

| 页面 | Schema | 说明 |
|------|--------|------|
| `NovelIndexPage` | `ItemList` of `Book` | 书架书目索引 |
| `NovelLandingPage` | `Book` | 单书元数据 + copyrightNotice |

章节页 **未** 添加 JSON-LD；DRM meta 不变。

### 小说 tags

为 `sky-tax`、`ai-counter-taming` landing 补 genre tags（科幻/赛博朋克/AI）。

---

## Part 3: 构建与路由修复（附带）

修复 novel static paths：

- 新增 `novel/index.astro`（及 en/tw/hk 镜像）分离书架 index
- `[...slug].astro` 排除 index entry，修复 Astro 5 params 校验
- 统一 collection ID 大小写兼容（`zh-cn/` vs `zh-CN/`）

---

## 验证结果

| 检查项 | 结果 |
|--------|------|
| `pnpm build` | ✅ exit 0, 197 pages |
| sitemap 含新 slug | ✅ `/log/ai-token-carrier-pricing`、`/tech/ai-guardrail` |
| sitemap 不含 /novel | ✅ 仍过滤 |
| llms.txt 小说段 | ✅ 含 sky-tax 四 locale 链接 + 政策声明 |
| redirect 页 | ✅ `/2026-05-19-ai-token-plan` → meta-refresh + canonical |
| novel index JSON-LD | ✅ ItemList/Book 已输出 |
| 章节 noindex/noai | ✅ 未改动 |

---

## 遗留 / 建议

1. **P2** 删除 `src/content/novel/` 根目录 legacy 重复文件（与 `en/` 冲突，build 有 duplicate id WARN）
2. **P2** 实现 blog `aliases` frontmatter → getStaticPaths 别名路由（当前仅 redirect + 文档）
3. **P2** 提交更新后的 sitemap 至 Google Search Console

---

*报告时间: 2026-09-02*
*关联: [[2026-09-02_seo_audit.md](./2026-09-02_seo_audit.md)*
