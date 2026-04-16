# 什么是 Safe Bitwarden CLI？

这是一个跨平台的安全中转工具，旨在让 AI Agent 可以操作您的 Bitwarden 保险库，同时 **绝不** 让 AI 本体“看到”任何明文密码。

## 核心设计：AI 密码盲区 (AI Password Blindness)
我们采用了以下机制来保障极致隐私：
1. **管道隔离传输**：AI 发起获取密码指令后，密码会直接通过管道 (`|`) 传输至 `copyq` 剪切板管理工具中。密码字符串永远不会进入标准输出（stdout）、进程列表或大模型的上下文记忆。
2. **阅后即焚**：在拷贝发生后，剪切板会有一个 30秒 的倒计时。倒计时结束时，密码会自动从剪切板历史中强制抹除。
3. **自动化跨平台注入**：AI 可以在获得授权后，自动触发系统级粘贴动作（`Cmd+V` / `Ctrl+V`），将密码安全注入您选定的输入框。

## 依赖关系

Skill 能在初次启动时，自动感知环境变量，并提示依赖安装。依赖如下：
- [Bitwarden 官方命令行工具 (`bw`)](https://github.com/bitwarden/clients/tree/master/apps/cli)
- [开源剪切板管理器 (`CopyQ`)](https://hluk.github.io/CopyQ/)

## 初始化指引
AI 支持自动安装依赖（需获得您确认）。在交互前，您需要确保您的本地终端已成功解锁了 Bitwarden 会话，否则 AI 将提醒您执行：

```bash
export BW_SESSION=$(bw unlock --raw)
```

## 仓库与反馈

该 Skill 是 [Agent-Skills](https://github.com/chyern/Agent-Skills) 系列的一部分。
欢迎下载、Star 或通过 Issue 提交反馈！
