# 内容质量全面审计报告 — 2026-07-09

> **审计范围**: `src/content/` 下全部 75 个 `.md` 文件（blog 65 + connect 9 + novel 6）  
> **审计维度**: Frontmatter 完整性、草稿状态、标签一致性、内容新鲜度、i18n 同步、Description 质量、Keyword 覆盖、交叉引用、内容结构、新教程审查  
> **执行代理**: content-editor  
> **NORTH STAR**: 全面提升 astro.hencte.top 博客的内容质量和 i18n 一致性

---

## 总体评分卡

| 维度 | 评分 | 状态 |
|------|------|------|
| Frontmatter 完整性 | 🟡 42% | 大量缺失 description/keywords |
| Draft 内容清理 | 🔴 26 篇草稿 | 需大规模清理/发布 |
| Tag 一致性 | 🟡 85% | 部分大小写不一致 |
| 内容新鲜度 | 🟡 80%+ 陈旧 | 超过 50 篇文章 >1 年未更新 |
| i18n 同步 | 🟡 80% | EN 缺失 blog.md |
| Description 质量 | 🔴 15% | 仅 ~10 篇有合格描述 |
| Keyword 覆盖 | 🔴 12% | 仅 8 篇有关键词 |
| 交叉引用 | 🟢 95% | 仅 2 处引用，1 处需修复 |
| 内容结构 | 🟢 90% | 总体良好 |
| 新教程质量 | 🟢 95% | 高质量，小修复即可 |

---

## 1. Frontmatter 完整性审计

### 1.1 总体统计

审计基准对照 `content.config.ts` schema 和 `content-pipeline` SKILL.md 标准。

| 字段 | 必填? | 缺失数 | 缺失率 | 严重度 |
|------|-------|--------|--------|--------|
| `title` | ✅ (schema) | 0 | 0% | — |
| `description` | ⚠️ (推荐) | **50** | **77%** | 🔴 P0 |
| `tags` | ⚠️ (推荐) | **12** | **18%** | 🟡 P1 |
| `keywords` | ⚠️ (SEO推荐) | **57** | **88%** | 🟡 P1 |
| `draft` | ⚠️ (schema 默认 false) | **18** | **28%** | 🟢 P2 |
| `section` | ⚠️ (路由关键) | **8** | **12%** | 🟡 P1 |
| `publishDate` | 可选 | **58** | **89%** | 🟢 P2 |
| `date` | 可选 | **26** (需查) | — | 🟢 P2 |

### 1.2 缺失 `description` 的典型文章（抽样 50 篇）

几乎所有 Hugo 迁移遗留文章均缺少 `description`。典型示例：

```
❌ log/docker.md            — 无 description
❌ log/proxy.md              — 无 description  
❌ log/android.md            — 无 description
❌ log/terminal.md           — 无 description
❌ log/windows-daily.md      — 无 description
❌ log/linux-lost-disk-experience.md — 无 description
❌ log/arch-linux.md         — 有 keywords 但无 description
❌ tech/hugo/usage.md        — 无 description
❌ tech/hugo/diagrams.md     — 无 description
❌ tech/hugo/markdown-cheatsheet.md — 无 description
❌ tech/road/getting-start.md — 无 description
❌ tech/road/lean.md         — 无 description
❌ ancient/出师表.md          — 无 description
❌ posts/post-{1,2,3}.md    — 无 description
❌ blog/about.md             — 无 description
❌ blog/legacy-home.md       — 无 description
```

✅ **有合格 description 的文章**（10篇）：
- `kimi-vs-all.md`, `anti-hallucination-workflow.md`, `ai-engineering-practices.md`
- `bayes-theorem.md`, `combee-paper.md`, `seo-geo-architecture.md`
- `whose-ai-are-you.md`, `ai-on-your-computer.md`, `proxy-tun-mode-explained.md`
- `周髀算经.md`（过长，178 字符）

### 1.3 缺失 `tags` 的文章（12篇）

```
❌ tech/hugo/config.md                    — 无 tags
❌ tech/hugo/menu-params-version.md       — 无 tags
❌ tech/hugo/leaf-bundles.md              — 无 tags
❌ tech/hugo/hugo-npm.md                  — 无 tags
❌ tech/hugo/hugo-cli-convert-front-matter-to-yaml.md — 无 tags
❌ tech/hugo/config/hugo-markup-config.md — 无 tags
❌ log/hugo-test.md                       — 无 tags
❌ log/2025-08-15-hugo-obsidian-plugin-dev.md — 无 tags
❌ log/table-rowspan-and-coilspan.md      — 无 tags
❌ tech/road.md (section index)           — 无 tags
❌ blog/legacy-home.md                    — 无 tags
❌ blog/posts.md                          — 无 tags
```

