# QA — 首页 banner 印章「赤」→「亦」重绘（2026-09-03）

| 项 | 结果 |
|----|------|
| **Verdict** | **Pass** |
| 站点 | `D:\Hencter\astro.hencte.top`（hencte.top） |
| 旧字确认 | `public/img/sections/home.webp` 内嵌方形朱红印为 **「赤」**（U+8D64 形），非品牌「亦」 |
| 新字确认 | 印内为 Unicode **「亦」**（U+4EA6），Noto Serif SC 矢量绘制后叠印；识图复核 crop = 「亦」 |
| Push / Commit | 未做（按约束） |

## 根因

1. Section 氛围图 `home.webp` 由生成模型画出印章时，字形塌成 **「赤」**（与「亦」形近）。
2. 项目卡补图把该 `home.webp` 转成 `public/img/projects/hencte-top.png`，把错印复制进品牌主站卡。
3. 印章**非**独立 SVG/PNG 图层，而是烤进位图；仅改 CSS 无法修正。

## 修复方式

| 步骤 | 说明 |
|------|------|
| 备份 | `public/img/sections/home.webp.bak-chi-seal`（保留错印原图备查） |
| 去旧印 | 对旧红印 bbox≈(1096,791)–(1189,919) 做纸纹采样填充 |
| 新印 | 系统字体 `NotoSerifSC-VF.ttf` 绘制单一字符 **「亦」** + 方框 + 朱砂纹理；叠到原位置（≈1086,799，边长 112px） |
| 覆盖源图 | `public/img/sections/home.webp`（1920×1280 WebP） |
| 同步项目卡 | `public/img/projects/hencte-top.png`（1536×1024 PNG，同源缩放） |
| Cache-bust | `sectionImage("home")` → `?v=20260903yi`；`hencte-top.png?v=20260903yi` 写入 zh/en `home.md` / `projects.md` |

**未**采用「整图 AI 重生成」作为最终交付（易再次写错汉字）；AI 仅作过印章草稿参考，最终字形以 Unicode 字体为准。

## 验证证据

| 证据 | 路径 | 识图结果 |
|------|------|----------|
| Banner 印 crop | `docs/qa/assets/banner-seal-yi-crop-20260903.png` | **「亦」** |
| 上下文静物 | `docs/qa/assets/banner-seal-yi-context-20260903.png` | 印为 **「亦」**；毛笔/笔搁氛围保留 |
| 项目卡印 crop | `docs/qa/assets/hencte-top-seal-crop-20260903.png` | **「亦」** |
| 字形对照 | 渲染明文「亦」U+4EA6（非「赤」、非 H、非双字） | Pass |

引用链：

- Hero：`HomeSections.astro` → `sectionImage("home")` → `/img/sections/home.webp?v=20260903yi`
- 项目卡：`/img/projects/hencte-top.png?v=20260903yi`

本地 `astro dev` 已在 `:4321`；静态文件已落盘替换（无需等 build 才改 public）。

## 失败标准复核

| 标准 | 结果 |
|------|------|
| 任一交付图印仍为「赤」 | **否** — crop 识图为「亦」 |
| 仅 CSS 遮盖 | **否** — 位图已重绘/叠印 |
| 互盖无关项目卡 | **否** — 仅改 `home.webp` + `hencte-top.png` |

## 残余

- 叠印边缘与纸纹偶有轻微软边（比 AI 整图错字可接受）；若需更「石印」沧桑感可再磨纹理，但不得再改字形。
- 线上 hencte.top 仍为旧图，直至部署；本地 public 已更正。
- 未 commit / 未 push。
