# 经验教训沉淀 — Lessons Learned

> astro.hencte.top 站点开发与运营中积累的可复用经验。
> 每条教训标注日期、来源代理、适用范围。

## 经验索引

| # | 日期 | 来源 | 教训摘要 | 适用场景 |
|---|------|------|---------|---------|
| 13 | 2026-09-03 | UI Surface Convergence | Card 数量必须区分模板调用点、单页渲染实例与非 Card surface | 多代理 UI 审计 |
| 14 | 2026-09-03 | UI Surface Convergence | 主题按 Git 时序判定当前态；截图失败时严格分开事实、推断与视觉验收 | 视觉/主题审计 |
| 9 | 2026-09-02 | Wave 3 警告根治 | 上游框架缺陷可能伪装成"内容重复"——先查 store digest 再疑内容 | Astro 内容管道 |
| 10 | 2026-09-02 | Wave 3 gh 核验 | fork 与原创必须区分（isFork 界定），防 fork 冒充原创 | 个人品牌展示 |
| 11 | 2026-09-02 | Wave 3 展示代理 | 双语言站点内容必须双向镜像，防 i18n 漂移 | i18n 站点 |
| 12 | 2026-09-02 | Wave 3 GEO 基建 | GEO 的 robots.txt 策略与传统 SEO 相反：显式允许 AI 爬虫 | GEO 优化 |
| 1 | 2026-07-09 | Wave 2 Convergence | `astro.config.mjs` 是站点"奇点" — 一行修复多领域 | Astro SSG 项目 |
| 2 | 2026-07-09 | Wave 2 Convergence | 孤岛组件技术债务利滚利 — 越拖问题越多 | 多 Layout 项目 |
| 3 | 2026-07-09 | Wave 2 Convergence | 内容元数据是 SEO 基础设施的前置依赖 | SEO 优化项目 |
| 4 | 2026-07-09 | Wave 2 Convergence | 双 lockfile 是运维卫生的信号灯 | 多包管理器项目 |
| 5 | 2026-05-20 | Wave 1 Convergence | Astro v5 文件命名约定变更 (`config.ts` → `content.config.ts`) | Astro 版本迁移 |
| 6 | 2026-05-20 | Wave 1 Convergence | NovelLayout 是"测不准"区域 — 需全栈代理深度审计 | 自包含 Layout |
| 7 | 2026-05-20 | Wave 1 Convergence | 元数据质量是 SEO 基础设施的前置依赖（首次发现） | SEO 优化项目 |
| 8 | 2026-05-20 | Wave 1 Convergence | 同一条 CSS 行被多代理独立发现 — 应注入共享上下文 | 多代理审计 |

---

## 详细记录

### 9 [2026-09-02] 上游框架缺陷可能伪装成"内容重复"
- **来源**: Wave 3 警告根治代理 (5f97e4bc)
- **问题**: 6 条 `[glob-loader] Duplicate id` 警告被误读为"connect 集合重复内容"。实际是 Astro 5.18.2 glob loader 已知误报（PR #15064 只进 6/7.x）：文件被编辑 → digest 失配 → 快速路径失效 → store 中旧条目被误报重复。
- **教训**: "内容重复"类警告先查 build store（node_modules/.astro/data-store.json）的 STALE 集合是否与警告集合精确一致，再用 tinyglobby 复现 pattern 交集，最后才怀疑内容本身。
- **解决**: 清理陈旧 data-store（build + dev 两个），警告清零；内容编辑后首次构建会复发（良性），根治需升级 Astro 6/7.x。
- **适用**: Astro 内容管道调试。
- **参考**: [[swarm_reports/2026-09-02_geo_convergence.md]]

### 10 [2026-09-02] fork 与原创必须区分
- **来源**: Wave 3 gh 核验（主代理）
- **问题**: gh repo list 显示 50 仓中过半是 fork（Minke、obsidian-motes、infinite-canvas 等从描述看极像原创），若直接展示会把 fork 当原创，损害"数据真实性"。
- **教训**: 个人品牌站展示 GitHub 项目前，必须用 gh 的 `isFork`/`isTemplate` 字段界定身份，fork 只能作为"参与/二次开发"语境提及。
- **解决**: 本轮项目页只展示 isFork=False 的原创项目；Obsidian 插件条目被标记待站长确认。
- **适用**: 个人品牌展示、作品集页面。
- **参考**: [[swarm_reports/2026-09-02_geo_convergence.md]]

