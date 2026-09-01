# Section Pages 完善报告 — 2026-09-02

> **范围**: 站点主要栏目页（首页、博客、log/tech/ancient、projects、about、obsidian/plugins）的结构、文案、SEO 与 i18n 集成  
> **执行**: content-editor（子代理）  
> **构建**: `pnpm build` ✅（75 pages）

---

## 审计摘要

| 页面 | 改前状态 | 改后 |
|------|----------|------|
| `/log` | 正文仅一行「日常折腾记录」 | 完整栏目导语 + 阅读指引 + keywords |
| `/tech` | 仅有四句古诗 | 子栏目概览 + 阅读建议 + 保留原诗 |
| `/tech/road` | 单条链接列表 | 栏目说明 + 推荐阅读 + 回链 |
| `/ancient` | 一句 Heti 说明 | 排版实验说明 + 跨栏目链接 |
| `/blog` | 缺 EN 镜像与完整 hreflang | `connectPage="blog"` + 四语言 alternates |
| `/en/blog` | **不存在** | 新建英文博客 landing |
| `BlogSectionLayout` | 无面包屑、无结构化数据 | 面包屑 + BreadcrumbList JsonLD |
| home/about/projects/obsidian | 内容已较完整 | 微调 EN 博客链接 |

---

## 已实施改进

### 1. 博客栏目落地页（内容）

**`src/content/blog/log.md`**
- 扩展 description 与 keywords
- 正文：栏目定位、内容类型、阅读路径（链至 `/tech`、`/blog`）

**`src/content/blog/tech.md`**
- 扩展 description 与 keywords
- 正文：子栏目概览（road/hugo/editor）、阅读建议
- 保留原有「学无止境」诗句

**`src/content/blog/tech/road.md`**
- 补充 keywords 与栏目导语
- 推荐阅读三条 + 回链博客首页

**`src/content/zh/blog.md`**
- subtitle 补充「小说」栏目与 EN 切换提示

### 2. 英文博客 landing（i18n 缺口）

- 新增 `src/content/en/blog.md`
- 新增 `src/pages/en/blog/index.astro`（结构与中文版对称）
- 说明：正文以中文为主，英文页负责导航与站点语境

### 3. SEO / hreflang 集成（TW/HK 兼容）

- `src/lib/i18n.ts`：`ConnectPage` 扩展为含 `blog`
- 博客 alternates：`zh-CN`/`zh-TW`/`zh-HK` → `/blog`，`en-US` → `/en/blog`
- EN 导航 Blog 链接改为 `/en/blog`
- `/blog`、`/en/blog` 均设置 `connectPage="blog"` 以启用语言切换器

> **TW/HK 说明**：commit `8085cbc2` 未在当前分支找到；现有 `/tw`、`/hk` 路由（home/about/projects）已通过 OpenCC 镜像，**博客 landing  intentionally 共用 `/blog`**（与 `getNavLinks` 一致），未新建 `/tw/blog` 以避免重复 canonical。

### 4. UX：BlogSectionLayout

**`src/layouts/BlogSectionLayout.astro`**
- 面包屑：首页 › 博客 › 当前栏目
- JsonLD `BreadcrumbList`
- 预留 `locale` prop（en-US 标签/日期格式）
- 子栏目/文章列表标签 i18n 就绪

**`src/pages/ancient.astro`**
- 扩展 meta description 与正文（Heti、农历、跨栏目链接）

### 5. 英文 connect 链接修正

- `src/content/en/home.md`：secondary → `/en/blog`
- `src/content/en/projects.md`：secondary → `/en/blog`

---

## 有意保持最小化的页面

| 页面 | 原因 |
|------|------|
| `/posts` | `draft: true`，Hugo 遗留占位，不进入公开路由 |
| `tech/hugo`, `tech/editor`, `tech/vsc` | `draft: true`，子栏目索引暂不公开 |
| `/novel` | 已有 `NovelLandingPage` / `NovelIndexPage` 布局，内容在 novel collection |
| home/about/projects/obsidian | 2026-09 GEO 收敛后内容已充实，本次仅链接修正 |

---

## 变更文件清单

```
src/content/blog/log.md
src/content/blog/tech.md
src/content/blog/tech/road.md
src/content/zh/blog.md
src/content/en/blog.md          (new)
src/content/en/home.md
src/content/en/projects.md
src/pages/en/blog/index.astro   (new)
src/pages/blog/index.astro
src/pages/ancient.astro
src/layouts/BlogSectionLayout.astro
src/lib/i18n.ts
```

---

## 构建验证

```text
pnpm build → ✓ 75 page(s) built in ~4.4s
新增路由: /en/blog/index.html
栏目页: /log, /tech, /tech/road, /ancient, /blog 均正常生成
```

---

## Backlog（后续建议）

| 优先级 | 事项 |
|--------|------|
| P2 | TW/HK 专属 `blog.md` 镜像（若需繁体 landing 文案，可复用 `getMirroredConnect`） |
| P2 | `BlogSections.astro` 组件提取（与 Home/About/Projects 对齐） |
| P2 | `tech/hugo` 等 draft 子栏目：发布或永久归档 |
| P3 | 博客 landing 增加 breadcrumb（与 BlogSectionLayout 一致） |
| P3 | `obsidian/plugins` 接入 `connectPage` + alternates（当前仅 zh/en 两页） |

---

## 关联报告

- [[2026-07-09_content_audit]] — 内容质量基线
- [[2026-09-02_geo_convergence]] — GEO/真实性收敛
- [[index]] — 蜂群产出索引