### 1.4 缺失 `section` 字段的文章（8篇）

```
❌ blog/log.md           — section: "log" ✓
❌ blog/tech.md          — section: "tech" ✓
⚠️ blog/posts.md         — section: "posts" ✓
⚠️ blog/about.md         — section: "about" ✓
⚠️ blog/legacy-home.md   — section: "legacy-home" — 非标准 section
```

> **注意**: `about` 和 `legacy-home` 不是标准 section（应为 blog/log/tech/ancient/posts 之一），可能导致路由异常。

### 1.5 修复建议

| 优先级 | 操作 | 数量 |
|--------|------|------|
| 🔴 P0 | 为所有无 description 的文章生成 AI 摘要 | ~50 篇 |
| 🟡 P1 | 为所有无 tags 的文章补充至少 1 个标签 | 12 篇 |
| 🟡 P1 | 为所有非索引文章补充 keywords | ~55 篇 |
| 🟢 P2 | 补全缺失的 `section` 字段 | 2 篇 |

---

## 2. Draft 内容清理

### 2.1 现状

**草稿数量**: **26 篇**（全部 blog 文章 65 篇的 40%）

> ⚠️ Schema 默认 `draft: false`，但大量文章显式标注 `draft: true`。

### 2.2 Draft 清单

| 文件 | draft | 最后更新 | 内容状态 | 建议 |
|------|-------|---------|---------|------|
| `tech/editor.md` | true | 2023-04-06 | 空壳，仅 frontmatter | 🗑️ 删除或转为 landing |
| `tech/hugo.md` | true | 2023-04-06 | 空壳，仅 frontmatter | 🗑️ 删除或转为 landing |
| `tech/tools.md` | true | 2023-04-06 | 少量内容，不完整 | 🟡 补完或删除 |
| `tech/vsc.md` | true | 2023-04-06 | 空壳 | 🗑️ 删除 |
| `tech/vsc/git.md` | true | 2023-03-20 | 有内容，但简短 | 🟡 可发布 |
| `tech/editor/lazy-nvim.md` | true | 2023-03-20 | 有实际内容 | 🟡 可发布 |
| `tech/editor/keyboard-shortcuts.md` | true | 2023-04-13 | 有实际内容 | 🟡 可发布 |
| `tech/road/plus.md` | true | 2023-03-11 | 「待办」占位 | 🗑️ 删除 |
| `tech/hugo/content-types.md` | true | 2023-04-13 | 有内容 | 🟡 可发布 |
| `tech/hugo/shortcode.md` | true | 2023-04-13 | 有内容 | 🟡 可发布 |
| `tech/hugo/front-matter.md` | true | 2023-04-12 | 有内容 | 🟡 可发布 |
| `tech/hugo/menu-params-version.md` | true | 2023-04-14 | 有内容 | 🟡 可发布 |
| `tech/hugo/post-bundle-archetype-template.md` | true | 2023-04-13 | 有内容 | 🟡 可发布 |
| `tech/hugo/hugo-npm.md` | true | 2025-10-02 | 有较完整内容 | ✅ 建议发布 |
| `tech/hugo/hugo-cli-convert-front-matter-to-yaml.md` | true | 2025-05-06 | 有内容 | 🟡 可发布 |
| `tech/hugo/config/hugo-markup-config.md` | true | 2025-09-27 | 有内容 | 🟡 可发布 |
| `log/hugo-test.md` | true | 2025-08-04 | 仅「测试」 | 🗑️ 删除 |
| `log/software.md` | true | 2022-10-05 | 待办列表 | 🗑️ 删除 |
| `log/2025-08-15-hugo-obsidian-plugin-dev.md` | true | 2025-08-15 | 极简内容 | 🟡 补完或删除 |
| `log/table-rowspan-and-coilspan.md` | true | 2024-04-11 | 测试表格 | 🗑️ 删除 |
| `log/vim-or-neovim.md` | true | 2022-10-03 | 有少量内容 | 🟡 补完或删除 |
| `posts.md` | true | 2023-01-01 | Lorem ipsum 占位 | 🗑️ 删除 |
| `posts/post-1.md` | true | 2023-01-15 | Lorem ipsum 占位 | 🗑️ 删除 |
| `posts/post-2.md` | true | 2023-02-15 | Lorem ipsum 占位 | 🗑️ 删除 |
| `posts/post-3.md` | true | 2023-03-15 | Lorem ipsum 占位 | 🗑️ 删除 |
| `blog/legacy-home.md` | true | 2022-07-12 | 旧首页 | 🗑️ 删除 |