### 11 [2026-09-02] 双语言站点内容必须双向镜像
- **来源**: Wave 3 展示代理 (9d69e547)
- **问题**: 中文页接入 Nova/通天路/大富翁后，英文页若不同步会形成 i18n 内容漂移，hreflang 让搜索引擎更易发现两版事实不一致。
- **教训**: 任何内容更新（项目、联系方式、里程碑）必须同步修改 zh/en 两版，且英文版不能直译要本地化表达。
- **解决**: 本轮 6 个内容文件（zh/en home/about/projects）成对修改。
- **适用**: 所有 i18n 站点。
- **参考**: [[swarm_reports/2026-09-02_geo_convergence.md]]

### 12 [2026-09-02] GEO 的 robots.txt 策略与传统 SEO 相反
- **来源**: Wave 3 GEO 基建代理 (84941955)
- **问题**: 传统 SEO 建议拦截 AI 爬虫防内容被"偷"，但 GEO（生成式引擎优化）的目标恰恰是被 AI 引擎引用——拦截等于自我排除。
- **教训**: GEO 场景下 robots.txt 应显式允许 GPTBot/ClaudeBot/PerplexityBot/Google-Extended/CCBot 等；版权保护用精确 Disallow（如 /novel/）；sitemap 与 robots 语义必须一致（同源 URL 不能一边 Disallow 一边进 sitemap）。
- **解决**: 本轮 robots.txt 允许 11 家 AI 爬虫 + Disallow /novel/ + sitemap serialize 过滤 /novel。
- **适用**: 所有面向 AI 引用的站点。
- **参考**: [[swarm_reports/2026-09-02_geo_convergence.md]]

### 1 [2026-07-09] `astro.config.mjs` 是站点的"奇点"
- **来源**: Wave 2 Convergence (seo-auditor, perf-inspector, ops-monitor)
- **问题**: Wave 1 和 Wave 2 两轮审计，`site` URL 都是 #1 P0 问题，但 50 天未被修复。原因是每个代理把它放入自己的 P0 列表，缺乏跨领域视角突出其"阻塞级"重要性。
- **教训**: 收敛节点应识别并高亮 **线粒体级修复**（一行代码解决 ≥3 个跨领域 P0 问题），将其作为 Phase 1 的绝对首位，独立标示。
- **解决**: 在收敛报告中，"一行修复多领域"的任务在开头独立成节，用 ⭐ 标注。`site: "https://hencte.top"` 一行修复 canonical、OG URL、sitemap 基础、RSS 基础、hreflang 绝对路径 — 6 个 P0 根因。
- **适用**: 所有 Astro SSG 项目的配置审计。
- **参考**: [[swarm_reports/2026-07-09_convergence.md]]

### 2 [2026-07-09] 孤岛组件技术债务利滚利
- **来源**: Wave 2 Convergence (seo-auditor, perf-inspector, ui-refactorer, ops-monitor)
- **问题**: NovelLayout 在 Wave 1 (05-20) 被 4 个代理发现问题，50 天未处理。Wave 2 审计发现新增 2 个问题（CSS 语法错误、无 reduced-motion）。孤岛组件的技术债务不是线性的 — 它随站点其他部分演进时与主系统差距拉大而恶化。
- **教训**: 孤岛组件应在上轮收敛后立即标记为「技术债务炸弹」，在下一 Sprint 中强制执行集中整治。
- **解决**: 被 ≥3 个代理从不同维度发现问题的 Layout，在下一轮自动进入 Phase 1。本轮 NovelLayout 纳入 P1-3（CSS 修复）+ P1-13（DRM 降频）+ P2-9（SEO 集成）。
- **适用**: 任何有多个独立 Layout 的多页面项目。
- **参考**: [[swarm_reports/2026-07-09_convergence.md]], [[swarm_reports/2026-05-20_convergence.md]]

### 3 [2026-07-09] 内容元数据是 SEO 基础设施的前置依赖（再次验证）
- **来源**: Wave 2 Convergence (content-editor, seo-auditor)
- **问题**: Wave 1 已识别"先补元数据，再装 sitemap/RSS"，但未执行。Wave 2 发现元数据问题比评估的更严重（80% 日期损坏是新发现，77% 缺 description）。若 Wave 1 直接装 sitemap，Google 已索引一批低质量条目。
- **教训**: 收敛报告中标注「顺序依赖」的任务对必须强制执行顺序 — 元数据补齐 → SEO 基础设施上线。不可并行。
- **解决**: 涉及 sitemap/RSS/结构化数据的 SEO 优化，必须在内容元数据审计（description 覆盖率 >80%）通过后才启动。本轮 P2-5（补 description）明确为 P2-2（RSS）的前置条件。
- **适用**: 所有以内容为中心的网站的 SEO 优化项目。
- **参考**: [[swarm_reports/2026-07-09_convergence.md]], [[swarm_reports/content/2026-07-09_content_audit.md]]

