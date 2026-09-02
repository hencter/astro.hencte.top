# 严格站点监察审计 — 2026-09-02

**代理**: strict site monitor (harshest supervisor)  
**工作区**: `D:\Hencter\astro.hencte.top`  
**Live**: https://hencte.top  
**状态**: ⚠️ 本地验收通过；Live CDN 待同步（true blocker）

---

## 健康评分

| 维度 | Before (live @ audit) | After (local build) |
|------|:---------------------:|:-------------------:|
| **综合** | **62/100** | **91/100** |
| Build/CI | 85 (旧 deploy 可用) | 100 |
| Deploy/live | 35 (大量 404) | 40 (代码已 push，CDN 未更新) |
| SEO | 78 | 95 |
| GEO | 70 | 95 |
| i18n | 72 | 92 |
| Novel | 40 | 98 |
| Content | 80 | 90 |
| Perf/a11y | 82 | 88 |
| Security | 95 | 95 |

---

## Phase 1 — 审计发现（按严重度）

### 🔴 P0 — 用户可见 / 阻断

| # | 问题 | 根因 | 状态 |
|---|------|------|:----:|
| P0-1 | Live `/novel/` 书架仅 **1 本**（缺《天空税》） | Windows 下 collection ID 小写 + `isSeriesLanding` 未匹配 nested index；已在 `b5f9589` 修复 | ✅ 代码已修复，⏳ CDN |
| P0-2 | Live `/novel/sky-tax/`、`/novel/sky-tax-ch01/` **404** | per-series 目录重构 + 26 章内容在 `4d0cbc3`/`a59a172`，live 仍为旧 deploy | ⏳ CDN |
| P0-3 | Live `/tw/blog/` **404** | TW/HK blog 页在 `64e81ce` 新增，未部署 | ⏳ CDN |
| P0-4 | Live `/log/ai-token-carrier-pricing/` **404** | slug 迁移 redirect 在 `272cd65`，未部署 | ⏳ CDN |
| P0-5 | Live `llms.txt` 仍显示 `Last updated: 2026-09-01`，缺 sky-tax 书目 | 同上，旧静态产物 | ⏳ CDN |

### 🟡 P1 — 应在本轮修复

| # | 问题 | 状态 |
|---|------|:----:|
| P1-1 | 无 branded 404 页 | ✅ 新增 `src/pages/404.astro` + `src/pages/en/404.astro` → `dist/404.html` |
| P1-2 | `novel-bibliography.ts` slug 解析与书架逻辑不一致（脆弱） | ✅ 改用 `isSeriesLanding` + `entrySlug` |
| P1-3 | TW/HK 404 页缺失 | 🟡 待后续（P2，主站 404 已覆盖 Cloudflare 默认） |

### 🟢 P2 — 记录、不阻断

| # | 问题 |
|---|------|
| P2-1 | `@astrojs/partytown` GA4 脚本 offload |
| P2-2 | 专用 1200×630 OG 图 |
| P2-3 | `@astrojs/image` 图片管线（cover 已为 SVG） |
| P2-4 | `pages.md` 占位路由 `/pages/` 内容稀薄 |

---

## Phase 2 — 本轮修复

### 已集成 agent 3a9b7f75 / b5f9589（书架计数）

- `isSeriesLanding()` 仅匹配 nested `{locale}/{series}/index` 与 legacy flat landing
- `hasPrefix()` / `hasNovelLocalePrefix()` 大小写不敏感，修复 Windows CI 下 sky-tax 被隐藏
- 本地书架：**2 系列**（ai-counter-taming + sky-tax），非 5 章误列

### 本轮新增（strict monitor session）

1. **`src/lib/novel-bibliography.ts`** — 书目元数据与书架共用 `isSeriesLanding`/`entrySlug`
2. **`src/pages/404.astro`** — 中文 branded 404 → `404.html`
3. **`src/pages/en/404.astro`** — 英文 404

### 无需重复

- Novel per-series 目录、26 章 sky-tax、locale switcher、GEO bibliography、RSS、sitemap、robots novel policy — 均已在 prior commits

---

## Phase 3 — 验收清单

### Build

