# QA — 品牌主站项目卡补图（2026-09-03）

| 项 | 结果 |
|----|------|
| **Verdict** | **Pass** |
| 页面 | `/projects`「重点项目」→ `hencte.top`（stage: 品牌主站） |
| Build | `pnpm build` ✅ 209 pages |

## 根因

`src/content/zh/projects.md`（及 `en/projects.md`、`zh|en/home.md` 同项目条目）在配图 Sprint 时**未写入** `image` / `imageAlt`。  
渲染侧 `ProjectsSections.astro` / `HomeSections.astro` 仅在有 `image` 时输出 `<img>`，否则无封面（首页前三卡有图；品牌主站卡在项目页全量列表中缺图）。

非路径损坏：同批已配图卡（Nova / 通天路等）正常。

## 修复

| 动作 | 路径 |
|------|------|
| 封面资产 | `public/img/projects/hencte-top.png`（由 `home.webp` 转 PNG、1536×1024；朱印为品牌「亦」，已纠正误生成的「赤」） |
| 接线 | `image: "/img/projects/hencte-top.png"` + `imageAlt` → `zh/en` 的 `projects.md` 与 `home.md` |

未改组件逻辑；与「开源模板」等有图卡同一字段契约。

## 验证证据

DOM（`dist/projects/index.html`）：

```html
<img src="/img/projects/hencte-top.png" alt="亦幸小阁：米白宣纸上朱红「亦」印、青瓷茶盏与毛笔" width="640" height="400" loading="lazy" decoding="async" …>
```

项目页 `/img/projects/*` 列表含：`nova.png`, `tongtianlu.png`, `monopoly-3d.png`, `linktrust.png`, **`hencte-top.png`**。  
静态资源：`dist/img/projects/hencte-top.png` 存在。

本机无 Playwright，未出截图；以 build HTML + 静态文件为证。

## 追记（2026-09-03 印章纠错）

首版 `hencte-top.png` 从 `home.webp` 导出时，印内实为错字 **「赤」**（生成图字形塌陷），不是品牌「亦」。已与首页 banner 同源重绘并覆盖；证据与方法见 [`banner-seal-yi-regen-20260903.md`](./banner-seal-yi-regen-20260903.md)。引用已加 `?v=20260903yi`。

## 残余

- Obsidian 插件卡仍无图（既有 P2，本任务范围外）
- 未 commit / 未 push
