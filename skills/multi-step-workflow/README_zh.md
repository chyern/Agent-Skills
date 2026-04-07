# Agent Workflow

**通用 agent 工作流引擎，基于状态机。** 适用于任何 OpenClaw agent——研究、调试、配置、开发、数据分析、文档编写。自我管理，零配置。

## 核心原则：主动化 (Proactive Logic)

> [!IMPORTANT]
> 该 Skill 不仅仅是工具箱，更是 AI 的**标准操作程序 (SOP)**。AI 应当在识别到复杂任务（步骤 > 3 或 涉及深度研究）时，**主动**初始化状态机和任务追踪，无需用户引导。

## 架构

```
任务接收 → [状态机] → 完成
                ↑
          ┌─────┴─────┐
          │           │
        脚本         循环
        delegate    推进
        task-tracker 步骤
        state-machine
        workflow-status (全景视图)
```

工作流由由多个脚本通过状态机协调驱动。状态机追踪每个任务所处阶段；脚本之间通过文件通信，保持独立可测试。

## 设计

### 为什么要状态机？

Agent 经常在任务中途被打断、需要 spawn sub-agent、或中途需要重新规划。状态机让每个阶段都清晰可恢复——如果 agent 在任务中途崩溃，状态已保存，下次会话可以直接恢复。

### 脚本职责

- **delegate.js** — context 信息提供者。帮助模型判断是否需要 sub-agent。
- **task-tracker.js** — 步骤追踪。自动触发状态机流转建议。
- **state-machine.js** — 生命周期管理。
- **context-snapshot.js** — 任务上下文快照，防止 context 压缩导致信息丢失。
- **workflow-status.js** — 工作流全景视图进度展示。

### 状态机

```
IDLE → PLANNING → DELEGATING → EXECUTING → VERIFYING → MEMORYING → DONE
                            ↓
                     WAITING_SUBAGENT → EXECUTING
                            ↓
                       BLOCKED → EXECUTING (或 DONE)
```

| 状态 | 进入条件 |
|------|---------|
| IDLE | 无活动任务 |
| PLANNING | 新任务接收，分析范围 |
| DELEGATING | 计划就绪，判断路由 |
| EXECUTING | 步骤执行中 |
| VERIFYING | 验证结果是否符合预期。失败 → 重试 EXECUTING |
| WAITING_SUBAGENT | sub-agent 已启动，等待结果 |
| MEMORYING | 所有步骤完成，写入模式 |
| BLOCKED | 等待用户确认 |
| DONE | 任务完成 |
| FAILED | 不可恢复错误，可重试 |

## 脚本 API

#### workflow-status.js (推荐首选)

```bash
# 获取所有活动任务的状态、进度和详细步骤的全景视图
node workflow-status.js
```

#### task-tracker.js

```bash
# 创建带步骤的任务
node task-tracker.js new "<任务>" "<步骤1|步骤2|步骤3>"

# 标记步骤完成 (如果所有步骤完成，将自动建议切换状态)
node task-tracker.js done "<任务>" 1

# 列出所有任务进度
node task-tracker.js list
```

#### state-machine.js

```bash
# 初始化新任务
node state-machine.js init "<任务ID>" "<任务名>"

# 状态转换
node state-machine.js transition "<任务ID>" PLANNING EXECUTING
```

#### context-snapshot.js

```bash
# 保存关键发现，防止 context 压缩
node context-snapshot.js save "<任务>" "<发现>" "<待决事项>"
```

## 依赖

- `node` (版本 >= 18)

**无需配置**：脚本会自动创建 `~/.openclaw/workspace/project/` 存储目录。

## License

MIT
