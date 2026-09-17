# HTML 语义化审计修复 — 续轮（P2 + 验收）

> 日期：2026-09-08  
> 前置：[[2026-09-04_html_semantics_a11y_audit]] · [[2026-09-04_html_a11y_fix_convergence]]  
> 代理：semantics-remediation（本会话）  
> 范围：保留 09-04 WIP，补齐 P2 与遗漏壳；未 git commit

## 总评

**P0 / 核心 P1 已在未提交 WIP 中落地**（书架 / 小说 / 古文全屏 / 博客 article / skip / 子导航 / WeChat / reading-chrome）。本轮在此基础上完成 **P2 命名 landmark + 主题态 + 列表化 CTA + 沉浸壳 reduced-motion**，并修齐遗留的 `AncientPostLayout` 面包屑（该文件当前未被路由引用，路由走 `FullscreenAncientLayout`）。

## 本轮审计范围

| 区域 | 文件 |
|------|------|
| 主站壳 | `BaseLayout.astro` |
| Banner / CTA | `Banner.astro`、`global.css` |
| 博客正文 | `[...slug].astro` |
| 沉浸壳 | `NovelLayout` / `NovelIndexPage` / `NovelLandingPage` / `FullscreenAncientLayout` |
| 遗留古文壳 | `AncientPostLayout.astro` |
| 文案 helper | `novel-helpers.ts` |

## 缺陷 → 修复

| 优先级 | 缺陷 | 修复 |
|--------|------|------|
| （WIP）P0 | 小说禁缩放；沉浸壳无 main/skip/h1 | 已在 09-04 WIP |
| （WIP）P1 | 博客非 article；子导航；WeChat；reading-chrome | 已在 09-04 WIP |
| P2 | 站点 header / 页 Banner 未命名 | `site-header` 加 `aria-label`；Banner `aria-labelledby` + 标题 `id`；CTA/section 用 `<section>` |
| P2 | TOC / 相关文章 aside 未关联标题 | `aria-labelledby` + 稳定 heading id |
| P2 | 主题钮无 pressed 态 | `aria-pressed` 与 `.dark` 同步（Base + 古文全屏） |
| P2 | Banner 动作为裸链接堆 | 改为 `ul/li`，CSS 去列表样式 |
| P2 | 小说壳 reduced-motion 不齐 | NovelLayout / Landing / Index 补齐 |
| P2 | 着陆页章节列表无名 nav | `<nav aria-label=章节目录>` + `chapterList` 文案 |
| 清理 | `AncientPostLayout` 旧面包屑 | 列表化 breadcrumb + `article` + TOC labelled |

## Live 抽检（`127.0.0.1:4321`）

| 页面 | main | h1 | skip | 备注 |
|------|------|----|------|------|
| `/` | 1 | 1 | ✓ | named site-header；banner labelled |
| `/log/` | 1 | 1 | ✓ | |
| `/log/terminal/` | 1 | 1 | ✓ | TOC/related labelled；`aria-pressed`；`article` |
| `/shelf/` | 1 | 1 | ✓ | library-hero labelled |
| `/shelf/…-ch01` | 1 | 1 | ✓ | viewport 可缩放；`article` |
| `/ancient/test-heti/` | 1 | 1 | ✓ | sr-only h1 |

## 残留 backlog（P2/P3）

- 小说 DRM（devtools / 禁选中）仍在，与语义无关；自动化可能撞到「请通过正规渠道阅读」
- `sky-tax` 等章节若正文自带 `#` 标题，依赖 `contentOwnTitle`，勿强行再插 h1
- `AncientPostLayout.astro` 仍是死代码路径（路由 alias 到 Fullscreen）；可后续删除或接回
- 博客索引统计条、友链等次级模块可再做 heading / list 细扫
- 未 git commit（待用户指令）

## 本地抽检建议

```bash
pnpm astro dev --port 4321 --host 127.0.0.1
```

键盘：Tab 看 skip → main；主题钮应有 pressed 态变化；`/log/terminal/` 查 TOC/相关 aside 名称；`/shelf/…-ch01` 确认可双指缩放。

## 维基链接

- [[2026-09-04_html_semantics_a11y_audit]]
- [[2026-09-04_html_a11y_fix_convergence]]
- [[BaseLayout.astro]]
- [[Banner.astro]]
- [[NovelLayout.astro]]
