# 多步骤工作流

轻量级 AI Agent 任务追踪工具。将复杂任务拆解为步骤，追踪进度，并在上下文压缩时保留关键发现。

## 为什么需要

AI Agent 在处理复杂任务时，经常会丢失进度——尤其是上下文被压缩之后。这个 Skill 给 Agent 提供了两个简单的工具来保持条理。

## 脚本

| 脚本 | 用途 |
|------|------|
| `task-tracker.js` | 拆分任务为步骤，标记完成，查看进度 |
| `context-snapshot.js` | 在上下文压缩前保存关键发现 |

## 使用方式

### 任务追踪

```bash
# 创建带步骤的任务
node scripts/task-tracker.js new "重构认证" "分析|设计|实现|测试"

# 标记步骤 1 完成
node scripts/task-tracker.js done "重构认证" 1

# 查看所有任务
node scripts/task-tracker.js list
```

### 上下文快照

```bash
# 压缩前保存
node scripts/context-snapshot.js save "重构认证" "发现3个模式" "剩余实现部分"

# 压缩后恢复
node scripts/context-snapshot.js load

# 清理
node scripts/context-snapshot.js clear
```

## 存储

数据存储在 `~/.openclaw/workspace/project/`，首次使用时自动创建。

## 依赖

- Node.js >= 18

## 安全

- 仅本地文件系统操作，无网络请求
- 除非作为任务的一部分，否则不修改用户源代码

## License

MIT
