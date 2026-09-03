---
name: seo-geo-optimize
description: SEO and GEO optimization pipeline for astro.hencte.top. Covers robots.txt, sitemap.xml, RSS feed, structured data (JSON-LD), meta tags, hreflang, canonical URLs, llms.txt, search console, and AI crawler visibility. Use when the user says "SEO", "GEO", "搜索优化", "搜索引擎", "sitemap", "结构化数据", "搜索引擎可见性", or "AI爬虫".
---

# seo-geo-optimize — SEO+GEO 综合优化管道

astro.hencte.top 站点的搜索引擎和 AI 爬虫可见性优化。

## 站点 SEO 现状

| 项目 | 状态 | 备注 |
|------|------|------|
| robots.txt | ❌ 缺失 | 需要创建 |
| sitemap.xml | ❌ 缺失 | 需要 `@astrojs/sitemap` |
| RSS feed | ❌ 缺失 | 需要 `@astrojs/rss` |
| JSON-LD 结构化数据 | ✅ 已有 | `JsonLD.astro` 组件：Organization, WebSite, Article, BreadcrumbList |
| Meta 标签 | ✅ 已有 | `Meta.astro` 组件：OG, Twitter Card, canonical, description, keywords |
| llms.txt | ✅ 已有 | `public/llm.txt` |
| hreflang | ❌ 未显式声明 | Astro i18n 已配置但页面未输出 hreflang |
| @astrojs/partytown | ❌ 缺失 | GA4 脚本未优化 |
| 规范链接 (Canonical) | ✅ 已传递 | 通过布局传入 Meta 组件 |

## 工作流程

### Step 1: SEO 审计
使用 `seo-auditor` 代理完成全站 SEO 审计：
- 检查所有页面的 meta 标签完整性
- 审查结构化数据 (JSON-LD) 的正确性
- 验证 canonical URL 和 hreflang 关系
- 检查图片 alt 文本
- 分析内容关键词覆盖

### Step 2: 基础设施补齐

#### robots.txt
创建 `public/robots.txt`：
```
User-agent: *
Allow: /
Sitemap: https://hencte.top/sitemap-index.xml

User-agent: GPTBot
Disallow: /novel/

User-agent: CCBot
Disallow: /novel/
```

#### sitemap.xml
1. 安装 `@astrojs/sitemap`
2. 在 `astro.config.mjs` 中添加集成
3. 确保 i18n 页面正确生成 sitemap

#### RSS Feed
1. 安装 `@astrojs/rss`
2. 创建 `/rss.xml.js` 路由，包含博客和小说更新

### Step 3: hreflang 增强
在 `Meta.astro` 中添加 hreflang 替换标签：
- 每个页面根据当前 locale 输出对应的 hreflang 链接
- zh-CN → `<link rel="alternate" hreflang="zh-CN" href="...">`
- en-US → `<link rel="alternate" hreflang="en-US" href="...">`
- x-default → `<link rel="alternate" hreflang="x-default" href="...">`

### Step 4: GEO 优化（AI 爬虫可见性）
- 增强 `public/llm.txt`：添加更详细的站点结构描述和关键页面列表
- 创建 `public/llms-full.txt`：包含完整的内容摘要
- robots.txt 中配置 AI 爬虫（GPTBot, CCBot, Claude-Web）的抓取策略
- 注意：小说页面已在 HTML 中设置 `<meta name="robots" content="noai, noimageai">`——不要覆盖此策略

### Step 5: Partytown 集成（可选）
1. 安装 `@astrojs/partytown`
2. 将 GA4 脚本通过 Partytown 加载，减少主线程阻塞
3. 配置 `forward` 选项保留 GA4 追踪功能

## 输出规范
- 审计报告写入 `swarm_reports/seo/`
- 文件命名: `YYYY-MM-DD_seo_audit.md`
- 包含：发现的问题、严重级别、修复方案、预估影响
