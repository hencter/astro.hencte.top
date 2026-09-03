# CSS 极简化 + 响应式合并审计报告 — 2026-09-03

> 代理：minimalism-auditor + responsive-auditor（合并波次）
> 状态：结论收敛进 Wave 2/3（[[2026-09-03_plan_minimal_reading_sprint]]）

## P0

- **文章页表格无 overflow 容器**（global.css L1261-1274）：`.post-prose table` 无包裹层/`display:block; overflow-x:auto`，窄屏必撑破 70ch/40em 阅读栏。

## P1 — 令牌与死代码减法（预估净删约 60 行）

| 类别 | 明细 |
|------|------|
| 冗余令牌 | 7 组可合并（如 --card-bg≡--surface 等同值组） |
| 死令牌 | 5 个全站零引用 |
| 零引用类 | novel-card / section--surface / layout-asymmetric-reverse / value-card（经 grep 全站验证） |
| 重装饰 | body fixed 三层渐变、ambient+noise 双层、header blur、hero 三层渐变——为极简让路（保留其一或降参数） |
| 在用勿删 | nav-toggle、breadcrumb .current（已核实引用） |

## P1 — 响应式可用性缺口

1. TOC 降级：`<1180px` 时 TOC 内联在正文上方（现状保留，配合 Wave 2a 的 `.toc-rail { display:contents }` 方案）
2. 移动端菜单 `.nav-panel.is-open` 展开时 header 若处于 reading-chrome--hidden 会被连带隐藏（Wave 2a 已加 is-open 强制 reveal 修复）

## 收敛决定

1. 表格 P0 → Wave 2c（指挥官直接实施，最小 diff：`.post-prose table` 加 overflow 包裹）
2. 令牌/死类减法 → Wave 2d（Wave 2a 完成后放行，避免 global.css 并发冲突）
3. 重装饰降级 → Wave 2d 一并处理（ambient 视差已由 2a 接管，noise 层保留、body 渐变降为单层）
