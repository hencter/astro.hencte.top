# Sitemap 命名规范化 — sitemap.xml — 2026-09-04

**代理**: seo-sitemap worker  
**包**: `@astrojs/sitemap@3.7.3`（未改版本）  
**构建**: `pnpm build` ✅（209 pages；canonical 日志：`Sitemap canonicalized → /sitemap.xml`）

## 结论

`@astrojs/sitemap` **设计上始终**输出 `sitemap-index.xml` + `sitemap-0.xml`（即使 URL 数远低于 `entryLimit` 45000），无法通过配置直接得到单文件 `sitemap.xml`。本站约 205 条 URL，只需一个 chunk，因此在 `astro:build:done` 后将唯一 chunk **重命名为** `/sitemap.xml`，并删除 index。

## 根因

| 现象 | 原因 |
|------|------|
| `dist/sitemap-0.xml` | 集成固定命名 `{filenameBase}-{i}.xml` |
| `dist/sitemap-index.xml` | 集成固定写 index，即使只有 1 个 chunk |
| `robots.txt` → `sitemap-index.xml` | 先前按 Astro 默认产物引用 |

i18n path keys（`en`/`tw`/`hk`）与 filter（404、`/novel`）**未改动**。

## 修复

1. 新增 `sitemapCanonicalXml` 集成（注册在 `sitemap()` **之后**）：
   - 仅 1 个 `sitemap-N.xml` → 重命名为 `sitemap.xml`，删除 `sitemap-index.xml`
   - 多个 chunk → 将 index 重命名为 `sitemap.xml`（子文件仍为 `sitemap-N.xml`）
2. `robots.txt`：`Sitemap: https://hencte.top/sitemap.xml`

## 构建产物（验证）

| 文件 | 状态 |
|------|------|
| `dist/sitemap.xml` | ✅ 存在（urlset + xhtml hreflang） |
| `dist/sitemap-0.xml` | ❌ 已移除 |
| `dist/sitemap-index.xml` | ❌ 已移除 |
| `dist/robots.txt` | ✅ 指向 `/sitemap.xml` |

## 变更文件

- `src/integrations/sitemap-canonical-xml.mjs` — 新建
- `astro.config.mjs` — 注册 canonical 集成（sitemap i18n/filter 不变）
- `public/robots.txt` — Sitemap 行改为 `sitemap.xml`

## 后续：dev 404 修复（同日）

**根因**：`@astrojs/sitemap` 仅在 `astro build` 写文件；`astro:build:done` 的 rename 也只跑构建。`astro dev` 下无静态 sitemap → `/sitemap.xml` 404。生产/`astro preview` 的 `dist/sitemap.xml` 本身是正常的。

**修复**：在同一集成上增加 `astro:server:setup` 中间件（仅 dev）：
1. 优先读 `dist/sitemap.xml`（与生产一致，含 hreflang）
2. 若尚无 dist，返回最小合法 urlset + 日志提示跑 `pnpm build`

不新增 `src/pages/sitemap.xml.ts`，避免与构建产物抢写。`robots.txt` 仍指向 `https://hencte.top/sitemap.xml`。

**验证**（重启 `astro dev` 后）：
| 检查 | 结果 |
|------|------|
| `GET http://127.0.0.1:4321/sitemap.xml` | 200，`X-Sitemap-Source: dist`，205 `<url>`，hreflang 保留 |
| `GET …/sitemap-0.xml` | 404（不作为公开名） |
| `dist/sitemap.xml` | 构建后存在；无 `sitemap-0.xml` |

## Follow-up：浏览器「粘连 URL」渲染（同日）

**结论：正文是合法 sitemap，不是损坏体。** 截图里看不到 `<urlset>/<loc>`，是因为浏览器把带 `xmlns:xhtml`（hreflang）的文档当 XHTML/HTML 解析，只露出文本节点；再叠加静态托管若未声明 XML MIME，更容易被当成 `text/html`。

| 层 | 修复 |
|----|------|
| Dev 中间件 | `Content-Type: application/xml; charset=utf-8` + `X-Content-Type-Options: nosniff`；middleware **prepend** 抢在 Astro HTML 404 前 |
| 静态部署 | `public/_headers` 增加 `/sitemap.xml` → `application/xml; charset=utf-8` |
| 浏览器可读性 | 注入 `<?xml-stylesheet href="/sitemap.xsl"?>` + `public/sitemap.xsl`（爬虫忽略；View Source 仍见完整 XML） |

**curl 验证（dev）**：`200` + `application/xml; charset=utf-8` + body 含 `<?xml` / `<urlset` / `<loc` / stylesheet PI。

## 关联

- [[2026-09-03_sitemap]] — i18n 路径键 + shelf 过滤
- [[2026-09-02_seo_audit]] — 初装 sitemap
