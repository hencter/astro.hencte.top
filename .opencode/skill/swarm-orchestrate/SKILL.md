---
name: swarm-orchestrate
description: Core swarm orchestration engine for astro.hencte.top. Use when decomposing complex tasks into atom tasks, dispatching sub-agents, enforcing boids protocol, running convergence, or registering new agents. Triggers on "调度", "分解任务", "并发", "收敛", "固化代理", "orchestrate".
---

# swarm-orchestrate — 蜂群调度引擎

astro.hencte.top 站点的蜂群调度核心技能。一切多代理协同操作都通过此 Skill 执行。

## Engineer's Loop

```
Decompose → Focus & Act → Iterate to Convergence
```

### Phase 1: Decompose（拆解）

1. 理解用户任务，识别 North Star（北极星目标）
2. 将任务拆解为原子任务 (Atom Tasks)
3. 构建依赖树：标注任务间的前置依赖关系
4. 为每个原子任务分配合适的代理类型和模型

输出格式（写入 `swarm_reports/` 对应目录）：

```markdown
# 任务拆解报告 — YYYY-MM-DD

## North Star
[一句话描述本轮最高目标]

## 依赖树
- Task A (独立，可并行)
  - Task A1 → agent: seo-auditor, model: deepseek-chat-v3
  - Task A2 → agent: astro-expert, model: anthropic/claude-sonnet-4-6
- Task B (依赖 A1 完成)
  - Task B1 → agent: ui-refactorer

## 并发批次
### Wave 1 (≤10 tasks)
- Task A1, Task A2, Task C1, ...
```

### Phase 2: Focus & Act（执行）

1. 按依赖树分波次 (Wave) 调度
2. 每波 ≤10 个并发子代理
3. 通过 Task tool 发射子代理
4. 追踪 WIP，收集各代理返回的最终消息

**Task tool 调用模板：**

```
Task(
  description="SEO audit for astro.hencte.top",
  subagent_type="seo-auditor",
  prompt="对 astro.hencte.top 站点进行完整的 SEO+GEO 审计，检查 robots.txt、sitemap、结构化数据、meta 标签、hreflang、canonical、RSS feed 等。返回完整的审计报告和改进建议清单。"
)
```

### Phase 3: Convergence（收敛）

波次完成后，发射 `swarm-convergence` 代理：

```
Task(
  description="Converge swarm reports",
  subagent_type="swarm-convergence",
  prompt="读取 swarm_reports/ 下本轮的所有代理报告，检测冲突、综合推理、生成统一的执行计划和优先级排序。返回综合收敛报告。"
)
```

收敛输出写入 `swarm_reports/<domain>/YYYY-MM-DD_convergence.md`。

## Boids Protocol 执行规则

| 规则 | 执行方式 |
|------|----------|
| **Separation** | 子代理的 prompt 中明确排除不相关的领域（如 SEO 审计代理 prompt 中注明"不要涉及性能优化"） |
| **Alignment** | 每个子代理 prompt 中注明本轮 North Star |
| **Cohesion** | 必须通过 swarm-convergence 节点进行综合，不得跳步 |

## 代理注册与固化

### 固化条件检查
当一个临时代理：
1. 被调用 ≥3 次
2. 产出质量 ≥4/5（主观评估）
3. 覆盖 ≥2 种不同任务类型

→ 创建 `.opencode/agent/<name>.md`，格式：

```markdown
---
description: [一句话描述能力和触发条件]
mode: subagent
model: [推荐模型]
---

[详细的 Agent Prompt，包含角色定义、工具权限、工作流程、输出格式要求]
```

## 产出归档规范

每轮完成后的文件操作：
1. 所有代理报告写入 `swarm_reports/<domain>/`
2. 更新 `swarm_reports/index.md` 添加条目
3. 重要经验写入 `agent_memory/lessons_learned.md`
4. 如果本轮有代码变更，执行 git commit
