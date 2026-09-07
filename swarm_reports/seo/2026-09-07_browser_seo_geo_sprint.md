# Browser SEO + GEO Sprint — 2026-09-07

> Protect 轨 sitemap/robots 本地验收通过；live 仍为旧配置（需部署）。Cite 轨 GEO 实体/FAQ/JSON-LD/llms 面已加强。

## Phase A — Protect 轨验证（本地 dist）

| 检查项 | 结果 |
|--------|------|
| `astro.config.mjs` filter/serialize 排除 `/shelf` `/novel` | ✅ 已存在 |
| `public/robots.txt` Disallow 四语 shelf + novel | ✅ 已存在 |
| `pnpm build` sitemap URL 数 | **77** |
| dist sitemap 含 `/shelf` 或 `/novel` | **0** |
| dist `robots.txt` 与 public 一致 | ✅ |

## Phase B — Live browser 审计（https://hencte.top，部署前）

| URL | Title / H1 | Canonical | Robots | describedby / RSS | JSON-LD | 备注 |
|-----|------------|-----------|--------|-------------------|---------|------|
| `/` | 亦幸小阁 \| 项目与博客 / H1 亦幸 | `https://hencte.top/` | （默认 index） | ✅ llms + RSS | Person + WebSite | OG/Twitter 齐全；hreflang 四语+x-default |
| `/about/` | 关于 \| 亦幸小阁 | `/about` | 默认 | ✅ | Person + WebSite | ORCID 可见文案；部署后将有 FAQPage |
| `/tech/seo-geo-architecture/` | SEO+GEO… | 无尾斜杠 canonical | 默认 | ✅ | Person+WebSite+Article+Breadcrumb | Article publisher=Organization；无文章级 hreflang（无译本，正确） |
| `/log/ai-token-carrier-pricing/` | 运营商 Token… | OK | 默认 | ✅ | 同上 Article 套件 | Cite 轨健康 |
| `/shelf/` | 书架 | `/shelf/` | **noindex, noai, noimageai…** | 无（正确） | ItemList/Book | Protect 轨正确；无 RSS/describedby |
| `/en/` | Projects and Blog / H1 Hencter Lew | `/en` | 默认 | ✅ | Person + WebSite | 英文 hub OK |

### Live discovery 端点（部署前 — 仍为旧产物）

| 端点 | 状态 |
|------|------|
| `/sitemap.xml` | **205 URLs，其中 ~128 `/shelf`** — 与本地 77 不一致，**必须部署** |
| `/robots.txt` | 仍 Allow shelf、仅 Disallow `/novel/` — **必须部署** |
| `/llms.txt` `/llms-full.txt` `/llm.txt` `/rss.xml` | 200 OK；编码需 UTF-8 `_headers`（已配置） |

## Phase C — 已实现 GEO 改进（仓库，待部署）

1. **共享实体** `src/lib/geo-site.ts`：作者/ORCID/sameAs、Cite FAQ、markdown FAQ 输出。
2. **llms.txt**：Cite vs Protect 政策、关键实体绝对 URL、FAQ、ORCID、discovery 链接。
3. **llms-full.txt**：绝对 `URL:`、Summary/Tags、Cite/Protect 头注。
4. **llm.txt**：绝对 ENTITY_URL、Protect 与 robots 对齐、GEO 实体、引用 FAQ、LAST_UPDATED 2026-09-07。
5. **JsonLD**：Person `@id`+email+ORCID；WebSite publisher/logo/`@id`；Article logo/isPartOf/copyrightHolder；**FAQPage** 类型。
6. **Meta**：`describedby` → llms.txt；alternate → llm.txt + llms-full.txt；`article:author`。
7. **about（zh/en）**：FAQPage JSON-LD。
8. **robots.txt**：Discovery 注释指向 llms/llm/rss。
9. **RSS description**：去掉暗示小说正文可订阅；明确 Cite 轨。
10. **novel-bibliography**：Protect 文案与 Disallow/sitemap 排除对齐。

**未**把 shelf 加回 sitemap。

## GSC 下一步（部署后）

1. 部署本次构建 → 确认 live `/sitemap.xml` ≈ **77** 且 **0** shelf/novel；`/robots.txt` Disallow `/shelf/`。
2. GSC → 重新提交 sitemap；可用「移除过时内容」或等旧 shelf URL 自然掉出「已发现」队列。
3. **URL 检查（手动）优先 Cite 页**：`/`、`/about/`、`/tech/geo-two-years/`、`/tech/seo-geo-architecture/`、`/tech/geo-two-years-en/`、`/blog/`；请求编入索引。
4. 抽查 `/shelf/`：仍为 noindex；不应再出现在新 sitemap。
5. 可选：Rich Results / schema 验证 About FAQPage + Article。

## 文件清单

- `astro.config.mjs`（既有 Protect 过滤）
- `public/robots.txt`、`public/llm.txt`
- `src/lib/geo-site.ts`（新）
- `src/lib/novel-bibliography.ts`
- `src/pages/llms.txt.ts`、`llms-full.txt.ts`、`rss.xml.ts`
- `src/pages/about.astro`、`src/pages/en/about.astro`
- `src/components/Meta.astro`、`JsonLD.astro`
