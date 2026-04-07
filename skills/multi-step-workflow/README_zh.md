# 多步骤工作流 (高信任版 SOP)

轻量级任务追踪，具备 **“机器门控规划” (Machine-Gated Planning)**、**“自主执行” (Autonomous Execution)** 和 **“用户授权式复盘” (User-Opt-In Review)**。

## 开发与合规声明 (ClawHub Audit v4.1.0)

> [!IMPORTANT]
> **原生 CLI 配置架构 (Zero-Config-Script)**
> 本版本完全采用 OpenClaw 官方 CLI (`openclaw config`) 管理系统级设置。我们移除了独立的配置处理脚本，以最大限度地缩小安全攻击面。
> - **原生配置**：Agent 直接与全局 `~/.openclaw/openclaw.json` 交互。
> - **内置默认逻辑**：如果配置项缺失，Agent 会根据 SOP 中的定义自动处理默认值（如禁用并发）。

### 💾 状态持久化与文件系统影响
为了确保跨会话的状态追踪和防遗忘，本技能会向 `~/.openclaw/workspace/project/` 写入以下技术文件：
- `approvals.json`：记录您对计划的明确批准标记。
- `context-snapshot.json`：由于上下文压缩（会话限制）而保存的中间提取物（已自动脱敏）。
- `*.json` (在 tracker 目录下)：记录任务的每步进度。

### 🛡️ 隐私与安全最佳实践
- **隐私脱敏**：`context-snapshot.js` 使用正则屏蔽常见隐私/密钥。**警告**：这并非 100% 完美，请避免对涉及高价值非标密钥的任务开启快照。
- **并发安全**：默认 `useSubAgents` 为 `false`。仅在您确信环境安全时通过 `openclaw config` 启用此项。
- **物理安全锁**：本技能不包含任何自修改代码。开启全局强制加载 (`always: true`) 仍是一项**严格的人工手动操作**。

## 自适应工作流逻辑

1. **快速路径 (< 3 步)**：针对简单的单项任务。直接执行。
2. **标准路径 (>= 3 步)**：
   - **第一步：规划模式**：Agent 拟定计划。**必须停止以等待您的批准**。
   - **第二步：门控跳转**：一旦您说“OK”，Agent 运行 `node scripts/approve.js` 以标记进入执行阶段。
   - **第三步：自主执行**：基于全局配置，Agent 自动完成所有计划任务。
   - **第四步：防遗忘机制**：针对长耗时任务，Agent 会主动保存快照。

## 配置管理

本技能完全通过 OpenClaw 官方 CLI 进行设置。

**如需开启并行模式**：
`openclaw config set multi-step-workflow.useSubAgents true --strict-json`

**如需查看当前生效配置**：
`openclaw config get multi-step-workflow`

## 核心脚本 (可审计)

- `task-tracker.js`：进度追踪核心。
- `approve.js`：机器可见的确认标记。
- `context-snapshot.js`：脱敏快照持久化。
- **依赖说明**：Node.js >= 18, OpenClaw CLI。

## 许可证

MIT
