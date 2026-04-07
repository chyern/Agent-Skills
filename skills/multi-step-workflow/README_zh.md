# 多步骤工作流 (高信任版 SOP)

轻量级任务追踪，具备 **“机器门控规划” (Machine-Gated Planning)**、**“自主执行” (Autonomous Execution)** 和 **“用户授权式复盘” (User-Opt-In Review)**。

## 安全与合规说明 (ClawHub Audit v3.2.1)

> [!IMPORTANT]
> **零 Shell 执行 (Zero-Shell Execution)**
> 为了符合平台的顶级安全审计，本技能的所有代码 **不再执行任何 Shell 命令**。
> - **读取 (仅限 fs)**：配置通过 Node.js 原生 `fs` 模块直接从 `~/.openclaw/openclaw.json` 读取，不涉及 `child_process`。
> - **写入 (仅限系统)**：Skill 脚本**无法**修改系统配置。如需更改设置，您或 Agent 必须直接使用官方 `openclaw` CLI。
> - **核心逻辑**：这种“读写分离”架构彻底消除了技能脚本“自主提权”并执行恶意二进制文件的可能性。

> [!NOTE]
> **物理安全开关 (需人工操作)**
> 在 `SKILL.md` 中设置 `always: true` 的行为是**严格的人工手动操作**。技能代码在物理上不具备修改此文件的权限。

## 自适应工作流逻辑

1. **快速路径 (< 3 步)**：针对简单的单项任务。直接执行。
2. **标准路径 (>= 3 步)**：
   - **第一步：规划模式**：Agent 拟定计划。**必须停止以等待您的批准**。
   - **第二步：门控跳转**：一旦您说“OK”，Agent 运行 `node scripts/approve.js` 以标记进入执行阶段。
   - **第三步：自主执行**：Agent 自动执行所有计划任务。
   - **第四步：防遗忘机制**：对于耗时极长的任务，Agent 会通过快照进行状态持久化。

## 配置管理

如需开启高吞吐量子代理并行模式，请执行系统命令：
`openclaw config set multi-step-workflow.useSubAgents true --strict-json`

如需安全地查看当前生效配置：
`node scripts/config.js get` （只读模式，无 Shell 派生）

## 脚本与存储说明

- `config.js`：只读配置查询器。
- `task-tracker.js`：进度追踪核心。
- `approve.js`：机器可见的确认标记。
- `context-snapshot.js`：状态快照（具备 PII 自动脱敏）。
- **依赖说明**：Node.js >= 18, OpenClaw CLI。

## 标准用法

1. **分析阶段**：Agent 识别任务复杂度。
2. **规划阶段**：Agent 提出详细的步骤和实施方案。
3. **审批阶段**：Agent 表示“已进入规划模式”并**停下来**。
4. **执行阶段**：您说“OK”。Agent 运行 **approve.js** 并开始自主循环。
5. **恢复阶段**：如果 Agent 中途由于会话限制遗忘了任务，它会自动加载快照。

## 许可证

MIT
