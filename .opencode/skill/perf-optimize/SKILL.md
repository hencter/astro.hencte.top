---
name: perf-optimize
description: Performance optimization pipeline for astro.hencte.top. Covers Lighthouse audits, Core Web Vitals (LCP/CLS), image optimization, font loading, prefetch/preload strategy, build concurrency, CSS/JS minification, service worker, and caching. Use when the user says "性能", "优化速度", "加载慢", "Lighthouse", "Core Web Vitals", "performance", "加载速度".
---

# perf-optimize — 性能优化管道

astro.hencte.top 站点加载性能、运行时性能和构建性能的全方位优化。

## 当前性能配置

| 配置项 | 当前值 | 建议 |
|--------|--------|------|
| build.concurrency | 1 | 提升至 `os.cpus().length` |
| compressHTML | true | ✅ 保持 |
| output | static | ✅ SSG 天然快 |
| 图片优化 | Sharp (隐式) | 显式配置 Astro Image |
| 字体加载 | 部分 preconnect | 全链路优化 |
| Prefetch | 无 | 按需添加 |
| Service Worker | 无 | 可选添加 |
| CSS 体积 | 1118 行 global.css | 审查未使用的 CSS |

## 工作流程

### Step 1: 性能审计
使用 `perf-inspector` 代理完成全站性能审计：
- 分析关键页面的渲染性能瓶颈
- 检查资源加载瀑布流
- 评估 Core Web Vitals 达标情况
- 识别未使用的 CSS/JS

### Step 2: 构建性能优化

#### 构建并发
```js
// astro.config.mjs
import os from "os";

export default defineConfig({
  build: {
    concurrency: os.cpus().length, // 从 1 提升到 CPU 核心数
  },
});
```

### Step 3: 图片优化
- 使用 Astro 内置的 `<Image />` 和 `<Picture />` 组件替代原生 `<img>`
- 配置 Sharp 的默认质量、格式 (WebP/AVIF)
- 添加响应式图片的 `srcset` 和 `sizes` 属性
- 审查现有 `<img>` 标签，逐个迁移

### Step 4: 字体优化
- 确保所有 Google Fonts 加载链接使用 `display=swap`
- 为关键字体添加 `<link rel="preload">`
- 考虑子集化 (subset) 中文字体
- 使用 `font-display: swap` 在 global.css 中声明

### Step 5: 资源预取策略
- 对主导航链接添加 `data-astro-prefetch` 属性
- 对首屏关键图片添加 `<link rel="preload">`
- 对 GA4 脚本使用 `async` 或 Partytown

### Step 6: CSS/JS 优化
- 审查 `global.css` 中未使用的样式（目前 1118 行）
- 使用 Tailwind v4 的 JIT 模式（已内置）确保按需生成
- 确保构建产物启用 CSS 压缩

### Step 7: Service Worker（可选）
- 如需离线支持，考虑使用 Workbox 或 `@astrojs/service-worker`
- 优先缓存静态资源、字体和关键页面

## 关键页面性能审计清单
| 页面 | 路由 | 关注点 |
|------|------|--------|
| 中文首页 | `/` | LCP (头像图片), CLS (字体切换) |
| 英文首页 | `/en` | 同上 |
| 博客列表 | `/blog` | 列表渲染性能 |
| 博客文章 | `/blog/[...slug]` | 内容页 LCP, 代码块渲染 |
| 古籍页面 | `/ancient` + `/blog/ancient/...` | Heti 排版, 竖排渲染 |
| 小说 | `/novel/...` | 长文本渲染, DRM 脚本影响 |
| 项目展示 | `/projects` | 图片加载 |

## 输出规范
- 审计报告写入 `swarm_reports/perf/`
- 文件命名: `YYYY-MM-DD_perf_audit.md`
- 包含：Lighthouse 分数、瓶颈分析、优化建议、预估提升
