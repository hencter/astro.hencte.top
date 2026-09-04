# Lighthouse 性能修复收敛 — 2026-09-04

> 输入：生产 Lighthouse 13.4.1 @ https://hencte.top/（desktop / simulate）
> Performance ≈ 0.51 · A11y ≈ 0.96 · SEO ≈ 0.92 · Best Practices = null
> Runtime：`PROTOCOL_TIMEOUT`（`CSS.enable`）+ “page loaded too slowly”；部分 audit 不完整，以网络瀑布与可复现诊断为准。

## 诊断（忽略浏览器扩展噪声）

| 问题 | 证据 | 优先级 |
|------|------|--------|
| 字体爆炸 | Google Fonts 单 URL 拉满 4 族多字重 → ~28 个 `/cf-fonts` 请求；CSS ~247KB | P0 |
| 超大图 | `nova.png` **2.43MB**；Lighthouse image-delivery ≈ 2.3MB 节省 | P0 |
| LCP 发现 | Banner `home.webp` eager 但无 `fetchpriority=high` | P0 |
| charset 过晚 | BaseLayout 字体 link 在 `<Meta />` 前 → charset 超出首 1024 字节 | P0 |
| CTA 对比度 | 生产仍见 `#f8f5ee` on `#b8792c`（3.31:1）；本地已用 `--brand-deep` | P1（需部署） |
| robots.txt 超时 | `public/robots.txt` 合法；Lighthouse fetch timeout 偏 flake | OK |
| 扩展脚本 | 沉浸式翻译 / KeePassXC 等计入 unused-JS — 非站点问题 | 忽略 |

## 已落地修复

### 1. 字体瘦身 — `BaseLayout.astro`
- **Critical（阻塞）**：`Manrope 400;700` + `Noto Sans SC 400;700`
- **Deferred（print→all）**：`Noto Serif SC 400;700` + `ZCOOL XiaoWei`
- Novel / Ancient 独立布局未改

### 2. 图片 — nova + LCP
- 新增 `public/img/projects/nova.webp`：**122KB**（1200×800，q82）← PNG 2.43MB
- 内容引用：`zh/en` 的 `home.md` / `projects.md` → `.webp`
- `Banner.astro`：page 变体 LCP `fetchpriority="high"`
- `HomeSections.astro`：特色项目图 `loading="lazy"` + `fetchpriority="low"`

### 3. charset — `BaseLayout.astro`
- `<Meta />`（首行 charset）移到 `<head>` 最前；构建验证 charset ≈ byte 47

### 4. 对比度
- `.btn-primary` 本地已用 `--brand-deep`（#845414）
- 本轮补修 `.skip-link` 同色对，避免同一失败模式
- **生产 hencte.top 需重新部署后 Lighthouse 才会绿**

### 5. robots.txt
- 无代码变更；文件与 Sitemap 声明正常

## 预期效果（部署后复测）

| 指标 | 预期方向 |
|------|----------|
| FCP / LCP | 关键路径字体与 CSS 体积下降 + LCP 优先加载 |
| total-byte-weight | −~2.3MB（nova） |
| image-delivery | 大图项消失或大幅缩小 |
| charset | pass |
| color-contrast（CTA） | pass（部署后） |
| PROTOCOL_TIMEOUT | 页面更快结束后更不易触发；仍可能受本机扩展/节流影响 |

## 未做 / 后续

- [ ] 将其它大图项目 PNG（tongtianlu / monopoly）按需 WebP
- [ ] 自托管或子集化 CJK 字体，彻底摆脱 Google/`cf-fonts` 瀑布
- [ ] Banner `home.webp` 增加 `srcset` / 更小长边
- [ ] 部署后无痕隐私窗口复测 Lighthouse（禁扩展）
- [x] git commit + push `origin/main`（触发 Cloudflare Workers Builds）

## 子代理

| 任务 | Agent |
|------|-------|
| 字体 | [Slim homepage fonts](5cd924de-08d7-4560-aed7-5a28d5a45eaa) |
| 图片 | [Optimize images LCP](afde4b37-dd37-4cd7-8885-1f61f9233ebb) |
| charset | [Fix charset head order](847a6c54-18bb-400d-9d9e-866909f29968) |
| 核对对比度/robots | [Verify contrast robots](f0e6ff53-b44c-4e2c-9a1f-960b0ecfc60f) |
