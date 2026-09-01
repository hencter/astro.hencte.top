# 性能审计报告 — 2026-07-09

## 总体评估

> ⚠️ 注意: 精确的 Lighthouse/CWV 数据需要通过实际运行获取。以下评估基于代码静态分析。

| 指标 | 预估值 | 目标 | 状态 |
|------|--------|------|------|
| **Lighthouse Performance** | 65-75 / 100 | ≥90 | 🟡 需要优化 |
| **LCP (Largest Contentful Paint)** | 2.8-4.0s | <2.5s | 🔴 超标 |
| **CLS (Cumulative Layout Shift)** | 0.05-0.15 | <0.1 | 🟡 接近阈值 |
| **首屏可交互时间 (FCP)** | 1.8-2.5s | <1.8s | 🟡 偏慢 |
| **构建时间** | ~30-60s | <20s | 🟡 可优化 |

### 测试方法建议
```bash
# 本地运行 Lighthouse
npm run build && npm run preview
# 然后在另一个终端:
npx lighthouse http://localhost:4321 --view --preset=desktop
npx lighthouse http://localhost:4321/blog --view --preset=desktop
npx lighthouse http://localhost:4321/novel/ai-counter-taming --view --preset=desktop
```

---

## 关键瓶颈

### 1. 字体加载策略缺陷 (严重度: 🔴 P0)
- **问题**: `global.css` 首行使用 `@import url("https://fonts.googleapis.com/css2?...")` 加载 4 个字体家族 (Manrope, Noto Sans SC, ZCOOL XiaoWei, Noto Serif SC)。`@import` 在 CSS 文件内部是串行加载的——浏览器必须先下载 global.css，解析到 `@import`，再发起字体 CSS 请求，再解析字体 CSS 发现字体文件 URL，最后才开始下载字体。这形成了 **4 跳链式加载**: HTML → global.css → fonts.googleapis.com CSS → fonts.gstatic.com 字体文件。
- **现状**: 
  - `global.css` L1: `@import url("https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&family=Noto+Sans+SC:wght@400;500;700;900&family=ZCOOL+XiaoWei&display=swap")`
  - BaseLayout 中**没有** `<link rel="preconnect">` 到 Google Fonts 域名
  - `FullscreenAncientLayout.astro` 中有正确的 preconnect，但这是孤立的
  - 虽然有 `display=swap` 参数，但字体下载延迟仍导致文字在较长时间内以回退字体渲染
- **方案**: 从 `@import` 迁移到 `<link>` 标签 + preconnect + 可选 preload
- **提升**: LCP -0.3~0.8s, CLS 改善约 0.02-0.05
- **步骤**:
  1. 移除 `global.css` 中的 `@import url(...)` 行
  2. 在 `BaseLayout.astro` 的 `<head>` 中添加:
     ```html
     <link rel="preconnect" href="https://fonts.googleapis.com" />
     <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
     <link
       href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&family=Noto+Sans+SC:wght@400;500;700;900&family=ZCOOL+XiaoWei&display=swap"
       rel="stylesheet"
       media="print"
       onload="this.media='all'"
     />
     ```
  3. 考虑为首屏关键字体 (如 hero title 使用的 ZCOOL XiaoWei) 添加 `<link rel="preload" as="font">`
  4. 将 Manrope 和 Noto Sans SC 的 `wght` 范围精简——目前加载了多个 weight，但站点实际只用了 400、500、700、800/900

### 2. 构建并发未优化 (严重度: 🔴 P0)
- **问题**: `astro.config.mjs` 中未设置 `build.concurrency`，Astro 默认值为 1。在 SSG 模式下，这意味着所有页面的渲染是串行的。对于拥有 70+ 篇博客内容 + 多语言页面的站点，这严重拖慢构建速度。
- **现状**: 无任何 build 配置块
- **方案**: 显式设置并发数为 CPU 核心数
- **提升**: 构建时间 -50~70%
- **步骤**:
  ```js
  // astro.config.mjs
  import os from "node:os";

  export default defineConfig({
    build: {
      concurrency: os.cpus().length,  // 通常 4-16
    },
    // ... 其余配置
  });
  ```

