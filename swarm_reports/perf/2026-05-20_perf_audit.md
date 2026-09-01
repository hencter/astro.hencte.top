# 性能审计报告 — 2026-05-20

## 总体评估

| 维度 | 评分 | 说明 |
|------|------|------|
| 构建配置评分 | **3/10** | `astro.config.mjs` 无任何 build 开关；compressHTML / concurrency 未启用 |
| 资源加载评分 | **4/10** | 字体用 `@import` 阻塞渲染；无 preload / prefetch / Service Worker；图片仅 1 张 SVG |
| 运行时性能评分 | **6/10** | JS 体量不大，但 blur 动画极耗 GPU；NovelLayout 反爬定时器持续运行 |

---

## 发现的问题

### 🔴 严重瓶颈

#### 1. Google Fonts 使用 `@import` 阻塞首屏渲染
- **当前状态**：`src/styles/global.css:1` 顶部 `@import url("https://fonts.googleapis.com/...")`
- **影响**：`@import` 是 **同步阻塞** 的。浏览器必须先下载、解析 CSS，然后发现 `@import`，再发起字体请求链路。整个过程中首屏文字无法渲染。
- **预估提升**：LCP -0.3~0.8s，FCP -0.2~0.5s
- **修复方案**：移除 `@import`，改为 `<link rel="preconnect">` + `<link rel="preload" as="style">` + `<link rel="stylesheet">` 三段式

#### 2. 入口动画使用 `filter: blur()` — 持续 GPU 压力
- **当前状态**：`src/styles/global.css:303-314` `rise-in` 动画包含 `filter: blur(4px)`，`vt-fade-in/out` 包含 `filter: blur(2px)`。所有 `site-main > section` 在页面加载时执行 `rise-in`。
- **影响**：`filter: blur()` 触发 **每帧重绘** 且强制 GPU composition。在低端设备（移动端）上造成显著的 jank 和掉帧。如果首页有 6 个 section，每个 section 在 700ms 内持续 blur 动画，页面在加载完成后 ~1.2s 内处于高负载状态。
- **预估提升**：INP/TBT -50~150ms，可感知的流畅度提升
- **修复方案**：将 `filter: blur(4px)` 替换为 `opacity` + `translateY` 组合（已在用），移除 blur 滤镜

#### 3. `NovelLayout` 反爬脚本持续高频轮询
- **当前状态**：`src/layouts/NovelLayout.astro:424-432` 三个 `setInterval`：每 400ms 触发 `debugger`，每 800ms 检测窗口尺寸差，每 1200ms `console.clear()`。在页面生命周期内永不停止。
- **影响**：
  - CPU 持续占用，移动端设备发热
  - `debugger` 语句虽然对普通用户不可见（浏览器不打开 DevTools 时无效果），但 `performance.now()` 调用和尺寸检查持续运行
  - `console.clear()` 每 1.2s 触发一次，会清空开发者控制台（影响调试）
  - 阻止用户文本选择 (`selectstart` 事件 preventDefault) 破坏 UX
- **预估提升**：移动端 CPU 占用降低 ~2-5%，延长电池续航
- **修复方案**：使用 `requestIdleCallback` 合并检测 + 降低检测频率（如 2s 一次）

#### 4. 缺少 `preconnect` 到 Google Fonts 源站
- **当前状态**：`BaseLayout.astro` 没有对 `fonts.googleapis.com` 和 `fonts.gstatic.com` 的 `<link rel="preconnect">`。`FullscreenAncientLayout.astro:28-29` 正确使用了 preconnect，但两个主布局（BaseLayout + NovelLayout）缺失。
- **影响**：字体请求额外增加 1 次 DNS + 1 次 TCP + 1 次 TLS 往返延迟。国内网络环境下延迟更显著。
- **预估提升**：LCP -0.15~0.3s
- **修复方案**：在 `<head>` 最顶部添加 2 条 preconnect

---

### 🟡 中等优化

#### 5. Build 配置完全未设置
- **当前状态**：`astro.config.mjs` 仅有 `vite.plugins: [tailwindcss()]`、`integrations: [markdoc()]`、`i18n`
- **缺失项**：
  - `build.compressHTML: true` — 可压缩 HTML 输出约 15-25%
  - `build.concurrency` — 默认可能偏低，SSG 场景可调高
  - 无 `vite.build.cssMinify` 显式控制（Tailwind v4 已内置，但可确认）
