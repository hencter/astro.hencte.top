# 2026-09-17 架构与生命周期综合 Sprint 收敛报告

> 领域：perf / ui / content / ops 交叉
> 执行：main（直接执行 + 每波构建门禁验证）
> 北极星：消除 View Transitions 生命周期缺陷、图片体积、路由壳漂移，建立 CI 质量门禁

## 变更清单（6 commits）

| Commit | 范围 | 摘要 |
|--------|------|------|
| `4f49ba8` | fix(vt) | BaseLayout/WechatWidget/[...slug]/AncientPostLayout 脚本生命周期修复；NovelLayout 移除 DevTools 检测与交互拦截 |
| `0ac1299` | perf(images) | 项目图 12.7MB PNG → src/assets WebP 源（1.7MB），astro:assets `<Picture>` AVIF+WebP 响应式 |
| `9f5b7a7` | refactor(css) | global.css（2579 行）→ 9 个 partial，级联字节等价 |
| `705adbb` | refactor(connect) | 16 个 locale 路由壳收敛到 ConnectShell + getConnectPageData |
| `e1c060d` | feat(content) | Zod schema 收紧，三集合全部去除 passthrough() |
| `e2893bb` | refactor(blog) | blog-index.ts 共享索引，7 处 getCollection/filter/sort 收敛 |
| `6b5f54c` | ci | astro check 0 error 门禁 + GitHub Actions |

## 关键修复细节

### 1. ClientRouter 脚本生命周期（P0 缺陷）
- **`initReadingChrome` 旧 DOM 引用**：`window.__readingChromeBound` 守卫使 window 滚动监听只绑一次，但闭包捕获的 `header`/`navPanel`/`ambient` 在首次 swap 后即失效——此后全站导航栏 `is-scrolled`、ambient 视差、阅读隐藏 chrome 全部静默死亡。改为处理器内 fresh query + 每次 init 重置状态。
- **`initScrollReveal` 观察者泄漏**：每次 swap 新建 IntersectionObserver 且旧的不 disconnect，旧页 DOM 被持续引用。改为模块级单例 + 重建前 disconnect。
- **WechatWidget 完全失效**：组件脚本只执行一次而 widget DOM 每次导航被替换——首次导航后按钮点击无响应。改为 document 事件委托 + 单次绑定守卫。
- **KaTeX/Mermaid swap 后不渲染**：依赖 `DOMContentLoaded`/`startOnLoad`，swap 后均不触发。改为 `astro:page-load`（带守卫，`renderMathInElement`/`mermaid.run` 存在性检查）。
- **AncientPostLayout**：is:inline 脚本每次访问重执行导致 `astro:after-swap` 监听器叠加；加 `__hetiAncientBound` 守卫 + Heti 初始化幂等。

### 2. NovelLayout 反爬移除
删除 3 个高频 `setInterval` DevTools 检测（400/800/1200ms，含 `debugger` 计时陷阱）、`document.write` 整页替换 kill 逻辑，以及 copy/cut/contextmenu/selectstart/dragstart 拦截与 `user-select:none`。保留：章节进度记忆、滚动恢复、左右方向键翻章。noindex/noai 与 HTML 注释版权声明保留。

### 3. 图片优化
- 5 张项目图（nova/tongtianlu/monopoly-3d/linktrust/hencte-top，1536×1024）从 `public/img/projects/*.png`（单张 1.4–3.2MB）转为 `src/assets/projects/*.webp` q90 源。
- `lib/project-images.ts`：content `image:` 字符串 basename → bundled asset（内容文件即稳定键，无需 import 改动）。
- `components/ProjectImage.astro`：featured 640–1536w / thumb 480–960w，AVIF+WebP 双 srcset；未映射/外链回退 `<img>`。
- 交付端单图最大 ~250KB（此前 3.1MB），LCP 候选图（projects 首图）保持 eager。
- 新增 `sharp` devDependency（astro:assets 构建期必需）。

### 4. global.css 拆分
2579 行 → tokens(112) / base(65) / chrome(272) / banner(372) / cards(731) / post(568) / footer(24) / transitions(105) / responsive(327)，global.css 仅保留 `@import` 聚合（顺序不变）。拆分后与拆分前规范化字节 diff 为空。

