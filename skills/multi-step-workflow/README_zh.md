# 多步骤工作流 (自适应 SOP + 规划模式)

轻量级 AI Agent 任务追踪工具。该技能为复杂任务引入了专业的 **Planning Mode (规划模式)**，确保 Agent 在修改代码前先与您达成一致。

## 自适应工作流逻辑

为了保持高效和专注，Agent 根据任务规模进行分流：

1. **快速路径 (Simple Path < 3 步)**：针对单项任务（如读取文件、解释函数）。Agent 直接执行。
2. **标准路径 (Standard Path >= 3 步)**：针对工程任务。Agent 进入 **Planning Mode** (Phase 2 & 3)，必须先展示计划并**等待您的批准**，然后才能编写任何代码。

## 为什么需要

AI Agent 有时可能过于急躁。规划模式强制 Agent “先想后做”，给您一个在早期发现错误的机会。它还能通过 `task-tracker.js` 保持进度条理清晰。

## 安全与 ClawHub 说明

> [!IMPORTANT]
> **为什么使用 `always: true`?**
> 本技能提供了一套标准作业程序 (SOP)。通过设置 `always: true`，可以让 Agent 始终意识到应对复杂任务时*必须*先进行规划。它是一个逻辑引擎，而非后台进程。
>
> **数据追踪说明**
> - **运行状态**：`task-tracker.js` 将进度保存到 `~/.openclaw/workspace/project/`。
> - **记忆**：最终复盘会写进您的长期记忆（如 `memory/` 或 `MEMORY.md`）。
> - **计划**：实施计划会作为 `.md` 文件创建在您的工作区中，以提高透明度。

## 脚本

| 脚本 | 用途 |
|------|------|
| `task-tracker.js` | 拆分任务为步骤，标记完成，查看进度 |
| `context-snapshot.js` | 在上下文压缩前保存关键发现 |

## 标准用法 (>= 3 步)

1. **第 1 步**：Agent 分析任务并将其识别为“标准 (Standard)”。
2. **第 2 步 (规划模式)**：Agent 创建步骤和实施计划 (implementation_plan.md)。
3. **第 3 步 (审批)**：Agent 声明“我正处于规划模式”并**停止 (STOP)**。
4. **第 4 步 (执行)**：一旦您说“OK”，Agent 将逐步执行任务。

## 手动命令 (可选)

```bash
# 查看所有活动任务和步骤
node scripts/task-tracker.js list

# 标记特定步骤完成
node scripts/task-tracker.js done "任务名" 1
```

## 存储与依赖

- **存储**：`~/.openclaw/workspace/project/`
- **依赖**：Node.js >= 18

## License

MIT