### 3. 图片完全未优化 (严重度: 🔴 P0)
- **问题**: 全站使用原生 `<img>` 标签，未使用 Astro Image 组件。图片以原始格式和原始尺寸提供，无响应式断点，无现代格式转换。
- **现状**:
  - Sharp 已作为 Astro 的传递依赖存在 ✅
  - 但未配置 `@astrojs/image` 或使用 Astro 内置 `<Image />` / `<Picture />` 组件
  - `public/img/avatar.jpg` (14.5KB) — 以原始 JPEG 提供
  - `public/img/2265276667.png` (~953KB) — **未被任何文件引用，死资产！**
  - `public/qr-wechat.svg` — SVG 适合保持矢量格式
  - 所有 `<img>` 使用位置:
    - `index.astro` L241: QR code (有 width/height ✅)
    - `WechatWidget.astro` L8: QR code (有 width/height ✅)
    - `NovelLayout.astro` L339, L419: QR code (有 width/height ✅)
  - 外部图片 (`s2.loli.net`) 无 `loading="lazy"`
- **方案**: 迁移到 Astro Image 组件 + 清理死资产
- **提升**: LCP -0.3~1.0s (取决于首屏是否有大图), 带宽节省 40-70%
- **步骤**:
  1. **立即删除** `public/img/2265276667.png` — 953KB 垃圾文件
  2. 在 `astro.config.mjs` 中添加 image 配置:
     ```js
     export default defineConfig({
       image: {
         service: {
           entrypoint: 'astro/assets/services/sharp',
         },
         domains: ["s2.loli.net"],  // 允许优化外部图片
       },
     });
     ```
  3. 将首屏图片 (`avatar.jpg`, `qr-wechat.svg`) 迁移到 `src/assets/` 并使用 `<Image />`:
     ```astro
     ---
     import { Image } from 'astro:assets';
     import avatarImg from '@assets/avatar.jpg';
     ---
     <Image
       src={avatarImg}
       alt="亦幸的头像"
       width={200}
       height={200}
       formats={['avif', 'webp']}
       loading="eager"  <!-- 如果是 LCP 元素 -->
     />
     ```
  4. 对非首屏图片添加 `loading="lazy"` 和 `decoding="async"`

### 4. GA4 脚本加载位置不当 (严重度: 🔴 P0)
- **问题**: GA4 脚本在 `<head>` 中以内联脚本加载。虽然是 `async`，但仍会与首屏关键资源竞争带宽和 CPU。`is:inline` 意味着它不会被 Astro 打包优化。
- **现状**: `BaseLayout.astro` L78-84
  ```html
  <script is:inline async src="https://www.googletagmanager.com/gtag/js?id=G-0YT61J3M3T"></script>
  <script is:inline>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-0YT61J3M3T');
  </script>
  ```
- **方案**: 移动到 `</body>` 前，或使用 Partytown 将 GA4 移入 Web Worker
- **提升**: INP 改善 50-100ms, LCP -0.1~0.2s
- **步骤** (方案 A — 快速修复):
  1. 将 GA4 脚本从 `<head>` 移至 `</body>` 前
  2. 改为外链脚本 (非 `is:inline`) 以便 Astro 优化

  方案 B — 最佳实践 (Partytown):
  ```bash
  pnpm add @builder.io/partytown
  ```
  ```js
  // astro.config.mjs
  import partytown from '@astrojs/partytown';
  export default defineConfig({
    integrations: [
      partytown({ config: { forward: ['dataLayer.push'] } }),
    ],
  });
  ```
  ```html
  <!-- BaseLayout.astro -->
  <script type="text/partytown" src="https://www.googletagmanager.com/gtag/js?id=G-0YT61J3M3T"></script>
  ```

