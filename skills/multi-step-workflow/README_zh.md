# 多步骤工作流 (高信任版 SOP)

轻量级任务追踪，具备 **“机器门控规划” (Machine-Gated Planning)**、**“自主执行” (Autonomous Execution)** 和 **“用户授权式复盘” (User-Opt-In Review)**。

## 开发与合规声明 (ClawHub Audit v4.3.0)

> [!IMPORTANT]
> **零工作区污染架构 (Temp-Isolated Storage)**
> 为了实现 100% 的工作区纯净，本技能的所有中间技术文件 **不再写入您的项目文件夹**。
> - **沙箱化存储**：所有状态 JSON 均迁移至系统临时目录下的项目专用子目录中 (`/tmp/openclaw-workflow-*`)。
> - **瞬时生命周期**：数据在临时目录中随系统清理或会话结束而自动回收，从根本上杜绝了敏感数据的中长期驻留风险。
> - **高忠实度快照**：我们 **移除了所有的 PII/Secret 过滤**，转而采用数据完整性原则。Agent 记录的所有细节都将能够以 100% 的原始形态在断点续传时被准确还原。

### 💾 状态持久化 (在临时目录中)
- `approvals.json`：记录您的明确审批标记。
- `context-snapshot.json`：高忠实度任务提取物。
- `tasks/*.json`：任务每步进度。

### 🛡️ 隐私与安全最佳实践
- **零自修改**：本技能不包含任何自修改元数据的逻辑。开启全局模式 (`always: true`) 依然由人工物理手动操作。
- **原生 CLI 配置**：所有设置通过 OpenClaw 官方 CLI 管理。

## 自适应工作流逻辑

1. **快速路径 (< 3 步)**：针对简单的单项任务。直接执行。
2. **标准路径 (>= 3 步)**：
   - **第一步：规划模式**：Agent 拟定计划。**必须停止以等待您的批准**。
   - **第二步：门控跳转**：一旦您说“OK”，Agent 运行 `node scripts/approve.js`。
   - **第三步：自主执行**：Agent 自动完成所有计划任务。
   - **第四步：防遗忘机制**：针对长耗时任务，Agent 会主动保存快照。

## 配置管理

本技能完全通过 OpenClaw 官方 CLI 进行管理。

**如需开启并行模式**：
`openclaw config set multi-step-workflow.useSubAgents true --strict-json`

**如需查看当前生效配置**：
`openclaw config get multi-step-workflow`

## 核心脚本 (可审计)

- `path-resolver.js`：工作区与临时目录的映射器。
- `task-tracker.js`：进度追踪核心。
- `approve.js`：机器可见的确认标记。
- `context-snapshot.js`：高忠实度状态快照。

## 许可证

MIT