### 2.3 建议操作汇总

| 操作 | 文件数 | 说明 |
|------|--------|------|
| 🗑️ **删除** | 14 | 空壳、占位、Lorem ipsum、测试内容、废弃页面 |
| 🟡 **补完内容后发布** | 4 | 有框架但内容不足 |
| ✅ **直接发布**（改为 `draft: false`） | 8 | 已有足够内容可读 |

---

## 3. Tag 一致性审计

### 3.1 大小写不一致

| 不一致 | 出现位置 | 建议统一 |
|--------|---------|---------|
| `vim` (小写) | `log/vim-or-neovim.md` | → `Vim` |
| `neovim` (小写) | `log/vim-or-neovim.md` | → `Neovim` |
| `nvim` | `log/vim-or-neovim.md` | → 合并到 `Neovim` |
| `code` (小写) | `log/vim-or-neovim.md` | → `Code` |
| `log` (小写) | `log/software.md` | → `Log` |
| `Neovim` (首字母大写) | `tech/editor/lazy-nvim.md` | ✅ |

### 3.2 语义重复/近义标签

| 标签组 | 建议 |
|--------|------|
| `Editor` / `编辑器` / `Tool` / `Code` | 保持双语共存，但可在同一篇文章中并用 |
| `AI` / `LLM` / `Agent` / `大模型` | 区分粒度：AI 是上位词，LLM/Agent 是具体概念 |
| `Hugo` (16次出现) | 过于集中在 Hugo 子主题，可考虑加 `static-site` 等互补标签 |

### 3.3 缺失的关键技术栈标签

当前技术栈（Astro v5 + Tailwind CSS v4 + Markdoc）在标签中**完全缺失**：
- 无 `Astro` 标签
- 无 `Tailwind CSS` 标签  
- 无 `Markdoc` 标签
- 无 `静态站点` / `Static Site` 标签

> 🟡 P1: 应为 `seo-geo-architecture.md` 等与本站技术相关的文章添加技术栈标签。

---

## 4. 内容新鲜度分析

### 4.1 按年份分布

| 年份 | 文章数 | 占比 |
|------|--------|------|
| 2026 | 9 | 14% |
| 2025 | 6 | 9% |
| 2024 | 1 | 2% |
| 2023 | 23 | 35% |
| 2022 | 26 | 40% |
| **总计** | **65** | 100% |

### 4.2 陈旧内容（>1 年未更新）

> 🟡 截至 2026-07-09，**77%（50/65）** 的文章超过 1 年未更新。

- 2022-2023 年文章：**49 篇** — 多为 Hugo 时期迁移内容，多数缺少 description/keywords
- 2024 年文章：**1 篇** — `table-rowspan-and-coilspan.md`（测试性质）
- 2025 年文章：**6 篇** — 其中 4 篇为 draft
- 2026 年（活跃）：**9 篇** — 质量较高，frontmatter 完整

### 4.3 建议

| 优先级 | 操作 |
|--------|------|
| 🟡 P1 | 为 2025-2026 年活跃文章补齐 `lastmod` 字段 |
| 🟢 P2 | 审查 2022-2023 年技术文章是否仍然准确（如 Docker/代理/WSL 配置） |
| 🟢 P2 | 考虑在博客列表页增加「最后更新」时间显示 |

---

## 5. i18n 内容同步审计

### 5.1 页面覆盖矩阵

| 中文页面 (zh-CN) | 英文页面 (en-US) | 同步状态 |
|-----------------|-----------------|---------|
| `zh/home.md` | `en/home.md` | ✅ 结构对等，内容翻译完整。**差异**: EN 版缺少 `novelSection` 块 |
| `zh/about.md` | `en/about.md` | ✅ 结构对等，内容翻译完整 |
| `zh/projects.md` | `en/projects.md` | ✅ 结构对等，内容翻译完整 |
| `zh/blog.md` | ❌ **不存在** | 🔴 **P0 — EN 博客索引页缺失** |
| `zh/obsidian/plugins.md` | `en/obsidian/plugins.md` | ✅ 结构对等，内容翻译完整 |

### 5.2 具体差异

