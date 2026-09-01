# 内容审计报告 — 2026-05-20

## 审计范围

| 集合 | 加载方式 | 文件总数 |
|------|---------|----------|
| `blog` | `glob("**/*.md", "./src/content/blog")` | 68 |
| `connect` | `glob(["zh/**/*.md", "en/**/*.md"], "./src/content")` | 9 |
| `novel` | `glob("**/*.md", "./src/content/novel")` | 6 |

## 内容配置

- **content.config.ts** (`src/content.config.ts:5-29`): blog schema 定义 `title`(必填), `description`(可选), `date`(可选), `draft`(默认 false), `tags`(默认 []), `section`(可选) 等。使用 `.passthrough()` 允许额外字段。
- **markdoc.config.json**: 指向 `markdoc.config.mjs`，但该文件**不存在**于仓库中——此为 P0 问题。

---

## 博客统计

### 按子目录分组

| 分区 | 文章数 | 其中 draft | 最新文章日期 | 最旧文章日期 | draft 比例 |
|------|--------|-----------|-------------|-------------|-----------|
| log/ | 27 | 5 | 2026-05-04 | 2020-04-07 | 18.5% |
| tech/ | 33 | 16 | 2026-04-24 | 2022-04-22 | 48.5% |
| ancient/ | 2 | 0 | 2023-05-19 | 2022-08-23 | 0% |
| posts/ | 4 | 0 | 2023-03-15 | 2023-01-01 | 0% |
| blog/root* | 2 | 0 | 2022-07-12 | — | 0% |
| **合计** | **68** | **21** | | | **30.9%** |

> *blog/root: `about.md`, `legacy-home.md`——非分区索引页，section 分别为 "about" 和 "legacy-home"。

### 分区明细