### 5. 小说页面存在持续性性能损耗 (严重度: 🔴 P0)
- **问题**: `NovelLayout.astro` 包含 3 个 `setInterval` 定时器（400ms、800ms、1200ms 间隔）持续运行，用于 DevTools 检测。这些定时器永久占用主线程，严重损害 INP。
- **现状**: `NovelLayout.astro` L425-435
  ```js
  setInterval(function(){...debugger...}, 400);
  setInterval(function(){...window size check...}, 800);
  setInterval(function(){console.clear();...}, 1200);
  ```
  另有 5 个事件监听器阻止复制/剪切/右键/选择/拖拽 — 每个用户交互都被拦截。
- **方案**: 大幅降低定时器频率 + 使用 `requestIdleCallback` 包装
- **提升**: 小说页面 INP 改善 100-300ms
- **步骤**:
  1. 将 DevTools 检测的 `setInterval` 间隔从 400/800/1200ms 提高到 2000/3000/5000ms
  2. 使用 `requestIdleCallback` 包装非关键检查:
     ```js
     function idleCheck(fn) {
       if ('requestIdleCallback' in window) {
         requestIdleCallback(fn);
       } else {
         setTimeout(fn, 1);
       }
     }
     ```
  3. 考虑将 DRM 逻辑提取到独立脚本并通过 `defer` 加载

---

### 6. 缺少资源预取策略 (严重度: 🟡 P1)
- **问题**: View Transitions 的 `ClientRouter` 已配置，但未启用预取。用户悬停或即将点击导航链接时，没有任何预加载发生。
- **现状**:
  - `BaseLayout.astro` L2: `import { ClientRouter } from "astro:transitions"` ✅
  - `BaseLayout.astro` L67: `<ClientRouter />` ✅
  - 导航链接无 `data-astro-prefetch` 属性 ❌
  - 无 `<link rel="prefetch">` 或 `<link rel="preload">` ❌
  - 仅 `FullscreenAncientLayout` 有字体 preconnect
- **方案**: 为导航链接添加 prefetch 属性
- **提升**: 导航感知速度提升 50-80% (页面瞬间切换)
- **步骤**:
  1. 为所有主要导航链接添加 `data-astro-prefetch`:
     ```astro
     <a href="/blog" data-astro-prefetch="hover">博客</a>
     ```
  2. 在 `BaseLayout.astro` 中为 `<head>` 添加关键资源 preload:
     ```html
     <!-- 预加载关键字体 -->
     <link rel="preload" as="font" href="..." type="font/woff2" crossorigin />
     ```
  3. 考虑为博客列表页的前几篇文章链接添加 `data-astro-prefetch="viewport"` (当链接进入视口时预取)

### 7. CSS `@import` 链式加载 (严重度: 🟡 P1)
- **问题**: 即使将字体迁移到 `<link>`，`global.css` 仍有 `@import "tailwindcss"` (L2)。虽然这是 Vite 在构建时处理的虚拟导入，但在 dev 模式下可能产生实际的 import。
- **现状**: `global.css` L1-2:
  ```css
  @import url("https://fonts.googleapis.com/css2?...");
  @import "tailwindcss";
  ```
- **方案**: 移除字体 `@import`，保留 Tailwind 的 `@import` (这是 Tailwind v4 + Vite 的标准用法)
- **步骤**: 见瓶颈 #1

### 8. CSS 体积优化空间 (严重度: 🟡 P1)
- **问题**: `global.css` 1535 行包含大量组件级样式。虽然不是所有页面都使用全部样式（如 callout 变体、Mermaid、KaTeX、小说样式只在特定页面使用），但所有 CSS 都在首屏加载。
- **现状**:
  - 1535 行 CSS (约 ~24KB raw, gzip 后约 5-7KB)
  - Tailwind v4 的 JIT 模式已启用 ✅
  - 存在页面专属样式：callout 14 种变体 (约 55 行)、Mermaid (约 15 行)、KaTeX (约 12 行)、小说排版 — 不是所有页面都需要
  - 但 CSS 总量尚可，gzip 后体积不大
