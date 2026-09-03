# 极简阅读体验 Sprint 收敛终报 — 2026-09-03

> 波次：Wave 1 审计×2 → Wave 2a/2b/2c/2d 实施 → Wave 3 构建验证
> 结果：**20/20 验证通过，构建 209 页成功**

## 用户原始诉求与达成证据

| 诉求 | 修复 | 验证证据 |
|------|------|----------|
| 正文未居中 | `.post-shell--reading` 两列 → 三列对称网格 `minmax(0,1fr) minmax(0,40em) minmax(0,1fr)`，TOC 移入右留白列 | Playwright 实测 `cols=208px 640px 208px`，centerOffset=0.008px |
| 目录消失后鼠标悬浮渐渐出现 | `.toc-rail` 常驻热区（stretch 占满右列）+ `:hover/:focus-within` 渐现 + 触屏永不隐藏 + 显现态去 visibility 延迟 | hover 后 `opacity:1 visible` ✓ |
| 导航还是不好看 | 玻璃卡片 → 纸面无边框导航；链接去药丸改编辑部下划线动效；主题按钮/语言选择器圆形无边框；删品牌副标题 | computed: 顶部 `rgba(0,0,0,0)` border 0px；is-active 为品牌色下划线 |
| 下滑渐隐/上滑渐现 | 保留 reading-chrome 机制，补 opacity 300ms 曲线 + focusin 键盘唤回 + 移动菜单展开防隐藏 | 下滑 `op:0`，上滑 `op:1` ✓ |
| 全面响应式 | 断点体系 640/920/1180；移动菜单 max-height 滚动；≤640 隐藏 TOC；表格 `display:block overflow-x:auto` P0；prose/行内码 `overflow-wrap:anywhere` | 三视口（1440/768/390）home+post 零横向溢出 |
| 视差动画（克制） | `.ambient-bg` 滚动视差 `translateY(min(y*-0.04,120px))`，层顶部外扩 10rem 防露边，reduced-motion 自动禁用 | 构建产物含 is-scrolled + ambient 逻辑 |
| 极简化美学 | 净删约 5KB CSS：8 组同值令牌收编、5 死令牌、4 死类、noise 层删除、body 三层渐变→纯色、hero/CTA 渐变减层、btn 发光/stagger 删除 | grep 全站零残留引用 |
| 首页适当优化 | Hero 双按钮→单主按钮；删 /blog ghost chip；项目 1+3→1+2；writing 区前置；hub-about 并入 CTA（aboutBody 文案 + 深入了解兜底链接） | zh/en/tw/hk 镜像同步生效 |

## 波次执行记录

- **Wave 1**：双路合并审计（首轮 4 代理全部异常终止，重试合并为 2 个成功）。两份审计报告见 [[2026-09-03_reading_homepage_audit]] / [[2026-09-03_css_responsive_audit]]。
- **Wave 2**：两轮实施代理均长时间未落盘（判定卡死，指挥官中断接管）；实施过程中发现 EIO/共享冲突根因为同文件并行编辑与文件监视器锁，改单文件串行 + pwsh 原子批处理。
- **Wave 2c/2d**：指挥官亲手实施表格 P0 与全部减法；pwsh 批处理曾因 LF/CRLF 行尾不匹配全量 MISS，归一化后 14/14 APPLIED。
- **Wave 3**：构建 209 页 8.74s 通过；Playwright 20/20（含 2 次测试脚本自身坐标 bug 修正——rail sticky 滚动后 top 为负、热区 x 需在 1120px 容器内）。

## 教训沉淀

1. **同文件并行工具调用 = 必然 EIO**：多代理/多调用写同一文件必须串行或原子批处理。
2. **pwsh here-string 行尾陷阱**：Windows CRLF 文件用 LF here-string 做字面替换会全部 MISS，先归一化再替换。
3. **sticky 元素 boundingRect.top 滚动后为负**：涉及视口内交互测试时坐标必须 clamp 到 [0, innerHeight]。
4. **审计行号会过期**：指挥官实施前预校验锚点，发现 1 处误判（`.layout-asymmetric` 实际在用）并避免了误删。
5. **测试失败≠功能失败**：TOC hover FAIL 两次均为测试坐标问题，调试脚本证明了功能正确。

## 遗留（P2，下轮可选）

- 正文 16px → 1.0625rem（需联动 TOC 13rem→11.5rem 或缩 gap，本轮保持 16px 稳态）
- 局部断点 720/768 归并到三档体系
- `--read-fg/--read-accent` 与 `--ink-900/--brand-deep` 语义合并
