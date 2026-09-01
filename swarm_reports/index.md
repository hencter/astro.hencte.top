# 蜂群产出索引 — Swarm Reports Index

> astro.hencte.top 站点所有蜂群代理的产出归档。
> 每次收敛完成后更新此文件。

## 架构

```
swarm_reports/
├── index.md          # 本文件
├── seo/              # SEO+GEO 优化报告
├── perf/             # 性能优化报告
├── ui/               # UI 组件审计报告
├── content/          # 内容运营报告
└── ops/              # 运维监控报告
```

## 报告索引

### 2026-Q2

| 日期 | 领域 | 标题 | 代理 | 文件 |
|------|------|------|------|------|
| 2026-05-20 | 收敛 | Wave 1 综合收敛报告 | convergence | [./2026-05-20_convergence.md](./2026-05-20_convergence.md) |
| 2026-05-20 | seo | SEO+GEO 全面审计 | seo-auditor | [./seo/2026-05-20_seo_audit.md](./seo/2026-05-20_seo_audit.md) |
| 2026-05-20 | perf | 性能瓶颈深度审计 | perf-inspector | [./perf/2026-05-20_perf_audit.md](./perf/2026-05-20_perf_audit.md) |
| 2026-05-20 | ui | UI 组件与设计系统审计 | ui-refactorer | [./ui/2026-05-20_ui_audit.md](./ui/2026-05-20_ui_audit.md) |
| 2026-05-20 | content | 内容运营全面审计 | content-editor | [./content/2026-05-20_content_audit.md](./content/2026-05-20_content_audit.md) |
| 2026-05-20 | ops | 站点健康全面审计 | ops-monitor | [./ops/2026-05-20_ops_audit.md](./ops/2026-05-20_ops_audit.md) |

### 2026-Q3

| 日期 | 领域 | 标题 | 代理 | 文件 |
|------|------|------|------|------|
| 2026-09-02 | 收敛 | Wave 3 GEO+真实性+展示 综合收敛报告 | convergence | [./2026-09-02_geo_convergence.md](./2026-09-02_geo_convergence.md) |
| 2026-07-09 | 收敛 | Wave 2 综合收敛报告 | convergence | [./2026-07-09_convergence.md](./2026-07-09_convergence.md) |
| 2026-07-09 | seo | SEO+GEO 全面审计 v2 | seo-auditor | [./seo/2026-07-09_seo_audit.md](./seo/2026-07-09_seo_audit.md) |
| 2026-07-09 | perf | 性能瓶颈深度审计 v2 | perf-inspector | [./perf/2026-07-09_perf_audit.md](./perf/2026-07-09_perf_audit.md) |
| 2026-07-09 | ui | UI 组件与设计系统深度审计 v2 | ui-refactorer | [./ui/2026-07-09_ui_audit.md](./ui/2026-07-09_ui_audit.md) |
| 2026-07-09 | content | 内容质量全面审计 (10维度) | content-editor | [./content/2026-07-09_content_audit.md](./content/2026-07-09_content_audit.md) |
| 2026-07-09 | ops | 站点运维健康全面审计 v2 | ops-monitor | [./ops/2026-07-09_ops_audit.md](./ops/2026-07-09_ops_audit.md) |

---

## 模板

新报告条目使用以下格式：

```markdown
| YYYY-MM-DD | seo/perf/ui/content/ops | 报告标题 | 代理名 | [文件名](./domain/YYYY-MM-DD_title.md) |
```