- **方案**: 对于当前规模 (~24KB)，CSS 分割的收益有限。但可以考虑:
  1. 将页面专属样式提取到对应 Layout 的 `<style>` 块
  2. 使用 `is:global` 或 scoped style 减少全局 CSS 体积
- **提升**: 首屏 CSS -10~15%

### 9. Heti 脚本同步加载 (严重度: 🟡 P1)
- **问题**: 古代文章页面 (AncientPostLayout, FullscreenAncientLayout) 中，Heti 插件脚本通过 `<script src={hetiAddonUrl}>` 加载 — 这是同步的，会阻塞解析。
- **现状**:
  - `AncientPostLayout.astro` L149: `<script src={hetiAddonUrl}></script>`
  - `FullscreenAncientLayout.astro` L263: `<script src={hetiAddonUrl}></script>`
  - `heti-addon.min.js` 通过 Vite 的 `?url` 后缀导入，获得的是构建后的 URL
- **方案**: 添加 `defer` 或 `async` 属性
- **提升**: 古代文章页面 LCP -0.1~0.3s
- **步骤**: 将 `<script src={hetiAddonUrl}></script>` 改为 `<script src={hetiAddonUrl} defer></script>`

---

### 10. 缺少缓存策略 (严重度: 🟡 P1)
- **问题**: 作为静态站点，所有资源输出到 `dist/` 目录。但未配置任何 `Cache-Control` 头。静态资源（CSS、JS、字体、图片）应使用长期缓存，HTML 应使用短期缓存。
- **现状**: 无 `netlify.toml`、`vercel.json` 或 `_headers` 文件
- **方案**: 根据部署平台配置缓存头
- **步骤** (以 Netlify 为例):
  ```toml
  # netlify.toml
  [[headers]]
    for = "/_astro/*"
    [headers.values]
      Cache-Control = "public, max-age=31536000, immutable"

  [[headers]]
    for = "/favicon.*"
    [headers.values]
      Cache-Control = "public, max-age=604800"

  [[headers]]
    for = "/*.html"
    [headers.values]
      Cache-Control = "public, max-age=0, must-revalidate"
  ```

  或以 `_headers` 文件 (Netlify/Cloudflare Pages):
  ```
  /_astro/*
    Cache-Control: public, max-age=31536000, immutable

  /img/*
    Cache-Control: public, max-age=604800, stale-while-revalidate=86400

  /*
    Cache-Control: public, max-age=0, must-revalidate
  ```

### 11. 外部图片无优化 (严重度: 🟢 P2)
- **问题**: 博客文章 `2022-03-09-tree.md` 引用外部图片 `https://s2.loli.net/2023/03/09/ZJ9gerc8nVIu2PF.jpg`，无懒加载属性，无格式转换。
- **现状**: Markdown 中的标准 `![](url)` 语法 → 渲染为 `<img>` 无任何优化属性
- **方案**: 使用自定义 Markdoc 组件或 remark 插件自动添加 `loading="lazy"` 和 `decoding="async"`
- **步骤**:
  1. 在 Markdoc 或 Markdown 渲染中注入图片属性:
     ```js
     // 在 remark 插件中
     visit(tree, 'image', (node) => {
       node.data = node.data || {};
       node.data.hProperties = {
         loading: 'lazy',
         decoding: 'async',
         ...(node.data.hProperties || {}),
       };
     });
     ```

### 12. 无 Service Worker (严重度: 🟢 P2)
- **问题**: 纯静态站点非常适合 Service Worker。可以实现离线访问和重复访问的即时加载。
- **现状**: 无任何 SW 实现
- **方案**: 使用 `@astrojs/service-worker` 或 Workbox
- **提升**: 重复访问加载时间 -80~95%
- **步骤**:
  ```bash
  pnpm add @astrojs/service-worker
  ```
  ```js
  // astro.config.mjs
  import serviceWorker from '@astrojs/service-worker';
  export default defineConfig({
    integrations: [serviceWorker()],
  });
  ```
  默认会预缓存所有静态页面和资源。

