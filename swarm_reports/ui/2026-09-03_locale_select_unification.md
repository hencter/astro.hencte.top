# LocaleSelect 统一实施报告 — 2026-09-03

> 范围：站点头部 + 小说页语言切换器统一为原生 `<select>`（仿 shadcn select 视觉，零依赖）。
> 决策：真 shadcn Select = React + Radix + hydration，与 2026-09-03 审计"不引入 React/Radix"冲突 → 用原生 select + 设计 token 复刻视觉。用户确认采用此路线并覆盖头部与小说页。

## 变更清单

| 文件 | 变更 |
|---|---|
| `src/components/LocaleSelect.astro`（新增） | 共享原生 select：aria-label/title、chevron、focus ring、noscript 真链接兜底（保留 `rel=alternate` 供爬虫/无 JS）；样式 token 三级兜底 `--nv-* → 页面级 --* → 字面量`，在 BaseLayout（global.css）、NovelLayout（--nv-*）、小说 landing/index（自定 --*）三种独立皮肤下均正确；导航 = onchange `location.assign`（整页跳转） |
| `src/layouts/BaseLayout.astro` | 头部 4 个语言 pill → `<LocaleSelect>`；删除孤儿 scoped CSS |
| `src/layouts/NovelLayout.astro` / `NovelLandingPage.astro` / `NovelIndexPage.astro` | `NovelLocaleSwitcher` → `<LocaleSelect>`（保留各自 slot 容器） |
| `src/styles/global.css` | 删除无引用 `.language-link` 规则块 |
| `src/components/novel/NovelLocaleSwitcher.astro` | 删除（孤儿） |

## 保留不变（用户红线）

- **小说反扒/阅读逻辑未触碰**：章节页 `noindex,noai,noimageai,noarchive,nocache`、复制/剪切/右键/拖拽拦截、DevTools 检测、阅读进度与滚动记忆、左右翻页快捷键、章节目录 select、`user-select:none` 逐字保留（构建产物验证：copyGuard/progress/noindex 均在）。
- 小说页 robots / Meta 现状原样；"小说放开 SEO"如需执行（去掉章节 noindex、放行爬虫）属独立品牌/版权决策，另开 Sprint，本提交不做。
- 站点头部 `<link rel=alternate hreflang>`、canonical 不变；select 的 noscript 兜底保留可见 alternates。

## 验证

- `pnpm build` ✅ 207 页。
- 产物核验：`/`、`/en`、章节页、小说 landing/index 均恰有 1 个 `select[data-locale-nav]`（4 语言 options，当前 locale `selected`）；`language-link` 旧 pill 0 残留；小说页 noindex/copyGuard/progress 齐备；noscript fallback 含 `rel="alternate"`。
- 视觉验收：无浏览器通道，未做像素截图；select 高度/宽度与 48px 小说顶栏、站点 header 的适配待截图复核。

## 备注（本次教训）

- `.astro` frontmatter 块注释内不得出现 `*/` 序列（`--ink-*/--brand` 曾提前闭合注释导致构建在 9:70 报错）；错误信息中的 "document is not defined" 是误导性兜底文案。
- 编辑工具在本目录偶发 `ReplaceFileW EIO`（疑似杀软/文件监视瞬时锁），同文件重试或间隔数秒后成功；未见其他会话并发写入（git log 仍停在 1160d37）。