### 5. Connect 路由壳抽象
- `ConnectShell.astro`：canonical/hreflang/connectPage/keywords 统一从 `PAGE_PATHS` 派生（新增 `getConnectPagePath()`），杜绝 16 份硬编码漂移。
- `lib/connect-page.ts`：zh/en `getEntry` 与 tw/hk OpenCC 镜像分支统一为 `getConnectPageData(page, locale)`。
- 每个壳从 ~30 行降到 ~15 行。FAQPage JSON-LD 维持 zh/en-only（站点 FAQ 为简中文案，tw/hk 不补，避免语言错配）。构建后 canonical 抽查一致。

### 6. Schema 收紧
blog/connect/novel 三集合去 passthrough；补齐真实存在的键（blog.slug×55、connect.novelSection）；blog.section 收窄为枚举（log/tech/ancient/posts/about）。全量构建零违规。未知 frontmatter 键现在会直接 fail build。

### 7. 博客查询索引
`lib/blog-index.ts`：每次构建单次 getCollection + 单次 filter/sort，产出 posts/routed/indexPages/routedPosts。`[...slug]`（静态路径+相关文章+栏目落地）、`ancient.astro`、`rss.xml`、`llms.txt`、`llms-full.txt`、`blog-helpers` 全部迁移。209 页 / 50 RSS 项输出不变。

### 8. CI 门禁
- `pnpm check`（astro check，TS 5.9 —— TS 7 已无 programmatic API）、`pnpm verify`（check+build）。
- 首跑暴露 29 个存量错误并全部清零（ui-strings 宽类型击穿组件契约、lunar-javascript 无类型、markdoc `allowHTML` 写错位置（config 文件该键被静默忽略，已移到 integration 选项）、Callout `Astro.slot` 非组件、home 壳死 prop `homeNovels` 等）。
- `.github/workflows/ci.yml`：install → check → build → dist 冒烟（sitemap/rss/robots 存在、小说页无 debugger 语句）。

## 性能/可维护性收益

| 维度 | 前 | 后 |
|------|-----|-----|
| 项目页图片交付 | 单图最高 3.1MB PNG | 最大变体 ~250KB AVIF/WebP，4 档 srcset |
| 小说页 JS | 3 个常驻 interval + 5 个拦截器 | 0 interval；仅进度/翻页 |
| swap 后 chrome 行为 | 首次导航后失效 | 全生命周期正确 |
| astro check | 未接入（29 errors 潜伏） | CI 门禁，0 errors |
| Connect 壳 | 16 份手工同步 | 单点派生 |
| global.css | 2579 行单文件 | 9 partial，平均 ~285 行 |

## 未处理风险 / 后续

1. **博客/小说配图仍为大 PNG**（`public/img/blog`、`public/img/novel`、`public/img/2026-07-24`，约 20 张 1–3MB）——已列 Backlog P0，迁移时需处理 markdown 正文内引用（不仅是 frontmatter）。
2. **en 首页无小说区**：`homeNovels` 历史上是死 prop（HomeSections 未声明），本次移除接线保持行为不变；是否补小说区是产品决策。
3. **KaTeX/Mermaid 走 CDN**：swap 后渲染依赖 CDN 脚本成功加载；弱网下有失败窗口（已有存在性检查兜底，不报错但公式不渲染）。
4. **GA4 + ClientRouter**：依赖 GA4 enhanced measurement 捕获 history 事件；未显式发 page_view，若后台未开 enhanced measurement 会漏记 SPA 浏览。
5. **视觉回归未截图验证**：CSS 拆分经字节等价校验，图片组件经 DOM 抽查，但未做像素级回归。
6. `_fix_seal_yi.py`、`.dsh/` 等仓库根杂物未清理（非本次范围）。

## 验证记录

- 每波 `pnpm build` 通过（209 pages）；Wave G 起 `pnpm verify`（astro check 0 errors + build）通过。
- dist 抽查：canonical/hreflang 不变；FAQPage 仅 zh/en about；RSS 50 项；小说页无 debugger/user-select；`<picture>` AVIF+WebP srcset 正确输出；mermaid 页无 TS 残留。
