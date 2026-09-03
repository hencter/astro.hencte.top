# 书架 UI + 路由更名 — 2026-09-03

> **范围**: `/novel` → `/shelf` 主路径；封面朝前书架 UI；教程分区钩子；zh/en/tw/hk 同步  
> **执行**: 子代理（bookshelf worker）  
> **构建**: `pnpm build` ✅（209 pages）

## North Star

把「小说列表」升级为亦幸个人品牌**作品库书架**：封面朝前、品牌信号清晰、可扩展到开源教程。

## 路由决策

**主路径：`/shelf`（书架）**

| 候选 | 判定 |
|------|------|
| `/shelf` | ✅ 选用。与中文 UI「书架」一一对应；短；不绑定「小说 only」 |
| `/library` | 偏机构/馆藏英文语感，略长 |

内容集合仍为 `novel`（内部）；公开 URL 与文案面向「书架 / Shelf」。

### Redirect map（永久 / Astro static meta-refresh）

| 旧路径 | 新路径 |
|--------|--------|
| `/novel` | `/shelf` |
| `/novel/[...slug]` | `/shelf/[...slug]` |
| `/en/novel` | `/en/shelf` |
| `/en/novel/[...slug]` | `/en/shelf/[...slug]` |
| `/tw/novel` | `/tw/shelf` |
| `/tw/novel/[...slug]` | `/tw/shelf/[...slug]` |
| `/hk/novel` | `/hk/shelf` |
| `/hk/novel/[...slug]` | `/hk/shelf/[...slug]` |

配置：`astro.config.mjs` → `redirects`。DRM：`robots.txt` 同时 `Disallow: /shelf/` 与 `/novel/`；sitemap 过滤二者。

## UX：Before → After

| | Before | After |
|--|--------|-------|
| 第一屏 | 木纹墙 + 彩色书脊条，无封面 | 「亦」印 + 品牌名 +「书架」+ 一句副文案 |
| 作品呈现 | 竖脊色块书 | 封面朝前（`public/img/novel/*-cover.png`） |
| 分区 | 仅按排数分架 | **原创** / **教程**（空架「即将上架」钩子） |
| 文案 | 「原创小说 · 持续更新」 | 「作品库 · 小说与开源教程」 |
| 设计系统 | 独立木色 + 紫/多色 spine | 墨纸·鎏金 token（与 NovelLayout 对齐） |

动效：hero/作品淡入上移、悬停抬升；`prefers-reduced-motion` 关闭。

## 未来教程接入

1. 在 `indexNovels` 映射中把条目 `kind` 设为 `"tutorial"` 或 `"guide"`（当前小说均为 `"fiction"`）。
2. UI 已按 `kind` 分 bay；教程 bay 有作品时自动渲染封面架，无作品时显示「开源教程即将上架」。
3. 公开教程若需进 sitemap / 允许爬虫：从 `robots`/`sitemap serialize` 中按路径细拆（今日整架仍 DRM 保护）。

## 关键文件

- `src/pages/{,en/,tw/,hk/}shelf/` — 主路由（原 `novel/` 页已移除）
- `src/layouts/NovelIndexPage.astro` — 书架 UI 重写
- `src/lib/novel-helpers.ts` — `SHELF_SEGMENT`、UI 文案
- `src/lib/novel-page.ts` — `cover` / `kind` 入索引
- `src/lib/i18n.ts` — `getNovelPathPrefix` → `/shelf`
- `astro.config.mjs` — redirects + sitemap
- `public/robots.txt` / `public/llm.txt`
- 首页/博客链接、JsonLD、bibliography、import 脚本

## 维基链接

- [[2026-09-03_illustration_copy_sprint]]
- [[2026-09-02_novel_directory_structure]]
- [[2026-09-03_brand_logo_nav_fix]]