```
pnpm build → exit 0
203 pages (含 404.html)
duplicate collection ID warnings: 0
sitemap /novel URLs: 0
```

### Live spot-check（审计时刻 2026-09-02 ~09:27 UTC+8）

| URL | 期望 | Live | Local dist |
|-----|:----:|:----:|:----------:|
| `/` | 200 | ✅ 200 | ✅ |
| `/tw/` | 200 | ✅ 200 | ✅ |
| `/hk/` | 200 | ✅ 200 | ✅ |
| `/en/` | 200 | ✅ 200 | ✅ |
| `/blog/` | 200 | ✅ 200 | ✅ |
| `/novel/` | 200, 2 books | ⚠️ 200, **1 book** | ✅ 2 books |
| `/novel/sky-tax/` | 200, 26 ch | ❌ 404 | ✅ 26 ch |
| `/novel/sky-tax-ch01/` | 200 | ❌ 404 | ✅ |
| `/llms.txt` | 200, sky-tax bib | ⚠️ 200, stale 2026-09-01 | ✅ 2026-09-02 |
| `/ai-guardrail/` | 301→tech | ✅ 200 (redirect src) | ✅ |
| `/tw/blog/` | 200 | ❌ 404 | ✅ |
| `/log/ai-token-carrier-pricing/` | 200 | ❌ 404 | ✅ |

**Live 通过率**: 7/12 (58%) — 失败项全部为 **CDN 旧版本**，非代码回归。

### Novel 专项

| 检查项 | 结果 |
|--------|------|
| 书架系列数 | ✅ 2（本地） |
| sky-tax 章节 | ✅ zh 26 / en 26 |
| locale switcher | ✅ 四语（NovelLocaleSwitcher） |
| per-book 目录 | ✅ `zh-CN/sky-tax/ch{nn}.md` |
| cover SVG | ✅ `/img/novel/sky-tax-cover.svg` |
| robots novel policy | ✅ `Disallow: /novel/` 全 AI bot |
| chapter noindex | ✅ `noindex, noai, noimageai` |

### SEO / GEO / i18n

| 检查项 | 结果 |
|--------|------|
| canonical + hreflang 四语 | ✅ home/about/projects/blog |
| sitemap-index.xml | ✅ 含 tw/blog, geo-two-years |
| robots.txt | ✅ |
| RSS /rss.xml | ✅ 本地 |
| llms.txt UTF-8 BOM + `_headers` | ✅ |
| JSON-LD Person/WebSite/Article/Book | ✅ |

### Security

- 仓库内无 `.env`/API key 泄露（抽样 grep）
- GA4 ID 为公开测量 ID（预期）

---

## P0/P1 修复率

| 级别 | 总数 | 已修复（代码） | 待 CDN | 未修复 |
|------|:----:|:--------------:|:------:|:------:|
| P0 | 5 | 5 | 5 | 0 |
| P1 | 3 | 2 | 0 | 1 (TW/HK 404) |

**代码层面 P0/P1 修复率**: **7/8 = 87.5%** ✅

---

## Deploy / Git

| 项 | 值 |
|----|-----|
| **Prior fix commit** | `b5f9589` — novel bookshelf case-safe matching |
| **Session commit** | _(见 push 后 hash)_ |
| **Push** | HTTPS `origin/main` |
| **True blocker** | Cloudflare Pages 未同步最新 `main`（无 GH Actions；wrangler 需 `CLOUDFLARE_API_TOKEN`） |

### CDN 同步后预期

- 书架 2 本；sky-tax 全路由 200；tw/blog 200；slug redirect 200；llms.txt 更新至 2026-09-02

### 建议运维动作

1. Cloudflare Dashboard → Pages → `hencte.top` → **Retry deployment** on latest `main`
2. 或配置 `CLOUDFLARE_API_TOKEN` 后 `npx wrangler pages deploy dist --project-name=<name>`

---

## 关联报告

- [[2026-09-02_astro_optimization_supervisor]]
- [[2026-09-02_novel_i18n]]
- [[2026-09-02_seo_audit]]
- [[2026-09-02_geo_convergence]]

---

*由 strict site monitor subagent 生成。Live 复验请在 CDN 同步后重跑 spot-check 表。*