### 13. 动画性能总体良好但可微调 (严重度: 🟢 P2)
- **问题**: 动画性能总体健康——大部分使用 `transform` 和 `opacity` (GPU 加速)。但某些动画使用了 `filter: blur()` 和 `background-position`，这些不如 transform/opacity 高效。
- **现状**:
  - `@keyframes rise-in`: 使用 `transform: translateY()` + `opacity` + `filter: blur()` — 前两者 GPU 友好，blur 是 CPU 密集型
  - `@keyframes hero-reveal`: 使用 `background-position` — 触发 repaint
  - 已有 `prefers-reduced-motion` 媒体查询 ✅
  - View Transitions 动画使用 `opacity` + `filter: blur()` — blur 是瓶颈
- **方案**: 将 `filter: blur()` 替换为 `clip-path` 或简化为纯 opacity
- **步骤**:
  1. `@keyframes rise-in` 中移除 `filter: blur(4px)`，改为 `opacity: 0; transform: translateY(20px)`
  2. `@keyframes vt-fade-out` 和 `vt-fade-in` 中移除 `filter: blur(2px)`

---

## 优化实施计划

### Phase 1: 立即修复 (P0) — 预计 2-3 小时

| # | 操作 | 文件 | 预估影响 |
|---|------|------|----------|
| 1 | **删除死图片** `public/img/2265276667.png` | 删除文件 | 节省 953KB |
| 2 | **字体从 @import 迁移到 `<link>`** | `global.css` + `BaseLayout.astro` | LCP -0.3~0.8s |
| 3 | **添加字体 preconnect** | `BaseLayout.astro` | LCP -0.1~0.2s |
| 4 | **构建并发优化** | `astro.config.mjs` | 构建时间 -50~70% |
| 5 | **GA4 移至 `</body>` 前** | `BaseLayout.astro` | INP +50~100ms |
| 6 | **NovelLayout 定时器频率降低** | `NovelLayout.astro` | INP +100~300ms |

### Phase 2: 短期优化 (P1) — 预计 1-2 周

| # | 操作 | 预估影响 |
|---|------|----------|
| 7 | 为导航链接添加 `data-astro-prefetch` | 导航感知速度 +50~80% |
| 8 | Heti 脚本添加 `defer` | 古文页面 LCP -0.1~0.3s |
| 9 | 配置缓存策略 (根据部署平台) | 重复访问速度 +30~50% |
| 10 | Markdown 图片自动添加 `loading="lazy"` | 内容页带宽节省 |
| 11 | Astro Image 组件迁移 (avatar, QR) | LCP -0.1~0.3s |

### Phase 3: 长期增强 (P2) — 预计 1 月内

| # | 操作 | 预估影响 |
|---|------|----------|
| 12 | Service Worker | 离线支持, 重复访问秒开 |
| 13 | 动画 `filter: blur()` 替换 | 渲染帧率提升 |
| 14 | GA4 Partytown 迁移 | INP 进一步改善 |
| 15 | 字体子集化 (中文 SC 字体) | 字体文件 -70% |
| 16 | CSS 按页面分割 | 首屏 CSS -10~15% |

---

## 风险与权衡

### 字体加载
- **风险**: 从 `@import` 迁移到 `<link>` + `media="print" onload` 技巧时，如果 JavaScript 被禁用，字体将不会加载。对于博客站点场景，JS 禁用用户极少 (<0.2%)。
- **缓解**: 提供 `<noscript>` 回退:
  ```html
  <noscript>
    <link href="https://fonts.googleapis.com/css2?..." rel="stylesheet" />
  </noscript>
  ```

### GA4
- **风险**: 将 GA4 移至 `</body>` 前可能导致某些快速跳出 (<1s) 的访客未被追踪。
- **权衡**: 使用 `async` 属性保持加载但降低优先级，比完全延迟更平衡。GA4 的 beacon API 会自动处理页面卸载时的发送。

