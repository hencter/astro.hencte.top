# 任务拆解报告 — 2026-09-03 极简阅读体验 Sprint

## North Star

全面优化响应式 + UI 极简化美学 + 极致舒适的阅读体验 + 首页适当优化；新增设计指令：视差动画（向下滚动导航渐隐消失、向上滚动导航渐出浮现）。

## 现状勘测（指挥官实测）

- `src/styles/global.css` 已增长至 **1869 行**（AGENTS.md 记录的 1118 行已过时）。
- 滚动感知导航机制 **已存在**：`BaseLayout.astro` `initReadingChrome()`（L290-352）+ `html.reading-chrome--hidden .site-header`（global.css L203-208）。
  - 现状为 `translateY` 滑出 + `visibility` 延迟 360ms 隐藏，**无 opacity 渐隐**，视觉上是"滑走"不是"渐隐"。
  - 缺口①：键盘 Tab 聚焦进入隐藏的 header 时无法唤回（仅 mousemove 顶部边缘可唤回）→ a11y 缺陷。
  - 缺口②：移动端 nav-panel 展开时仍可能被隐藏逻辑收起。
  - 缺口③：用户要求"渐隐/渐现"，需补 opacity 过渡曲线。
- 断点体系：920px（导航折叠）/ 640px（紧凑）两级 + Novel/Ancient 布局内部独立断点（640/720/768），存在不一致风险。
- `.opencode/` 下注册代理与技能文件在 git 工作区显示为已删除（已迁移至 `.dsh/skills/`），本轮 commit 时一并处理归档。

## 依赖树

- Wave 1（审计，只读，可并行 ×4）
  - A1 极简化设计令牌审计 → minimalism-auditor
  - A2 响应式覆盖审计 → responsive-auditor
  - A3 阅读排版舒适度审计 → reading-auditor
  - A4 首页结构与信息层级审计 → homepage-auditor
- Convergence（依赖 Wave 1 全部完成）
  - C1 交叉审核 + 设计方向定稿 + 实施计划 → swarm-convergence
- Wave 2（实施，依赖 C1，按文件所有权划分避免冲突）
  - B1 滚动感知导航打磨 + ambient 视差 → owns `BaseLayout.astro` + global.css header/reading-chrome 段
  - B2 设计令牌极简化重构 → owns global.css 其余部分
  - B3 响应式修复 → owns layouts/pages 响应式相关段
  - B4 首页优化 → owns index.astro / HomeSections / Hero
- Wave 3（验证，依赖 Wave 2）
  - V1 pnpm build + Playwright 多视口截图走查 + 修复回归
  - V2 git commit + 报告归档 + index.md 更新

## 并发批次

- Wave 1：A1 A2 A3 A4（4 并发，后台）
- Wave 2：≤4 并发（B1 先行完成 header 段后再放行 B2，避免 global.css 冲突）
- Wave 3：串行

## 约束

- 遵循 `[[2026-09-03_design_decisions]]`：视差类效果此前被拒，本轮用户明确放开（仅导航渐隐渐现 + 克制的 ambient 深度），不做大面积视差。
- 保持"墨纸·青瓷"品牌基因与「亦」印章 Logo，不做模板化重设计。
- 全程 `prefers-reduced-motion` 降级。
