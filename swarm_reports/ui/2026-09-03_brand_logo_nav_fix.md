# 「亦」字印章 Logo + 导航修复实施报告 — 2026-09-03

> 范围：① 品牌 mark 由字母 H 改为「亦」字印章 SVG；② 导航修复（`#contact` id 去重、Blog 主菜单覆盖栏目家族、`aria-current`）。
> 决策依据：用户设计问答确认 Logo 走「亦」字印章方向、本轮只做导航修复（悬浮目录/标签云/密度瘦身等其余方向留待后续轮次）。

## 变更清单

| 文件 | 变更 |
|---|---|
| `src/layouts/BaseLayout.astro` | ① header brand-mark 的 `<span>H</span>` → inline SVG 印章（brand 底 + 纸色字 + 内细框双线），token 化 `fill=var(--brand)/var(--bg)`，`role=img aria-label=亦`；② `<head>` 补 `favicon.svg/.ico` 双链接；③ `isNavActive`：主菜单 "Blog" 在 `/blog`、`/tech`、`/log`、`/ancient`（含 `/en|tw|hk` 前缀）下保持高亮，避免进入文章/栏目页后主 nav 无激活态；④ nav `<a>` 增加 `aria-current` |
| `src/styles/global.css` | `.brand-mark` 简化为 svg 尺寸容器（去 bg/radius/display grid），hover 仅保留 rotate/scale |
| `src/components/connect/HomeSections.astro` | CTA section 移除重复 `id="contact"`（保留 footer 唯一锚点） |
| `src/components/connect/AboutSections.astro` | 同上 |
| `public/favicon.svg` | 覆盖为同款「亦」印章（light/dark 双色，`prefers-color-scheme`） |

## 验证

- `pnpm build` ✅ 207 页。
- 产物核验：`/` 恰 1 个 `brand-mark` svg 且含 `>亦<`；首页/博客首页/关于页 `id="contact"` 均只剩页脚 1 处；favicon 链接存在；`/tech/geo-two-years/` 主 nav "博客" `is-active` + `aria-current="page"`。
- en/tw/hk 页面共用 BaseLayout 与 connect 组件 → 同批修复自动生效。
- 视觉验收（印章字形/字距/悬停手感）仍需浏览器截图通道恢复后复核；SVG 尺寸/色彩均为 token 驱动，后续微调只改 SVG 一处。

## 遗留（其余设计问答方向，未在本轮实施）

右侧悬浮目录 / 标签可点+标签云 / 首页与博客首页信息密度瘦身 / 静态卡降噪（P1）——均已在设计问答与 [[ui/2026-09-03_componentization_audit]] 蓝图登记，待用户排期。
