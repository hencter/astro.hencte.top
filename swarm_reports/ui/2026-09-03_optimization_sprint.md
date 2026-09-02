# 全站优化冲刺日志 — 2026-09-03 起

> 目标：goal-0760cb09（≤10 轮）。红线：小说防扒（noindex/DRM/阅读脚本）与设计决策（surface policy、克制动效、零框架）一律不动。质量门：每批 `pnpm build` + 四语言产物抽查 + commit。

## Round 1 — 批次记录

| 批次 | commit | 内容 |
|---|---|---|
| 前置修复 | `0f07bd1` | 小说重复标题：正文自带标题（sky-tax）→ 布局移除外部 h1；ai-counter 保留。四语生效 |
| B1 卫生 | `ba41194` | .gitignore（.scratch/*.bak/bun.lock）；删 bun.lock、markdoc bak、PostLayout/EmptyComponent 死存根；新增 zh-TW/zh-HK 404 → 209 页 |
| B2 品牌+密度 | `55d0c74` | 小说三独立壳补 favicon（亦印章）；博客首页最新 18→8；修复一次 PowerShell 换行符写入事故 |
| B3 组件抽取 | 本批 | 新增 `SectionHeading.astro`；Home/About/Projects/FriendLinks 四处 9 个 `.section-heading` 同构块 → `<SectionHeading title subtitle>`；输出 DOM 不变（section-title 计数一致） |

## 待办（后续轮）

- P1 组件：`Hero`（8 处克隆）、`CtaBanner`（3 处）、`EditorialListItem`（文章行 3 处，先定 prop 契约）
- CSS 治理：死选择器（timeline-item/principle-card）、`.blog-post-card` 双基类、内联 style token 化、callout 色
- 内容：日期/description 覆盖复核、死内容清理、标签轻量云 + chip 可点化
- 架构：global.css 分层、小说壳 head 样板去重（只合并纯样板）、终验截图（待浏览器通道）
