# Safe Bitwarden CLI

A secure, conversational, and cross-platform bridge for interacting with your Bitwarden Vault using an AI Agent.

## Core Philosophy: "AI Password Blindness"
This tool is designed with a strict zero-trust policy regarding sensitive data exposed to the AI model itself:
1. **Piped Isolation**: The AI triggers a password fetch, but the password is piped directly from `bw` (Bitwarden CLI) into `copyq` (a cross-platform clipboard manager) using Node.js stream piping.
2. **No Shell Interpolation**: All commands are executed using argument arrays (`spawn`) without a shell, eliminating common shell-injection vulnerabilities.
3. **Auto-clearing**: Passwords are given a short 30-second Time-To-Live (TTL) in the clipboard to prevent historical leaks.
4. **Simulated Paste**: The AI triggers an automated Paste keystroke (`Cmd+V`, `Ctrl+V`, etc.) to insert the password into the active window without ever knowing what the password is.

## Dependencies

This skill checks and can automatically install:
- [Bitwarden CLI (`bw`)](https://github.com/bitwarden/clients/tree/master/apps/cli)
- [CopyQ (`copyq`)](https://hluk.github.io/CopyQ/)
- *Native OS tools for automation*: `osascript` (macOS), `xdotool` (X11), `wtype` (Wayland), or `powershell` (Windows).

## Setup
The AI agent can run a self-setup check. To verify your environment manually:
```bash
node scripts/main.js setup
```

If dependencies are missing, the agent can install them for you:
```bash
node scripts/main.js install
```

To unlock the vault manually before using the agent:
```bash
export BW_SESSION=$(bw unlock --raw)
```

## Repository & Issues

This skill is part of the [Agent-Skills](https://github.com/chyern/Agent-Skills) collection.
Feel free to download, star, or submit issues!
