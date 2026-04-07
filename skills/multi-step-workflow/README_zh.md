# 多步骤工作流 (高信任版 SOP)

轻量级任务追踪，具备 **“机器门控规划” (Machine-Gated Planning)**、**“自主并行执行” (Autonomous Parallel Execution)** 和 **“隐私保护复盘” (Privacy-Aware Review)**。

## 安全与合规说明 (ClawHub Audit v2.6.1)

> [!IMPORTANT]
> **为什么使用 `always: true`?**
> 本技能定义了一套标准作业程序 (SOP)。通过设置 `always: true`，可以让 Agent 始终意识到应对复杂任务 (>= 3 步) 时*必须*遵循结构化计划。
> **如需禁用全局强制策略**：您可以告知 Agent “移除 multi-step-workflow 元数据中的 always: true” 或手动编辑 `SKILL.md`。
>
> **机器可强制门控 (Machine-Enforceable Gate)**
> Agent 被要求在您明确批准实施计划后运行 `node scripts/approve.js`。这在执行日志中留下了明确的“机器标记”，标志着从“规划”正式切换到“执行”。
>
> **隐私与脱敏 (Privacy & Sanitization)**
> 在 Phase 6 (复盘阶段)，Agent 被明确赋予了 **PII (个人身份信息) 脱敏** 指令。在将总结写入长期记忆前，必须移除或遮蔽所有敏感个人代号、凭据或隐私数据。
>
> **运行环境与存储**
> - **运行环境**：需要 **Node.js >= 18**。
> - **存储路径**：技术性 JSON 状态存储在 `~/.openclaw/workspace/project/`。

## 自适应工作流逻辑

1. **快速路径 (< 3 步)**：针对简单的单项任务。直接执行。
2. **标准路径 (>= 3 步)**：
   - **第一步：规划模式**：Agent 拟定计划。**必须停止以等待您的批准**。
   - **第二步：门控跳转**：一旦您说“OK”，Agent 运行 `node scripts/approve.js` 以标记进入执行阶段。
   - **第三步：自主并行执行**：管理者调度工人并行完成任务。

## 脚本与存储说明

- `task-tracker.js`：进度追踪核心。
- `approve.js`：机器可见的确认标记。
- `context-snapshot.js`：工作空间状态持久化。
- **依赖说明**：Node.js >= 18。

## 标准用法

1. **判定**：Agent 识别任务复杂度。
2. **规划**：Agent 创建步骤和实施计划。
3. **审批**：Agent 进入“规划模式”并**停止 (STOP)**。
4. **执行**：一旦您说“OK”，Agent 运行 **approve.js** 后开启自主循环。

## 许可证

MIT
