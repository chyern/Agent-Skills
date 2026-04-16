# 什么是 Safe Bitwarden CLI？

这是一个跨平台的安全中转工具，旨在让 AI Agent 可以操作您的 Bitwarden 保险库，同时 **绝不** 让 AI 本体“看到”任何明文密码。

## 核心设计：AI 密码盲区 (AI Password Blindness)
我们采用了以下机制来保障极致隐私与安全：
1. **管道隔离传输**：AI 发起获取密码指令后，密码会直接通过 Node.js 的流管道（Stream Pipe）从 `bw` 传输至 `copyq` 剪切板管理工具中。
2. **无 Shell 注入风险**：所有底层命令均通过 `spawn` 参数数组执行，不经过 Shell 解析，从根源上杜绝了 Shell 注入漏洞。
3. **阅后即焚**：在拷贝发生后，剪切板会有一个 30秒 的倒计时。倒计时结束时，密码会自动从剪切板历史中强制抹除。
4. **自动化跨平台注入**：AI 可以在获得授权后，自动触发系统级粘贴动作（`Cmd+V` / `Ctrl+V`），将密码安全注入您选定的输入框。

## 依赖关系

本 Skill 可以自动探测并为您安装：
- [Bitwarden 官方命令行工具 (`bw`)](https://github.com/bitwarden/clients/tree/master/apps/cli)
- [开源剪切板管理器 (`CopyQ`)](https://hluk.github.io/CopyQ/)
- *系统级驱动工具*：`osascript` (macOS), `xdotool` (X11), `wtype` (Wayland), 或 `powershell` (Windows)。

## 初始化指引
AI 助手可以为您执行自检和自动安装。

**自检环境：**
```bash
node scripts/main.js setup
```

**自动安装依赖：**
```bash
node scripts/main.js install
```

在交互前，您需要确保您的本地终端已成功解锁了 Bitwarden 会话：
```bash
export BW_SESSION=$(bw unlock --raw)
```

## 仓库与反馈

该 Skill 是 [Agent-Skills](https://github.com/chyern/Agent-Skills) 系列的一部分。
欢迎下载、Star 或通过 Issue 提交反馈！