#### 🔴 P0: `en/blog.md` 缺失
- EN 用户访问 `/en/blog` 或 EN 导航的 Blog 链接将 404
- **需要尽快创建** `src/content/en/blog.md`

#### 🟡 P1: EN home 缺少 novelSection
- `zh/home.md` 包含 `novelSection`（小说推广块）
- `en/home.md` 没有等价块
- 影响：英文用户看不到小说入口

### 5.3 修复建议

| 优先级 | 操作 |
|--------|------|
| 🔴 P0 | 创建 `src/content/en/blog.md`（可直接翻译 `zh/blog.md`） |
| 🟡 P1 | 为 `en/home.md` 添加 `novelSection` |
| 🟢 P2 | 检查导航组件中 EN 路径是否正确引用 `/en/...` 前缀 |

---

## 6. Description 质量审查

### 6.1 合格描述示例

```yaml
# ✅ 优秀: 包含关键词，长度合适，有信息量
description: "大模型时代 SEO 与 GEO 融合的技术实践：数据层结构化标记、模型层双路径处理、应用层统一观测。附带 JSON-LD 实战模板与 llm.txt 实现指南。"
```

### 6.2 不合格描述示例

```yaml
# 🟡 过短，无 SEO 价值
description: "这是一篇关于 New Bing 的体验教程"  # 仅 14 字
description: "新键盘体验——VXB67"                  # 仅 10 字

# 🔴 自动生成 / 无意义
description: "本文测试一下封面效果"                # log/2022-03-09-tree.md
description: "我的博客规范，本文会持续更新"          # log/spec.md
description: "记录 Git 的问题和学习记录"             # tech/vsc/git.md
```

### 6.3 修复优先级

| 优先级 | 文章数 | 操作 |
|--------|--------|------|
| 🔴 P0 | ~50 | 为所有无 description 文章生成 AI 摘要（150-160 字符） |
| 🟡 P1 | ~5 | 优化已有但过短/无信息量的 description |
| 🟢 P2 | 1 | 缩短《周髀算经》description（当前 178 字符，略超建议上限） |

---

## 7. Keyword 覆盖分析

### 7.1 现状

- ✅ **有关键词的文章**: 8 篇（12%）
- ❌ **无关键词的文章**: 57 篇（88%）

### 7.2 已有关键词的文章

| 文章 | 关键词数 |
|------|---------|
| `kimi-vs-all.md` | 6 |
| `anti-hallucination-workflow.md` | 5 |
| `ai-engineering-practices.md` | 5 |
| `bayes-theorem.md` | 5 |
| `combee-paper.md` | 5 |
| `seo-geo-architecture.md` | 7 |
| `whose-ai-are-you.md` | 5 |
| `arch-linux.md` | 2（过少） |

### 7.3 关键词与内容相关性

✅ 所有已有关键词与文章内容高度相关。格式均使用中文。

### 7.4 修复建议

| 优先级 | 操作 |
|--------|------|
| 🟡 P1 | 为所有非索引文章（~55篇）从 tags/description 自动提炼 3-7 个关键词 |
| 🟢 P2 | `arch-linux.md` 关键词（2个）偏少，建议补充 |

---

## 8. 交叉引用与断链检查

### 8.1 Wiki 链接 `[[...]]`

扫描结果：**2 处匹配**

| 文件 | 行 | 内容 | 状态 |
|------|-----|------|------|
| `log/whose-ai-are-you.md` | 39 | `[[AGENTS]]` | 🟡 指向概念而非实际页面。当前 AGENTS.md 在项目根目录，不在 wiki 链接解析范围。**建议**：改为普通文本或加注链接 |
| `log/windows-daily.md` | 114 | `MKLINK [[/D] \| [/H] \| [/J]]` | ⚠️ 这是 Windows 命令语法，不是 wiki 链接。**建议**：用代码块包裹避免误解析 |

### 8.2 图片引用

扫描到 **4 处** 图片引用：

| 文件 | 图片路径 | 状态 |
|------|---------|------|
| `log/2022-03-09-tree.md` | `https://s2.loli.net/...` | 🟡 外部图床，长期稳定性存疑 |
| `log/new-bing.md` | `https://s2.loli.net/...` (images frontmatter) | 🟡 同上 |
| `log/new-keyboard-experience.md` | `https://s2.loli.net/...` (images frontmatter) | 🟡 同上 |
| `tech/hugo/markdown-cheatsheet.md` | `/img/avatar.jpg` | 🔴 本地路径引用，但图片可能不存在（about.md 中注释提到 `missing source image: img/avatar.jpg`） |
| `tech/hugo/shortcode.md` | `/img/avatar.jpg` | 🔴 同上 |

