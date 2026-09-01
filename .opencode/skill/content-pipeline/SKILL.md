---
name: content-pipeline
description: Content operations pipeline for astro.hencte.top. Covers blog publishing workflow, i18n content consistency audit, novel chapter management, Markdoc template validation, frontmatter standardization, and content quality review. Use when the user says "内容", "博客", "写文章", "发布", "小说", "翻译", "i18n", "content", "blog", or "novel".
---

# content-pipeline — 内容运营管道

astro.hencte.top 站点的内容创建、审核、发布和维护流程。

## 内容体系

| 集合 | 路径 | 加载器 | 语言 |
|------|------|--------|------|
| blog | `src/content/blog/<section>/*.md` | glob | zh-CN |
| connect | `src/content/<lang>/**/*.md` | glob (zh/en 分离) | zh-CN + en-US |
| novel | `src/content/novel/*.md` | glob | zh-CN |

## 工作流程

### Step 1: 内容审计
使用 `content-editor` 代理审计内容状态：
- 检查所有 Markdoc 文件的前置元数据 (frontmatter) 完整性
- 验证 i18n 页面的中英对应关系
- 扫描断链和死链
- 评估内容新鲜度（按更新时间排序）

### Step 2: 博客发布工作流

#### 新建博客文章
1. 在 `src/content/blog/<section>/` 下创建 `slug.md`
2. 填写 Markdoc frontmatter 模板：
```yaml
---
title: 文章标题
description: 文章摘要 (150-160 字符，用于 SEO)
pubDate: YYYY-MM-DD
updatedDate: YYYY-MM-DD
tags: [tag1, tag2]
section: log | tech | ancient | posts
draft: true
---
```
3. 撰写正文（Markdoc 语法）
4. 构建预览，检查渲染效果
5. 更新 `draft: false` 后提交部署

#### 更新已有文章
1. 修改正文内容
2. 更新 `updatedDate` 字段
3. 如需 SEO 变更，同步更新 `description`

### Step 3: i18n 内容同步
- zh-CN 和 en-US 的连接页 (connect) 应在结构上对等
- 审计 `src/content/zh/` 和 `src/content/en/` 的页面数量是否一致
- 中英文内容的语义对等检查（非字面翻译）
- 站点页面 (about, projects, blog/index, obsidian/plugins) 的中英版本保持更新

### Step 4: 小说内容管理
- 小说章节存放在 `src/content/novel/`
- 小说路由页 (`/novel/[...slug]`) 支持索引、着陆页、章节三级路由
- 新建章节约遵守：
  - 命名规范：`<编号>-<章节名>.md`
  - frontmatter 需包含 `pubDate`, `order`, `draft: true`

## Markdoc Frontmatter 标准

### Blog 文章必填字段
```yaml
title: string        # 必填
description: string  # 必填, 150-160 字符
pubDate: Date        # 必填
updatedDate: Date    # 可选
tags: string[]       # 必填, 至少 1 个
section: string      # 必填: log | tech | ancient | posts
draft: boolean       # 必填, 默认 true
```

### Novel 章节必填字段
```yaml
title: string        # 必填
pubDate: Date        # 必填
order: number        # 必填
draft: boolean       # 必填
```

### Connect 页面必填字段
```yaml
title: string        # 必填
description: string  # 必填
```

## 输出规范
- 审计报告写入 `swarm_reports/content/`
- 文件命名: `YYYY-MM-DD_content_audit.md`
- 包含：i18n 对等状态、frontmatter 合规率、内容新鲜度分布、断链清单
