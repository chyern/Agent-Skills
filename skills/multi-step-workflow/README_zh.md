# 多步骤工作流 (高信任版 SOP)

轻量级任务追踪，具备 **“机器门控规划” (Machine-Gated Planning)**、**“自主并行执行” (Autonomous Parallel Execution)** 和 **“防遗忘上下文保护” (Anti-Amnesia Context Preservation)**。

## 安全与合规说明 (ClawHub Audit v2.8.2)

> [!IMPORTANT]
> **为什么使用 `always: true`?**
> 本技能定义了一套标准作业程序 (SOP)。通过设置 `always: true`，可以让 Agent 始终意识到应对复杂任务 (>= 3 步) 时*必须*遵循结构化计划。
> **如需禁用全局强制策略 (退订)**：请在您的终端运行以下单行命令：
> `sed -i '' '/always: true/d' ~/.openclaw/workspace/project/SKILL.md` (macOS) 或系统等效命令。
>
> **机器可强制门控 (Machine-Enforceable Gate)**
> Agent 被要求在您明确批准实施计划后运行 `node scripts/approve.js`。这在执行日志中留下了明确的“机器标记”，标志着从“规划”正式切换到“执行”。
>
> **代码级 PII 脱敏 (Enforcement in Code)**
> 在 Phase 6 (复盘阶段)，Agent 被明确赋予了指令，**必须**使用专用的过滤脚本 (`node scripts/sanitize-pii.js`) 通过正则表达式在代码层面屏蔽邮箱、IP地址、认证令牌和电话号码，随后才能写入长记忆。而且，`context-snapshot.js` 目前也在写入任何快照前**自动在内部强制执行同样的脱敏过滤**。
>
> **沙箱隔离与 Spawn 约束**
> Agent 被严厉禁止使用 `spawn` 工具执行随意的 OS 探测或网络扫描。其并发派生能力被**严格限制在已获批计划 (Implementation Plan) 所涵盖的具体文件中**。如果您的项目非常敏感，建议在沙箱环境运行。
>
> **运行环境与存储**
> - **运行环境**：需要 **Node.js >= 18**。
> - **存储路径**：技术状态（如 `approvals.json`, `context-snapshot.json` 等）存储在 `~/.openclaw/workspace/project/`。

## 自适应工作流逻辑

1. **快速路径 (< 3 步)**：针对简单的单项任务。直接执行。
2. **标准路径 (>= 3 步)**：
   - **第一步：规划模式**：Agent 拟定计划。**必须停止以等待您的批准**。
   - **第二步：门控跳转**：一旦您说“OK”，Agent 运行 `node scripts/approve.js` 以标记进入执行阶段。
   - **第三步：自主并行执行**：管理者调度工人并行完成任务。
   - **第四步：防遗忘机制**：对于耗时极长的任务，Agent 会主动捕获带有报错信息的快照 (`context-snapshot.js`)，以抵抗底层平台的会话压缩。

## 脚本与存储说明

- `task-tracker.js`：进度追踪核心。
- `approve.js`：机器可见的确认标记。
- `sanitize-pii.js`：代码级隐私屏蔽模块（正则表达式）。
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