### NovelLayout DRM
- **风险**: 降低定时器频率可能略微削弱 DevTools 检测效果。但当前实现本身即可被绕过（禁用 JS 时完全失效）。
- **权衡**: 将定时器间隔从 400ms 提高到 2000ms 仍能有效检测，同时大幅降低 CPU 占用。

### Service Worker
- **风险**: SW 可能导致"旧页面缓存"问题——用户看到过时内容。
- **缓解**: 使用 `@astrojs/service-worker` 的默认策略（stale-while-revalidate），或配置适当的缓存过期策略。

### 构建并发
- **风险**: 在 CI/CD 环境中，过高的并发可能与容器 CPU 限制冲突。
- **缓解**: 使用 `Math.min(os.cpus().length, 4)` 或在 CI 环境中通过环境变量 `BUILD_CONCURRENCY` 控制。

---

## 量化预估汇总

| Phase | 投资 | LCP 改善 | CLS 改善 | INP 改善 | 构建时间改善 |
|-------|------|----------|----------|----------|-------------|
| Phase 1 (P0) | 2-3h | **-0.5~1.2s** | **-0.02~0.05** | **+150~400ms** | **-50~70%** |
| Phase 2 (P1) | 4-8h | -0.1~0.4s | — | +20~50ms | — |
| Phase 3 (P2) | 8-16h | — | — | +30~80ms | — |
| **合计** | **14-27h** | **-0.6~1.6s** | **-0.02~0.05** | **+200~530ms** | **-50~70%** |

> 实施 Phase 1 后，预期 Lighthouse Performance 从 65-75 提升至 85-92。LCP 有望达到 <2.5s 目标。

---

## 附录: 当前资源清单

### 图片资源
| 文件 | 路径 | 大小 | 状态 |
|------|------|------|------|
| avatar.jpg | public/img/ | ~14.5KB | 在 3 篇博客中被引用 |
| 2265276667.png | public/img/ | ~953KB | **未被引用，建议删除** |
| qr-wechat.svg | public/ | ~2KB (SVG) | 在 3 处使用 (index, wechat widget, novel) |
| favicon.svg | public/ | ~1KB | ✅ |
| favicon.ico | public/ | ~4KB | ✅ |

### 第三方依赖加载方式
| 依赖 | 加载方式 | 位置 | 阻塞？ |
|------|----------|------|--------|
| Google Fonts (4 families) | `@import` in CSS | global.css L1 | 🔴 是 — 链式加载 |
| GA4 (gtag.js) | `<script is:inline async>` | BaseLayout.astro head | 🟡 async 但抢占带宽 |
| Heti CSS | `import "heti/umd/heti.min.css"` | AncientPostLayout | 🟡 CSS bundle 内 |
| Heti JS | `<script src=...>` (同步) | AncientPostLayout | 🔴 是 — 阻塞解析 |
| lunar-javascript | `import { Solar }` | AncientPostLayout | 🟢 服务端执行 |

### 关键页面性能画像

| 页面 | 路由 | 字体需求 | 脚本 | 图片 | 特殊关注 |
|------|------|----------|------|------|----------|
| 中文首页 | `/` | Manrope + Noto Sans SC + ZCOOL XiaoWei | GA4 + 主题 + scroll reveal | 1个QR SVG | LCP 可能是 hero-title 文字 |
| 英文首页 | `/en` | 同上 | 同上 | 同上 | 同上 |
| 博客列表 | `/blog` | 同上 | 同上 | 无 | 列表渲染性能 |
| 博客文章 | `/blog/...` | 同上 | 同上 + Shiki? | 可能含外部图片 | 代码块渲染, 外部图片 |
| 古籍页面 | `/ancient/...` | ZCOOL XiaoWei + Noto Serif SC | GA4 + 主题 + Heti + lunar | 无 | Heti JS 加载, 竖排渲染 |
| 小说章节 | `/novel/...` | Noto Serif SC (系统) | DRM 定时器 + 事件拦截 | 1个QR SVG | 大量持续性 JS, INP 杀手 |