- **修复方案**：显式添加 `build: { compressHTML: true }` 和适当的 concurrency 值

#### 6. 缺少导航 prefetch
- **当前状态**：所有 `<a>` 标签无 `data-astro-prefetch` 属性。`astro:transitions` 的 `ClientRouter` 在点击后才开始获取下一页面，有额外网络延迟。
- **影响**：页面间导航有 ~200-500ms 的白屏等待
- **修复方案**：对导航栏链接添加 `data-astro-prefetch`，或配置全局 prefetch 策略

#### 7. GA4 脚本未通过 Partytown 卸载到 Web Worker
- **当前状态**：`src/layouts/BaseLayout.astro:78` 使用普通 `<script is:inline async>` 加载 gtag.js。GA4 仍占用主线程。
- **影响**：GA4 脚本解析执行占用主线程 ~50-120ms（移动端更明显）
- **修复方案**：安装 `@astrojs/partytown`，将 GA4 脚本移到 Web Worker 中执行

#### 8. CSS 中 `color-mix()` 在多个关键路径规则中使用
- **当前状态**：`global.css` 中大量使用 `color-mix(in srgb, ...)`（如 `.hero:408`、`.section:492`、`.btn-primary:464` 等），这是 CSS Color Level 5 特性。
- **影响**：`color-mix()` 需要在 paint 阶段实时计算；在非 Chromium 浏览器（Safari < 16、旧 Firefox）上不支持
- **修复方案**：使用 CSS 变量直接定义混合后的颜色值，在 :root 中预计算

#### 9. `backdrop-filter: blur(14px)` 在 sticky header 上持续开销
- **当前状态**：`src/styles/global.css:154-155` `.site-header` 使用 `backdrop-filter: blur(14px) saturate(1.8)`
- **影响**：sticky header 在滚动过程中持续触发 backdrop-filter 重绘。移动端 Safari 上性能开销显著。
- **修复方案**：添加 `will-change: transform` 提示浏览器创建独立合成层，或使用 `@supports` 渐进增强

---

### 🟢 锦上添花

#### 10. `heti` CSS 在 FullscreenAncientLayout 中同步加载
- **当前状态**：`FullscreenAncientLayout.astro:2` 使用 `import "heti/umd/heti.min.css"` 同步捆绑
- **影响**：heti 库包含大量 CSS（中文排版规则），仅古文页面使用但作为 bundle 的一部分
- **修复方案**：确认 heti CSS 体积；如有必要可改为按需加载

#### 11. 无 Content-Security-Policy
- **影响**：不能防止 XSS，也不影响性能，但 CSP 配置中可以明确资源加载白名单，减少不必要的外部请求
- **修复方案**：后续添加 CSP meta 标签

#### 12. 无 `fetchpriority` 提示
- **当前状态**：所有资源（字体、图片）均无 `fetchpriority` 属性
- **修复方案**：Google Fonts 样式表标签添加 `fetchpriority="high"`

#### 13. 首页 content collection 查询三次
- **当前状态**：`src/pages/index.astro` 查询 `connect`、`blog`、`novel` 三个集合。`blog/index.astro` 查询 `connect`、`blog`、`novel` 三个集合。均为构建时执行，不影响客户端性能。
- **修复方案**：无。SSG 构建时开销可接受。

#### 14. `reduced-motion` 可进一步优化
- **当前状态**：已支持 `prefers-reduced-motion: reduce`，处理了动画和 transition
- **改善空间**：`backdrop-filter` 和 `background-attachment: fixed` 也应在 `reduced-motion` 下关闭（后者在 iOS 上性能极差）

---

## 分阶段优化计划

### Phase 1: 立即修复 (P0) — 预计耗时 ~2h
| # | 事项 | 影响 | 文件 |
|---|------|------|------|
| 1 | 字体改为 `<link>` 三段式加载 + preconnect | LCP -0.3~0.8s | `BaseLayout.astro`, `global.css` |
| 2 | 移除 blur 滤镜动画 | INP 显著提升 | `global.css` |
| 4 | 添加 preconnect 到 fonts.googleapis.com | LCP -0.15~0.3s | `BaseLayout.astro`, `NovelLayout.astro` |

