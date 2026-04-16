# 什么是 Safe Bitwarden CLI？

这是一个跨平台的安全中转工具，旨在让 AI Agent 可以操作您的 Bitwarden 保险库，同时 **绝不** 让 AI 本体“看到”任何明文密码。

## 核心设计：AI 密码盲区 (AI Password Blindness)
我们采用了以下机制来保障极致隐私与安全：
1. **管道隔离传输**：AI 发起获取密码指令后，密码会直接通过 Node.js 的流管道（Stream Pipe）从 `bw` 传输至 `copyq` 剪切板管理工具中。密码字符串永远不会通过 stdout 泄露。
2. **无 Shell 注入风险**：所有底层命令均通过 `spawn` 参数数组执行，不经过 Shell 解析，从根源上杜绝了注入漏洞。

**注意**：本 Skill 仅负责 **安全提取到剪切板**。它不执行自动化安装逻辑、自动粘贴逻辑或自动清理剪切板逻辑。提取后，请您根据需要手动管理剪切板历史。

## 依赖关系

请确保您的系统中已安装以下工具：
- [Bitwarden 官方命令行工具 (`bw`)](https://github.com/bitwarden/clients/tree/master/apps/cli)
- [开源剪切板管理器 (`CopyQ`)](https://hluk.github.io/CopyQ/)

## 初始化指引
AI 助手可以为您执行环境自检。

**自检环境：**
```bash
node scripts/main.js setup
```

在交互前，您需要确保您的本地终端已成功解锁了 Bitwarden 会话：
```bash
export BW_SESSION=$(bw unlock --raw)
```

## 仓库与反馈

该 Skill 是 [Agent-Skills](https://github.com/chyern/Agent-Skills) 系列的一部分。
欢迎下载、Star 或通过 Issue 提交反馈！
