---
name: site-monitor
description: Site operations monitoring pipeline for astro.hencte.top. Covers GA4 analytics review, Google Search Console analysis, dead link detection, content freshness monitoring, build health checks, and deployment verification. Use when the user says "监控", "分析", "数据", "GA4", "搜索控制台", "死链", "运维", "monitor", or "analytics".
---

# site-monitor — 站点运维监控管道

astro.hencte.top 站点的运行监控、数据分析、健康检查和运维管理。

## 监控维度

| 维度 | 数据源 | 频率 |
|------|--------|------|
| 流量分析 | GA4 (G-0YT61J3M3T) | 按需 |
| 搜索表现 | Google Search Console | 按需 |
| 内容健康 | 本地文件扫描 | 按需 |
| 构建状态 | 构建日志 | 每次构建 |
| 死链检测 | 本地 + 外部链接 | 每月 |

## 工作流程

### Step 1: GA4 数据分析
使用 `ops-monitor` 代理分析：
- 最近 30 天的流量趋势
- 热门着陆页 (Top Landing Pages)
- 用户来源分布（自然搜索、直接访问、社交媒体、引荐）
- 用户地理位置分布
- 设备类型分布（桌面/移动/平板）
- 页面平均停留时间和跳出率

### Step 2: 搜索控制台分析
- 热门搜索查询及点击率 (CTR)
- 平均搜索排名位置
- 索引覆盖率（已索引 vs 未索引页面）
- 移动可用性问题
- Core Web Vitals 报告

### Step 3: 死链检测
扫描站点所有 Markdoc 文件和 Astro 组件中的链接：
- 内部链接：检查目标文件是否存在
- 外部链接（可选）：发送 HEAD 请求验证
- 图片引用：检查 `src/assets/` 和 `public/` 中的资源
- Obsidian wikilink：检查 `[[link]]` 格式的引用是否可达

### Step 4: 内容新鲜度审计
- 扫描所有内容文件，提取 `pubDate` 和 `updatedDate`
- 按时间分组：30天内、3个月内、6个月内、1年内、1年以上
- 标记超过 6 个月未更新的"陈旧内容"
- 建议需要刷新或重写的文章

### Step 5: 构建健康检查
- 检查 `astro build` 是否成功
- 审查构建警告（缺失的引用、过时的 API 等）
- 检查构建产物大小（HTML 文件数和总大小）
- 确认关键的 meta 标签是否存在于构建产物中

### Step 6: 代码质量检查
- 检查 `package.json` 依赖是否有已知漏洞
- 确认 lockfile 与 package.json 一致
- 检查 `.gitignore` 是否覆盖敏感文件
- 验证 `markdoc.config.mjs` 是否存在（当前缺失）

## 输出规范
- 监控报告写入 `swarm_reports/ops/`
- 文件命名: `YYYY-MM-DD_ops_monitor.md`
- 包含：关键指标摘要、发现的问题、严重级别、处理建议
