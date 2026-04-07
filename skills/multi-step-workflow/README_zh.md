# Agent Workflow

**通用 agent 工作流引擎，基于状态机。** 适用于任何 OpenClaw agent——研究、调试、配置、开发、数据分析、文档编写。自我管理，零配置。

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
```

工作流由三个脚本通过状态机协调驱动。状态机追踪每个任务所处阶段；脚本之间通过文件通信，保持独立可测试。

## 设计

### 为什么要状态机？

Agent 经常在任务中途被打断、需要 spawn sub-agent、或中途需要重新规划。状态机让每个阶段都清晰可恢复——如果 agent 在任务中途崩溃，状态已保存，下次会话可以直接恢复。

### 为什么要分离成独立脚本？

- **delegate.js** — context 信息提供者。模型自行判断路由决策。
- **task-tracker.py** — 步骤追踪。进度存储在 `~/.openclaw/workspace/project/task-tracker/` 的 JSON 文件中。
- **state-machine.js** — 生命周期管理。状态存储在 `~/.openclaw/workspace/project/state-machine.json`。
- **context-snapshot.js** — OpenClaw context 压缩前的任务上下文保存。关键信息写入外部 JSON 文件。

脚本之间通过文件通信，而非函数调用。这样每个脚本都可以独立测试和运行。

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

### 路由（delegate.js — 仅提供信息，模型自行判断）

delegate.js 仅提供 **context 信息**，不做路由决策。AI 模型根据任务特性自行判断使用 main session 还是 sub-agent。

模型收到：
- 当前 context 百分比和健康状态
- 何时使用 sub-agent 的指导原则
- context ≥ 80% 时的 BLOCK 警告

```bash
node delegate.js <context百分比>
```

**模型的路由原则：** 完全独立可并行的任务 → sub-agent。顺序任务或上下文相关任务 → main session。网络/实时任务 → main session only。

### 脚本 API

#### context-snapshot.js

```bash
# 保存任务上下文（压缩前）
node context-snapshot.js save "<任务>" "<发现>" "<待决事项>"

# 加载保存的上下文（压缩后）
node context-snapshot.js load

# 任务完成后清除快照
node context-snapshot.js clear
```


#### delegate.js

```bash
node delegate.js <context百分比>
```

返回 JSON：
```json
{
  "decision": "MAIN|SUBAGENT|FORCE_SUBAGENT|BLOCK|MAIN_ONLY",
  "reason": "人类可读的解释",
  "spawnSubagent": true|false,
  "urgency": "low|normal|elevated|high|critical"
}
```

#### task-tracker.py

```bash
# 创建带步骤的任务
python3 task-tracker.py new "<任务>" "<步骤1|步骤2|步骤3>"

# 标记步骤完成
python3 task-tracker.py done "<任务>" 1

# 列出所有任务
python3 task-tracker.py list

# 删除任务
python3 task-tracker.py clear "<任务>"
```

数据存储在 `~/.openclaw/workspace/project/task-tracker/` 目录的 JSON 文件中。

#### state-machine.js

```bash
# 初始化新任务
node state-machine.js init "<任务ID>" "<任务名>"

# 获取当前状态
node state-machine.js get "<任务ID>"

# 状态转换
node state-machine.js transition "<任务ID>" PLANNING

# 列出所有活动任务
node state-machine.js list

# 删除任务
node state-machine.js delete "<任务ID>"
```

状态存储在 `~/.openclaw/workspace/project/state-machine.json`。非法的状态转换会被拒绝——这是状态机契约的强制执行。

## 依赖

- `node`（用于 delegate.js 和 state-machine.js）
- `python3`（用于 task-tracker.py）

无其他依赖，无需配置环境变量。

## 扩展

添加新状态，修改 `state-machine.js`：
1. 在 `S` 常量中添加状态
2. 在 `TRANSITIONS` 中添加允许的转换


## 设计理念

**脚手架应该随模型能力变强而变薄。** 只存储无法重新推导的信息。保持框架轻量。

## License

MIT
