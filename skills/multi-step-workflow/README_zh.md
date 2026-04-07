# 多步骤工作流 (高信任版 SOP)

轻量级任务追踪，具备 **“机器门控规划” (Machine-Gated Planning)**、**“自主执行” (Autonomous Execution)** 和 **“用户授权式复盘” (User-Opt-In Review)**。

## 安全与合规说明 (ClawHub Audit v3.0.1)

> [!IMPORTANT]
> **为什么使用 `always: true`?**
> 本技能定义了一套标准作业程序 (SOP)。通过设置 `always: true`，可以让 Agent 始终意识到应对复杂任务 (>= 3 步) 时*必须*遵循结构化计划。
> **如需禁用全局强制策略 (退订)**：请在您的终端运行以下单行命令：
> `sed -i '' '/always: true/d' ~/.openclaw/workspace/project/SKILL.md` (macOS) 或系统等效命令。
>
> **机器可强制门控 (Machine-Enforceable Gate)**
> Agent 被要求在您明确批准实施计划后运行 `node scripts/approve.js`。这在执行日志中留下了明确的“机器标记”，标志着从“规划”正式切换到“执行”。
>
> **沙箱隔离与并发降级配置 (Configurable Spawn Constraints)**
> 为了解决平台的提权安全警告，Agent 默认情况下**严禁**使用 `spawn` 派生子代理，所有任务必须由 Agent 自己依次串行完成。
> 如需开启高吞吐量子代理并行模式，请配置项目中的 `openclaw.json` 或运行：
> `node ~/.openclaw/workspace/project/scripts/config.js set useSubAgents true`
> (可通过 `set maxSubAgents <数>` 限制最大并发量)。
>
> **用户授权式复盘 (User-Opt-In Review)**
> 在 Phase 6 (复盘阶段)，Agent 被明确赋予了指令，**严禁自动写入您的记忆文件**。它会纯粹在对话框中向您展示做得好和不好的地方，把是否要把本次经验保存到硬盘的长记忆中的最终决定权交给您。
>
> **运行环境与存储**
> - **运行环境**：需要 **Node.js >= 18**。
> - **存储路径**：技术状态（如 `approvals.json`, `context-snapshot.json` 等）存储在 `~/.openclaw/workspace/project/`。

## 自适应工作流逻辑

1. **快速路径 (< 3 步)**：针对简单的单项任务。直接执行。
2. **标准路径 (>= 3 步)**：
   - **第一步：规划模式**：Agent 拟定计划。**必须停止以等待您的批准**。
   - **第二步：门控跳转**：一旦您说“OK”，Agent 运行 `node scripts/approve.js` 以标记进入执行阶段。
   - **第三步：自主执行**：Agent 自动执行所有任务（默认串行执行。若配置文件中 `useSubAgents` 开启，则调度子代理并行完成）。
   - **第四步：防遗忘机制**：对于耗时极长的任务，Agent 会主动捕获带有报错信息的快照 (`context-snapshot.js`)，以抵抗底层平台的会话压缩。

## 脚本与存储说明

- `config.js`：参数配置中心（读写 `openclaw.json` 中的 `multi-step-workflow` 命名空间）。
- `task-tracker.js`：进度追踪核心。
- `approve.js`：机器可见的确认标记。
- `context-snapshot.js`：工作空间状态持久化（支持可选的 `[<last_error_log>]` 参数捕获，并且会在保存前强制自动脱敏）。
- **依赖说明**：Node.js >= 18。

## 标准用法

1. **判定**：Agent 识别任务复杂度。
2. **规划**：Agent 创建步骤和实施计划。
3. **审批**：Agent 进入“规划模式”并**停止 (STOP)**。
4. **执行**：一旦您说“OK”，Agent 运行 **approve.js** 后开启自主循环。
5. **恢复**：如果 Agent 在执行中途因为底层会话截断而突然“失忆”，它会自主读取快照恢复认知。

## 许可证

MIT