**log/** (日常折腾记录):
- 草稿 5 篇: `vim-or-neovim`, `table-rowspan-and-coilspan`, `software`, `hugo-test`, `2025-08-15-hugo-obsidian-plugin-dev`
- 最新内容质量高(2 篇 2026-05 文章具有完整 frontmatter)
- 索引页 `log.md` 内置

**tech/** (技术文章):
- **草稿率 48.5%** — 大量 Hugo 迁移遗留文档处于 draft 状态
- draft 集中在: `hugo/` 子目录(10 篇)、`editor/`(2 篇)、`road/`(1 篇)、`vsc/`(2 篇)
- 2026 年 5 篇高质量技术文章(SEO+GEO、防幻觉、贝叶斯、Combee、AI 工程实践)均为 `draft: false`
- 索引页 `tech.md` 内置

**ancient/** (古籍):
- 2 篇: 《出师表》(Heti 排版测试)、《周髀算经》(数学古籍)
- 均无 draft，但仅 出师表 有 `legacyPath` 标记，周髀算经有 `description`

**posts/** (示例/迁移遗留):
- 3 篇模板示例(post-1/2/3)，内容为 Lorem ipsum
- 无 draft 标记但内容空泛

---

## 内容新鲜度分布

基于文章 `date` 字段，从 2026-05-20 回推:

| 时间范围 | 文章数 | 占比 |
|---------|--------|------|
| 0-90 天 (≥2026-02-20) | 7 | 10.8% |
| 91-180 天 | 0 | 0% |
| 181-365 天 | 5 | 7.7% |
| 1-2 年 | 1 | 1.5% |
| 2-3 年 | 1 | 1.5% |
| 3 年以上 | 51 | 78.5% |
| **合计**(有 date 字段) | **65** | **100%** |
| 无 date 字段 | 3 | — |

> 无 date 字段: `about.md`, `log.md`, `tech.md`(均为索引/特殊页)。`posts.md` 和 `legacy-home.md` 有 date 字段。

### 新鲜度热力图

```
2026-05 ███████ (7 篇: log×2, tech×5)  ← 当前活跃
2025-08 █████ (5 篇: log×2, tech×3)     ← hugo 迁移期
2024-04 █ (1 篇)
2023     ████████████████████████████████████████████████ (大量 Hugo 遗留)
2022     ████████████████████████████████████████████████ (建站初期)
2020     █ (1 篇)
```

**结论**: 78.5% 内容超过 3 年，存在明显的"内容断层"——2023 年大量导入后，2024 年近乎空白，2025 年仅 Hugo 迁移期产出，2026 年恢复活跃。

---

## 小说章节统计

| 作品 | novel 标识 | 章节数 | 章节范围 | draft | 最新章 |
|------|-----------|--------|---------|-------|--------|
| 《我被AI反向驯化了》 | `ai-counter-taming` | 4 | 第1-4章 | 全部 false | 第四章 · 凌晨四点三十 |

| 文件 | 类型 | chapter | draft |
|------|------|---------|-------|
| `ai-counter-taming.md` | 作品主页/简介 | — | false |
| `ai-counter-taming-ch01.md` | 第一章 · 最后一个人类 | 1 | false |
| `ai-counter-taming-ch02.md` | 第二章 · 十一分钟 | 2 | false |
| `ai-counter-taming-ch03.md` | 第三章 · 黄焖鸡 | 3 | false |
| `ai-counter-taming-ch04.md` | 第四章 · 凌晨四点三十 | 4 | false |
| `novel.md` | 小说列表索引 | — | false |

### 小说内容质量

- ✅ 章节编号连续(1→4)，无断层
- ✅ 全部 `draft: false`，可直接发布
- ⚠️ 章节文件缺 `order` 字段(schema 定义了 `order: z.number().optional()`，但实际未使用)
- ⚠️ 作品主页(`ai-counter-taming.md`)仅 7 行，缺 `date`/`tags`/`novel` 等元数据
- ✅ 每章正文篇幅充足(367-417 行)，内容质量高

---

## i18n 覆盖矩阵

| 中文页面 (zh/) | 英文对应 (en/) | 同步状态 | 说明 |
|---------------|---------------|---------|------|
| `zh/home.md` | `en/home.md` | ✅ | 均有完整 hero/focusSection/projectsSection 等 |
| `zh/blog.md` | *(缺失)* | 🔴 | `en/` 下无 blog 索引页 |
| `zh/projects.md` | `en/projects.md` | ✅ | 均有完整项目展示 frontmatter |
| `zh/about.md` | `en/about.md` | ✅ | 均有完整 panels/principles/milestones/cta |
| `zh/obsidian/plugins.md` | `en/obsidian/plugins.md` | ✅ | 均有完整插件列表 |

### i18n 逐页对比摘要

| 页面 | zh-CN 内容 | en-US 内容 | 差异 |
|------|-----------|-----------|------|
| home | `locale: zh-CN`, 中文 hero/subtitle | `locale: en-US`, 英文 hero/subtitle | 仅语言翻译，结构一致 |
| blog | 4 个 sections (log/tech/novel/ancient) + href | **缺失** | 🔴 无英文博客索引 |
| projects | 中文英雄标语, 外站产品→AI.LinkTrust | 英文英雄标语, External Product→AI.LinkTrust | 结构一致，翻译完整 |
| about | 中文 panels/principles/milestones | 英文 panels/principles/milestones | 内容对应完整 |
| obsidian/plugins | 中文插件说明 | 英文插件说明 | 内容对应完整 |

---

## Frontmatter 合规率

基于 68 篇 blog 文件:

| 字段 | 存在数/总数 | 合规率 | 备注 |
|------|-----------|--------|------|
| `title` | 68/68 | 100% | ✅ 全部具备 |
| `section` | 68/68 | 100% | ✅ 全部具备 |
| `draft` | 68/68 | 100% | ✅ 全部具备(默认 false) |
| `description` | 17/68 | 25.0% | 🔴 仅 1/4 文章有描述 |
| `tags` | 54/68 | 79.4% | 🟡 14 篇缺 tags |
| `date` | 65/68 | 95.6% | 🟡 3 篇缺日期(about/log/tech 索引) |
| `publishDate` | 7/68 | 10.3% | ⚪ 仅 2026 年新文章使用 |
| `keywords` | 7/68 | 10.3% | ⚪ 仅 2026 年新文章使用 |
| `toc` | 6/68 | 8.8% | ⚪ 仅 2026 年技术文章使用 |

### description 抽样分析(10 篇)

| 文章 | description 长度 | 评价 |
|------|-----------------|------|
| whose-ai-are-you | 36 字 | ✅ 精炼 |
| kimi-vs-all | 35 字 | ✅ 精炼 |
| seo-geo-architecture | 61 字 | ✅ 信息丰富 |
| bayes-theorem | 59 字 | ✅ 信息丰富 |
| combee-paper | 58 字 | ✅ 信息丰富 |
| anti-hallucination-workflow | 50 字 | ✅ 信息丰富 |
| ai-engineering-practices | 44 字 | ✅ 精炼 |
| vsc/git | 14 字 | 🟡 偏短 |
| editor/lazy-nvim | 14 字 | 🟡 偏短 |
| new-bing | 16 字 | 🟡 偏短 |

**结论**: 2026 年文章 description 质量高(平均 50 字)，老旧迁移文章 description 简短或缺失。

### tags 模式分析

| 类别 | 文章数 | tags 示例 |
|------|--------|----------|
| 2026 新文章 | 7 | `["AI", "DeepSeek", "五四"]`, `["SEO", "GEO", "JSON-LD"]` — 语义化、主题聚焦 |
| 2022-2023 老文章 | ~47 | `["red", "green", "blue"]`(示例) 或 `["CSS", "Style"]` — 泛化、填充式 |
| 无 tags | 14 | 大部分为 Hugo 迁移文档和索引页 |

---

## 链接抽样审计

从 blog 文章和 connect 页面中采样 18 个 Markdown 链接:

### 外部链接 (12 个)

| # | 来源文件 | 链接 | 类型 |
|---|---------|------|------|
| 1 | about.md | `https://github.com/gohugoio/hugo/releases` | 外部 ✅ |
| 2 | about.md | `https://sivan.github.io/heti/` | 外部 ✅ |
| 3 | about.md | `https://unocss.dev/` | 外部 ✅ |
| 4 | about.md | `https://github.com/hencter` | 外部-个人 ✅ |
| 5 | about.md | `https://gitlab.com/hencter` | 外部-个人 ✅ |
| 6 | arch-linux.md | `https://wiki.archlinux.org/` | 外部 ✅ |
| 7 | windows-daily.md | `https://docs.microsoft.com/zh-cn/...` | 外部 ✅ |
| 8 | vim-or-neovim.md | `https://github.com/nshen/learn-neovim-lua` | 外部 ✅ |
| 9 | lazy-nvim.md | `https://www.lazyvim.org/` | 外部 ✅ |
| 10 | new-keyboard-experience.md | `https://cn.varmilo.com/...` | 外部 ✅ |
| 11 | markdown-cheatsheet.md | `https://hencter.top` | 外部-本站 ✅ |
| 12 | hugo/hugo-npm.md | `https://discourse.gohugo.io/...` | 外部 ✅ |

### 内部绝对链接 (6 个)

| # | 来源文件 | 链接 | 目标文件 | 验证 |
|---|---------|------|---------|------|
| 13 | about.md | `/tech/hugo` | `tech/hugo.md` | ✅ 存在 |
| 14 | markdown-cheatsheet.md | `/tech/hugo/emoji` | `tech/hugo/emoji.md` | ✅ 存在 |
| 15 | markdown-cheatsheet.md | `/img/avatar.jpg` | `public/img/avatar.jpg` | ✅ 存在 |
| 16 | road.md | `/tech/road/getting-start` | `tech/road/getting-start.md` | ✅ 存在 |
| 17 | shortcode.md | `/img/avatar.jpg` | `public/img/avatar.jpg` | ✅ 存在 |
| 18 | shortcode.md | `/about` | `about.md` | ✅ 存在 |

### connect 页面内部链接

从 `zh/blog.md` 和 `en/home.md` 的 frontmatter href 字段:
- `zh/blog.md`: `/log`, `/tech`, `/novel`, `/ancient` — 均指向内容分区
- `en/home.md`: `/en/projects`, `/blog` — 英文页面结构
- `zh/home.md`: `/projects`, `/log` — 中文页面导航

**结论**: 所有抽样链接均可达，无死链。但 connect 页面链接全部嵌入在 frontmatter 而非 body 中。

---

## 发现的问题与建议

### 🔴 严重

| # | 问题 | 详情 | 建议 |
|---|------|------|------|
| 1 | **markdoc.config.mjs 缺失** | `markdoc.config.json` 引用 `"path": "markdoc.config.mjs"` 但文件不存在 | 创建 `markdoc.config.mjs` 或移除无效配置 |
| 2 | **en/blog.md 缺失** | zh/ 有 blog 索引页，en/ 无对应页面——英文用户无法导航博客 | 创建 `src/content/en/blog.md`，与 zh 对应 |
| 3 | **48.5% tech 文章为 draft** | tech/ 33 篇中 16 篇 draft: true，大量内容未发布 | 审查并决定：发布、归档或删除 |

### 🟡 中等

| # | 问题 | 详情 | 建议 |
|---|------|------|------|
| 4 | **75% 文章缺 description** | 仅 17/68 篇有 description 字段，严重影响 SEO | 为所有 draft: false 文章补充 description |
| 5 | **20.6% 文章缺 tags** | 14 篇无 tags(主要为 Hugo 迁移文档) | 补充语义化 tags |
| 6 | **5 篇旧 draft 超过 90 天** | log/ 中 `vim-or-neovim`(2022-10), `table-rowspan-and-coilspan`(2024-04), `software`(2022-10) 等长期草稿 | 发布或删除，避免内容腐烂 |
| 7 | **posts/ 分区为占位内容** | 3 篇 Lorem ipsum 示例文章，损害站点专业度 | 删除或替换为真实内容 |
| 8 | **zh/ 链接以 en/ 为枢纽** | `zh/blog.md` 的 primary action 指向 `/projects`(中文)，但 `en/home.md` 指向 `/en/projects` 和 `/blog` | 统一 i18n 路由策略 |

### 🟢 建议

| # | 问题 | 详情 | 建议 |
|---|------|------|------|
| 9 | **小说元数据不完整** | 章节文件缺 `order` 字段，作品主页缺 `date`/`tags` | 补齐所有字段 |
| 10 | **老旧 tags 无信息量** | `["red", "green", "blue"]`, `["CSS", "Style"]` 等 | 用有意义的主题标签替换 |
| 11 | **13 篇 draft 文档含有效链接** | 如 `hugo/` 子目录下的 draft 文档含外部参考链接，但被隐藏 | 考虑将这些作为已发布参考文档 |
| 12 | **about.md 和 legacy-home.md 未归入四大分区** | section 分别为 "about" 和 "legacy-home"，不在 log/tech/ancient/posts 中 | 明确这两个页面的定位 |
| 13 | **2024 年内容空白** | 整年无博客产出 | 如有存量内容可回填，或通过"年度回顾"文章填补 |
| 14 | **RSS / sitemap 依赖内容质量** | 若 description 和 tags 缺失，RSS feed 和 sitemap 输出质量低 | 优先补全元数据后再启用 RSS |

---

## 审计快照

```
         全部 68 篇
   ┌───────┼───────┐
 已发布 47      草稿 21
 (69.1%)       (30.9%)
   │              │
   ├── 有 desc: 13  ├── 有 desc: 4
   ├── 无 desc: 34  └── 无 desc: 17
   │
   ├── 0-90天:  7
   ├── 91-180天: 0
   ├── 181-365天: 5
   ├── 1-2年:   1
   ├── 2-3年:   1
   └── 3年+:   33
```

---

*审计完成时间: 2026-05-20*
*审计工具: opencode (deepseek-v4-pro)*
