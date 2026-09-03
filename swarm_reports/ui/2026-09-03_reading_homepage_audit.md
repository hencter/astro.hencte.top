# 阅读/首页合并审计报告 — 2026-09-03

> 代理：reading-auditor + homepage-auditor（合并波次）
> North Star：极简美学 + 极致阅读舒适
> 状态：已收敛进 Wave 2 实施（[[2026-09-03_plan_minimal_reading_sprint]]）

## A. 正文离轴 — P0

**根因确认**：`src/styles/global.css` L1044-1049，`.post-shell--reading` 为两列网格 `minmax(0,1fr) 15.5rem` + `column-gap:2.5rem`，TOC（L1056-1068）占右列参与布局。`.post-prose`（L1159-1162，40em=640px，`margin:0 auto`）在第一列（1120−248−40=832px）内居中而非页面中轴。

**偏移估算**：正文中心相对页面中轴左移 = (15.5rem+2.5rem)/2 = 9rem ≈ **144px**（`.page-shell` L172 封顶 1120px，宽屏恒定偏左 144px）。`.post-header`（L1021-1028）同列，整条阅读轴一起左偏。另 header 用 70ch（L1023）与正文 40em（L1174）度量不一致（P2）。

**修复验证（可行）**：改三列 `1fr minmax(0,var(--read-max-width-cjk)) 1fr`，header/prose/related 入中列（grid-column:2），左右 1fr 对称留白 → 偏移归零。注意右留白仅约 208px（含 2rem gap），TOC 需收窄至 ≤13rem。

## B. TOC 悬浮唤回 — P0

**现状**：隐藏态 `visibility:hidden + pointer-events:none`（L1089-1096）后，`initReadingChrome()`（BaseLayout.astro L290-352）仅靠上滚（L330-336）或指针进入顶部 96px 热区（L344-346）唤回，鼠标移到右栏 TOC 原位无监听 → 无法唤回。

**方案评估（可行，纯 CSS）**：外层 `.toc-rail` 常驻占右列 `align-self:stretch`（热区=整栏），内层 `.post-toc` 保持 sticky 管动画；补规则 `html.reading-chrome--hidden .toc-rail:hover .post-toc, :focus-within 同` 恢复可见。顺带修 L1085-1086：`visibility 0s linear 260ms` 的 delay 在显现时也生效导致淡入前跳变，显现态应去掉 delay。JS 无需改。

## C. 排版 — P1

- 字号：正文继承 body 16px，中文标准压线，建议 1.0625–1.125rem（40em 度量随动，字数/行不变）⚠️ 指挥官注：字号提升会使 40em 列变 680px，右留白缩至 188px < TOC 13rem，需联动收窄 TOC 或缩 gap——留待截图走查后决策
- 行长 40em ≈ 39字/行 ✅（标准 30-45）
- 行高 `--read-line-height-cjk:1.9`（L59）✅（标准 1.7-1.9 上限）

## D. 首页区块处置（index.astro → HomeSections.astro）

| 区块 | 行号 | 处置 |
|---|---|---|
| Hero | Hero.astro L25-44 | 保留（精简双按钮为 1 主按钮） |
| hub-jump chips | HomeSections L115-121 | 精简：删 /blog ghost chip（L120），与导航重复 |
| hub-projects | L123-185 | 精简：1+3 卡改 1+2（L158 slice(1,4)→slice(1,3)） |
| hub-writing | L187-204 | 保留（阅读核心，4 条合适） |
| hub-about | L206-210 | 合并入 CTA 区，删独立 section |
| CtaBanner | L212-231 | 合并：吸收 about 文案，保留 QR |

顺序建议（P2）：writing 提到 projects 前（阅读优先）。

## 收敛决定

1. A + B → Wave 2a（实施代理 8e845f43，规格已修订：TOC ≤13rem、visibility 延迟不对称修复）
2. D → Wave 2b（实施代理 d09e51d8，文件所有权：index/Hero/HomeSections/CtaBanner）
3. C 字号 → 挂起至 Wave 3 截图走查后决策（存在 TOC 列宽联动）