### 4 [2026-07-09] 双 lockfile 是运维卫生的信号灯
- **来源**: Wave 2 ops-monitor
- **问题**: `pnpm-lock.yaml` (117KB) 和 `bun.lock` (131KB) 共存。Wave 1 未检测到此问题。
- **教训**: 存在双 lockfile 不仅意味着 CI/CD 不确定性，也暗示开发者可能在 pnpm 和 bun 之间切换但未建立统一规范。
- **解决**: 运维审计中增加 lockfile 一致性检查作为标准项目。本轮 P1-18 立即统一（删除 bun.lock，保留 pnpm）。
- **适用**: 所有使用 Node.js 包管理器的项目。
- **参考**: [[swarm_reports/ops/2026-07-09_ops_audit.md]]

### 5 [2026-05-20] Astro v5 文件命名约定变更
- **来源**: Wave 1 Convergence (seo-auditor vs content-editor + ops-monitor)
- **问题**: SEO 代理按旧版 Astro 路径查找 `src/content/config.ts` 导致误报缺失。
- **教训**: 代理在执行文件存在性检查时，应先确认框架版本的文件路径约定。Astro v5 将 `config.ts` 提升到 `src/content.config.ts`。
- **解决**: 所有代理应在审计开始前读取 `astro.config.mjs` 和 `package.json` 了解框架版本。
- **适用**: 框架版本升级后的审计任务。
- **参考**: [[swarm_reports/2026-05-20_convergence.md]]

### 6 [2026-05-20] NovelLayout 是"测不准"区域
- **来源**: Wave 1 Convergence (4 agents)
- **问题**: 5 个代理中 4 个独立发现了 NovelLayout 的问题，但严重度评估差异大（从 🟡 低到 🔴 严重）。该 Layout 437 行、自建 token 系统、版权保护逻辑 — 与主站脱节程度远超预期。
- **教训**: 对高度自包含的 Layout，应指派专门的「全栈」子代理做独立深度审计，而不是拆成 SEO/Perf/UI 分别扫一眼。
- **解决**: 以后审计中，对行数 >300 且含 `<style>` + `<script>` 的 Layout，单独调度一个全覆盖代理。
- **适用**: 复杂独立 Layout 的审计。
- **参考**: [[swarm_reports/2026-05-20_convergence.md]]

### 7 [2026-05-20] 元数据质量是 SEO 基础设施的前置依赖（首次发现）
- **来源**: Wave 1 Convergence (content-editor, seo-auditor)
- **问题**: SEO 代理将安装 sitemap/RSS 列为 P0，但内容代理发现 75% 文章缺 description。先装 sitemap 后补元数据 → Google 索引低质量条目。
- **教训**: 内容元数据补齐应在 SEO 基础设施上线之前完成，或将两者打包为一个原子任务。
- **解决**: 涉及 sitemap/RSS/结构化数据的 SEO 优化，必须先审计内容元数据覆盖率。
- **适用**: 所有以内容为中心的网站的 SEO 优化。
- **参考**: [[swarm_reports/2026-05-20_convergence.md]]

### 8 [2026-05-20] 同一条 CSS 行被多代理从不同角度审视
- **来源**: Wave 1 Convergence (seo-auditor, perf-inspector)
- **问题**: `global.css:1` 的 `@import url(...)` 被 SEO（字体加载）和性能（阻塞渲染）同时发现，但两个代理独立报告、未交叉引用。
- **教训**: 收敛节点应在分解任务时提供"共享上下文片段" — 将关键代码行号分发给所有代理，确保多视角交叉覆盖。
- **解决**: 收敛节点在分解大任务时，将高频引用文件（`astro.config.mjs`, `global.css`, `BaseLayout.astro`）的路径列表注入每个子代理的 prompt。
- **适用**: 多代理并行审计时的任务分解。
- **参考**: [[swarm_reports/2026-05-20_convergence.md]]

### 13 [2026-09-03] Card 数量先统一口径
- **教训**: 源码模板调用点、循环展开后的单页实例，以及 `.section`/TOC/正文背景等非 Card surface 必须分别计数；前缀文本命中不能当作 wrapper 总数。
- **适用**: 多代理 UI、组件密度与设计系统审计。
- **参考**: [[swarm_reports/2026-09-03_ui_surface_convergence.md]]

### 14 [2026-09-03] 主题与视觉证据都要标明版本和等级
- **教训**: 当前主题以源码和 Git 后继提交为准，旧报告可能已被明确取代；截图通道失败时，只能报告源码/构建事实与设计推断，不能声称视觉验收完成。
- **适用**: 主题迁移、截图审计与收敛报告。
- **参考**: [[swarm_reports/2026-09-03_ui_surface_convergence.md]], [[swarm_reports/ui/2026-09-02_forum_design_port.md]]