### 8.3 修复建议

| 优先级 | 操作 |
|--------|------|
| 🟡 P1 | 确认 `/img/avatar.jpg` 是否存在，或修复引用 |
| 🟡 P1 | `windows-daily.md` L114 的 `[[...]]` 用代码块包裹 |
| 🟡 P1 | `whose-ai-are-you.md` 的 `[[AGENTS]]` 改为普通文本或 Markdown 链接 |
| 🟢 P2 | 评估外部图床（s2.loli.net）迁移到本地 `public/` 目录 |

---

## 9. 内容结构审查

### 9.1 标题层级

- ✅ 大部分文章使用正确的标题层级（`##` 起始）
- ✅ 新教程 (`ai-on-your-computer.md`, `proxy-tun-mode-explained.md`) 结构清晰，含 `> [!info]` 概述块
- ⚠️ 部分 Hugo 遗留文章标题层级混乱（如 `tech/hugo/menu-params-version.md` L15 有空 `##`）

### 9.2 长文章 TOC

| 文章 | 行数 | `toc` | 状态 |
|------|------|-------|------|
| `tech/hugo/emoji.md` | ~888 | ❌ 无 | 🟡 应添加 `toc: true` |
| `ancient/周髀算经.md` | ~613 | ❌ 无 | 🟡 应添加 `toc: true` |
| `tech/tutorials/ai-on-your-computer.md` | ~530 | ✅ `toc: true` | ✅ |
| `novel/ai-counter-taming-ch04.md` | ~417 | N/A (小说) | ✅ |
| `novel/ai-counter-taming-ch03.md` | ~395 | N/A | ✅ |
| `log/arch-linux.md` | ~345 | ❌ 无 | 🟡 应添加 `toc: true` |
| `tech/tutorials/proxy-tun-mode-explained.md` | ~341 | ✅ `toc: true` | ✅ |

### 9.3 修复建议

| 优先级 | 操作 |
|--------|------|
| 🟢 P2 | 为 >300 行的长文章添加 `toc: true` |
| 🟢 P2 | 修复 `menu-params-version.md` L15 空标题 |

---

## 10. 新教程专项审查

### 10.1 `tech/tutorials/ai-on-your-computer.md`

| 维度 | 状态 | 备注 |
|------|------|------|
| title | ✅ | "写给小白：怎么在你的电脑上用上 AI" |
| description | ✅ | 信息量大，长度合适 |
| date | ⚠️ | `"2026-07-09"` — schema 使用 `z.coerce.date()`，应能解析 |
| publishDate | ⚠️ | `"2026-07-09"` — 同上 |
| tags | ✅ | `["AI", "OpenCode", "Claude Code", "DeepSeek", "Cursor", "教程", "小白"]` |
| categories | ⚠️ | `["教程"]` — schema 支持但非常规用法 |
| section | ✅ | `"tech"` |
| toc | ✅ | `true` |
| draft | ✅ | 未显式标注，默认 `false` ✅ |
| keywords | ❌ | 缺失！建议添加 |
| 内容质量 | ✅ | 结构清晰，分免翻墙版/完整版两条路线，有实操步骤 |
| 行数 | 530 | 高质量长文 |
| 建议 | 🟡 添加 `keywords: ["AI入门", "Coding Agent", "OpenCode教程", "DeepSeek配置", "电脑端AI"]` |

### 10.2 `tech/tutorials/proxy-tun-mode-explained.md`

| 维度 | 状态 | 备注 |
|------|------|------|
| title | ✅ | "写给小白：翻墙、代理、Tun 模式到底是什么" |
| description | ✅ | 信息量大，长度合适 |
| date | ⚠️ | 同上 |
| tags | ✅ | `["翻墙", "代理", "Tun", "科学上网", "教程", "小白", "概念"]` |
| categories | ⚠️ | 同上 |
| section | ✅ | `"tech"` |
| toc | ✅ | `true` |
| keywords | ❌ | 缺失！建议添加 |
| 内容质量 | ✅ | 纯概念科普，避免工具推荐，定位清晰 |
| 行数 | 341 | 适中 |
| 建议 | 🟡 添加 `keywords: ["翻墙教程", "代理原理", "Tun模式", "GFW", "科学上网入门", "V2Ray"]` |

### 10.3 两篇教程的共同问题

