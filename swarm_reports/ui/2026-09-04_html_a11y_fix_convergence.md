# 收敛报告 — HTML 语义化 / 无障碍修复 Sprint

> 日期：2026-09-04  
> 前置：[[2026-09-04_html_semantics_a11y_audit]]  
> 代理：novel-a11y · ancient-a11y · blog-semantics · chrome-a11y · commander 验收  
> 画布：[html-semantics-a11y-audit](../../../../.cursor/projects/d-Hencter-astro-hencte-top/canvases/html-semantics-a11y-audit.canvas.tsx)

## 结论

审计所列 **P0 全清**；核心 P1（skip/main、article、reading-chrome、对比度、子导航、移动菜单/微信披露）已落地。Live 验收通过（`127.0.0.1:4321`）。

## 变更文件

| 文件 | 改动要点 |
|------|----------|
| `NovelLayout.astro` | 解禁缩放；skip；`<article>`；本地化 nav aria |
| `NovelLandingPage.astro` | doctype；skip；`<main>` |
| `NovelIndexPage.astro` | doctype；skip；`<main>`；封面 focus ring |
| `FullscreenAncientLayout.astro` | skip；`<main>`；sr-only h1；landmark；fs-btn focus |
| `BaseLayout.astro` | 移动菜单 Esc/焦点/文案；主题 SVG aria-hidden |
| `WechatWidget.astro` | aria-expanded/controls；Esc；focus-visible |
| `global.css` | reading-chrome 无 visibility:hidden；CTA 对比度；subnav ul |
| `[...slug].astro` | 正文 `article.post-shell` |
| `BlogSectionLayout.astro` | subnav ul + aria-current |
| `HomeSections.astro` | hub-jump ul |
| `novel-helpers.ts` | skipToContent / novelNav / chapterNav |
| `ai-counter-taming/ch01.md` | `###` → `##` |

## Live 验收

| 页面 | 结果 |
|------|------|
| `/shelf/…-ch01` | skip ✓ · main ✓ · viewport 可缩放 ✓ · h1→h2 ✓ · article ✓ |
| `/shelf/` | skip ✓ · main ✓ · doctype ✓ |
| `/ancient/test-heti/` | skip ✓ · main ✓ · sr-only h1 ✓ |
| `/log/terminal/` | `ARTICLE.post-shell` ✓ · wx collapsed ✓ |
| `/log/` | 子导航「博客栏目」list + 日志 `aria-current` ✓ |

## 残留 / 已知

- 小说 DRM（devtools 检测 / 禁选中）仍在，与语义无关；自动化验收时可能误触「请通过正规渠道阅读」页
- sky-tax 用 `#` + `contentOwnTitle`，未改内容标题层级
- 双 banner landmark 命名、TOC `aria-labelledby` 等 P2 未做
- 未 git commit（待用户指令）

## DoD

- [x] P0 修复  
- [x] 关键 P1 修复  
- [x] Live HTML 抽检  
- [x] 报告归档 + index 更新  
- [ ] git commit（等用户）