### Phase 2: 短期优化 (P1) — 预计耗时 ~3h
| # | 事项 | 影响 | 文件 |
|---|------|------|------|
| 5 | 启用 `build.compressHTML` + 调整 concurrency | 构建产物 -15~25% | `astro.config.mjs` |
| 6 | 导航链接添加 `data-astro-prefetch` | 页面切换感知延迟减半 | `BaseLayout.astro` |
| 7 | Partytown 卸载 GA4 | 主线程空闲时间 +50~120ms | `astro.config.mjs`, `BaseLayout.astro` |
| 3 | NovelLayout 反爬脚本降频 | 降低 CPU 持续占用 | `NovelLayout.astro` |

### Phase 3: 长期增强 (P2) — 预计耗时 ~4h
| # | 事项 | 影响 | 文件 |
|---|------|------|------|
| 12 | 添加预加载资源 `fetchpriority` 提示 | 关键资源加载优先级提升 | `BaseLayout.astro` |
| 8 | `color-mix()` 替换为预计算 CSS 变量 | 兼容性 + paint 性能 | `global.css` |
| 9 | `backdrop-filter` 添加合成层提示 | 滚动流畅度提升 | `global.css` |
| 14 | `reduced-motion` 下关闭 heavy 效果 | iOS 性能提升 | `global.css` |

---

## 具体修复代码建议

### P0-1: 字体加载优化

**`src/styles/global.css:1`** — 删除 `@import` 行：
```diff
- @import url("https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&family=Noto+Sans+SC:wght@400;500;700;900&family=ZCOOL+XiaoWei&display=swap");
  @import "tailwindcss";
```

**`src/layouts/BaseLayout.astro`** — 在 `<head>` 第一个 `<Meta>` 组件后添加：
```astro
<!-- Critical: preconnect to font origins -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<!-- Preload the font stylesheet as high priority -->
<link
  rel="preload"
  as="style"
  href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&family=Noto+Sans+SC:wght@400;500;700;900&family=ZCOOL+XiaoWei&display=swap"
/>
<!-- Fallback: apply stylesheet (won't re-download if preloaded) -->
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&family=Noto+Sans+SC:wght@400;500;700;900&family=ZCOOL+XiaoWei&display=swap"
  media="print"
  onload="this.media='all'"
/>
<noscript>
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&family=Noto+Sans+SC:wght@400;500;700;900&family=ZCOOL+XiaoWei&display=swap"
  />
</noscript>
```

### P0-2: 移除 blur 滤镜动画

**`src/styles/global.css:303-314`**:
```diff
  @keyframes rise-in {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.99);
-     filter: blur(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
-     filter: blur(0);
    }
  }
```

**`src/styles/global.css:1028-1040`**:
```diff
  @keyframes vt-fade-out {
    to {
      opacity: 0;
-     filter: blur(2px);
    }
  }

  @keyframes vt-fade-in {
    from {
      opacity: 0;
-     filter: blur(2px);
    }
  }
```

### P1-1: Build 配置优化

**`astro.config.mjs`**:
```diff
  export default defineConfig({
+   build: {
+     compressHTML: true,
+     concurrency: 4,
+   },
    vite: {
      plugins: [tailwindcss()],
    },
    integrations: [markdoc()],
    // ... i18n
  });
```

### P1-2: 导航 prefetch

**`src/layouts/BaseLayout.astro`** — 为导航链接添加 prefetch：
```diff
  <a href={link.href}>{link.label}</a>
```
→
```astro
  <a href={link.href} data-astro-prefetch="hover">{link.label}</a>
```
同时在 `<head>` 中添加全局 prefetch 配置：
```astro
<meta name="astro-view-transitions-fallback" content="animate" />
```

### P2-1: `reduced-motion` 增强

**`src/styles/global.css`** — 在 `prefers-reduced-motion` 块中添加：
```css
@media (prefers-reduced-motion: reduce) {
  /* ...existing rules... */

  /* Disable GPU-heavy effects */
  .site-header {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }

  body {
    background-attachment: scroll;
  }
}
```