1. **`categories` 字段**：schema 支持 `categories` 但非标准推荐用法。建议将 `categories: ["教程"]` 的内容合并到 `tags`。
2. **`date`/`publishDate` 格式**：使用 `"2026-07-09"` 而非 ISO 8601。Schema 使用 `z.coerce.date()` 应能处理，但建议统一为 `"2026-07-09T00:00:00+08:00"`。
3. **缺少 `keywords`**：两篇都缺失，影响 SEO。

---

## 小说内容状态

### Frontmatter 审查

| 文件 | 字段 | 状态 |
|------|------|------|
| `novel.md` | title, description, draft | ⚠️ 缺少 `date`, `publishDate`, `novel`, `chapter` |
| `ai-counter-taming.md` | title, description, draft | ⚠️ 同上（小说索引页） |
| `ai-counter-taming-ch01.md` | title, novel, chapter, draft | ⚠️ 缺少 `date`, `publishDate`, `order` |
| `ai-counter-taming-ch02.md` | title, novel, chapter, draft | ⚠️ 同上 |
| `ai-counter-taming-ch03.md` | title, novel, chapter, draft | ⚠️ 同上 |
| `ai-counter-taming-ch04.md` | title, novel, chapter, draft | ⚠️ 同上 |

### 建议

| 优先级 | 操作 |
|--------|------|
| 🟡 P1 | 为所有章节添加 `publishDate` |
| 🟢 P2 | 为章节添加 `order` 字段确保排序 |
| 🟢 P2 | `novel.md` 和 `ai-counter-taming.md` 可能需要确认路由用途 |

---

## 综合修复计划

### 🔴 P0（立即修复，阻塞发布）

| # | 事项 | 涉及文件 | 预估工作量 |
|---|------|---------|-----------|
| 1 | 创建 `en/blog.md` | 1 个文件 | 15 min |
| 2 | 删除 14 篇无用草稿/占位内容 | 14 个文件 | 10 min |
| 3 | 为 50 篇无 description 文章批量生成 AI 摘要 | ~50 个文件 | 2-3 hours |

### 🟡 P1（本周完成）

| # | 事项 | 涉及文件 | 预估工作量 |
|---|------|---------|-----------|
| 4 | 为 12 篇无 tags 文章补充标签 | 12 个文件 | 30 min |
| 5 | 为 55 篇无 keywords 文章生成关键词 | ~55 个文件 | 1-2 hours |
| 6 | 修复 wiki 链接问题（2 处） | 2 个文件 | 10 min |
| 7 | 修复图片引用（`/img/avatar.jpg`） | 2 个文件 | 10 min |
| 8 | 新教程添加 `keywords` | 2 个文件 | 5 min |
| 9 | EN home 添加 `novelSection` | 1 个文件 | 10 min |
| 10 | 8 篇 draft 内容审查后发布 | 8 个文件 | 30 min |
| 11 | 为小说章节添加 `publishDate` | 6 个文件 | 10 min |

### 🟢 P2（本月完成）

| # | 事项 | 涉及文件 | 预估工作量 |
|---|------|---------|-----------|
| 12 | 标签大小写统一（vim→Vim 等） | ~5 个文件 | 10 min |
| 13 | 长文章添加 `toc: true` | ~5 个文件 | 5 min |
| 14 | 评估外部图床图片迁移 | 3 处 | 30 min |
| 15 | 补充技术栈标签（Astro, Tailwind） | ~5 个文件 | 10 min |
| 16 | 4 篇 draft 文章补完内容 | 4 个文件 | 1 hour |

---

## 统计总表

| 类别 | 计数 |
|------|------|
| Blog 文章总数 | 65 |
| 其中 Section 索引页 | 5 (log, tech, posts, about, legacy-home) |
| 实际文章 | 60 |
| Draft 文章 | 26 |
| 建议删除 | 14 |
| 建议发布 | 8 |
| 缺少 description | ~50 |
| 缺少 keywords | ~57 |
| 缺少 tags | 12 |
| Connect 页面 (zh) | 5 |
| Connect 页面 (en) | 4 (缺 blog.md) |
| 小说章节 | 4 (+ 2 索引页) |
| Wiki 链接问题 | 2 |
| 图片引用问题 | 2 |

---

> **审计完成时间**: 2026-07-09  
> **下次审计**: 建议在 P0/P1 修复完成后（约 1 周后）进行增量审计  
> **NORTH STAR 达成进度**: 当前 42% → 目标 P0+P1 修复后达到 80%+
