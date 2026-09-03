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

## 收敛决定（v2 — 增补枚举清单后最终裁定）

1. 表格 P0 → Wave 2c（指挥官直接实施：CSS-only `display:block; overflow-x:auto`，不动 remark 层）
2. 令牌/死类减法 → Wave 2d（Wave 2a 完成后放行，避免 global.css 并发冲突）
3. 重装饰降级 → Wave 2d 一并处理

### 增补：全量枚举（审计代理二轮交付）

**令牌收编**（保留前者/删后者）：`--line` 收编 `--code-border/--chip-border/--footer-border`；`--chip-bg` 收编 `--code-bg/--th-bg`（暗色 code-bg 归 `--bg`）；保留 `--toc-bg` 删 `--blockquote-bg`；保留 `--surface` 删 `--card-bg`；保留 `--brand` 删 `--blockquote-border`；保留 `--brand-deep` 删 `--read-accent`（⚠️ 指挥官否决：--read-accent 在用，L1215-1224，本轮保留）；保留 `--ink-900` 删 `--read-fg`（⚠️ 同否决：在用）。

**死令牌 5 个**（grep `radius-sm|read-max-width-novel|read-max-width-ancient|var\(--read-bg\)|var\(--read-muted\)` 全站仅声明行命中）：`--radius-sm`、`--read-max-width-novel`、`--read-max-width-ancient`、`--read-bg`、`--read-muted` → 删（含暗色 L102-104 对应项）。

**死类 4 个**：`.novel-card`(L741-748)、`.section--surface`(L515-520)、`.layout-asymmetric-reverse`(L562-566+L1663)、`.value-card`(仅从分组选择器剔除：L357-389 reveal 链、L645/671/691/698 分组、L1718 reduce 块；分组内 .project-card/.story-panel 在用勿动)。

**装饰降级**：body L125-129 → 纯色 `var(--bg)` + 删 `background-attachment:fixed`（⚠️ 指挥官注：body 背景会传播到 canvas，改纯色后 .ambient-bg 经 z-index:-1 仍可见，视差不受影响）；`.noise-overlay` L153-166 + BaseLayout L133-134 标记 → 删（⚠️ `.ambient-bg` 保留为视差载体，否决审计的整段删除）；header blur → blur(10px)；hero L398-413 保留单层渐变 + 删 ::before；`--shadow-soft` → `0 8px 24px`；`.card-featured-visual::after` L601-607 删；`.cta-banner` L779-781 共用单层。

**P2 采纳**：reveal stagger L375-389 删除（保留基础 reveal）；`.btn-primary` 发光阴影 L478/491 降级。

**响应式收编**：断点归并 640/920/1180 三档（局部 720/768 下轮处理）；≤640 TOC 收纳（Wave 2c：`.toc-rail` display:none，决策记录：移动端不折叠保留，直接隐藏，理由——sticky 栏不存在时目录价值低且压正文）；nav-panel ① max-height+滚动 ③ Esc/外点关闭 → Wave 2d（② is-open 强制 reveal 已在 2a 规格）。

**净删预估**：约 60-80 行。
