# 布局 HTML 语义化 · 无障碍审计

> 日期：2026-09-04  
> 代理：swarm-commander + explore×2 + live browser (127.0.0.1:4321)  
> 范围：`src/layouts/*`、共享 chrome、`dist/` 与 live HTML  
> 标准取向：HTML5 landmarks + WCAG 2.2 AA  
> 画布：[html-semantics-a11y-audit.canvas.tsx](../../../../.cursor/projects/d-Hencter-astro-hencte-top/canvases/html-semantics-a11y-audit.canvas.tsx)

## 总评

**混合。** `BaseLayout` 主站壳（首页 / 博客 / 连接页）语义与 landmark 扎实；书架、小说章节、古文全屏三套独立壳明显落后。

## 实检摘要

| 页面 | main | h1 | skip | 备注 |
|------|------|----|------|------|
| `/` | 1 | 1 | 有 | header → nav → main → footer 完整 |
| `/log/terminal/` | 1 | 1 | 有 | 正文为 `section`，非 `article` |
| `/shelf/` | 0 | 1 | 无 | region 分区 OK |
| `/shelf/…-ch01` | 1 | 1 | 无 | 禁缩放；h1→h3 跳级 |
| `/ancient/test-heti/` | 0 | 0 | 无 | 有 `article`；标题从 h2 起 |

## P0

1. **小说章节禁缩放** — `NovelLayout.astro` viewport `maximum-scale=1.0, user-scalable=no`（WCAG 1.4.4）
2. **古文全屏无 `<main>` / 无页面 `<h1>`** — `FullscreenAncientLayout.astro`
3. **书架索引与作品着陆页无 `<main>`** — `NovelIndexPage` / `NovelLandingPage`

## P1

- 沉浸壳缺 skip link（仅 BaseLayout 有）
- 阅读 chrome `visibility:hidden` 阻断键盘唤回导航/TOC
- 博客正文应用 `<article>` 包装
- 品牌 CTA / dark brand 对比度不足（约 3.3 / 2.0，目标 4.5）
- 小说章节标题跳级（h1→h3）
- 移动菜单缺 Esc / 焦点管理 / 开合文案
- WeChat 浮层缺 `aria-expanded`
- 博客子导航缺 `aria-current` 与列表结构

## P2

- 双 banner landmark 未命名
- TOC / related `aside` 未 `aria-labelledby`
- 主题按钮无 `aria-pressed`
- 独立壳 reduced-motion 不齐

## 已做对的（BaseLayout）

- `lang`、skip → `#main-content`、单一 `main`
- 主导航 `ul/li` + `aria-current`
- 移动 toggle `aria-expanded` / `aria-controls`
- 装饰层 `aria-hidden`；LocaleSelect 可键盘操作
- `prefers-reduced-motion` 全局兜底

## 建议修复顺序

1. 去掉小说 viewport 禁缩放  
2. 沉浸壳统一补 `main` + skip + 页面 `h1`  
3. 博客正文 `<article>`；章节内容勿跳过 `h2`  
4. reading-chrome 改用不挡焦点的隐藏方式  
5. CTA 对比度 + 子导航 `aria-current`

## 维基链接

- [[BaseLayout.astro]]
- [[NovelLayout.astro]]
- [[FullscreenAncientLayout.astro]]
- [[BlogSectionLayout.astro]]
