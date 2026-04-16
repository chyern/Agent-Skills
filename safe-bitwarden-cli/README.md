# Safe Bitwarden CLI

A secure, conversational, and cross-platform bridge for interacting with your Bitwarden Vault using an AI Agent.

## Core Philosophy: "AI Password Blindness"
This tool is designed with a strict zero-trust policy regarding sensitive data exposed to the AI model itself:
1. **Piped Isolation**: The AI can trigger a password fetch, but the password is piped directly from `bw` (Bitwarden CLI) into `copyq` (a cross-platform clipboard manager).
2. **Auto-clearing**: Passwords are given a short Time-To-Live (TTL) in the clipboard to prevent historical leaks.
3. **Simulated Paste**: The AI can trigger an automated Paste keystroke, directly inserting the password into the active window without ever knowing what the password is.

## Dependencies

This skill checks and can automatically guide the installation for:
- [Bitwarden CLI (`bw`)](https://github.com/bitwarden/clients/tree/master/apps/cli)
- [CopyQ (`copyq`)](https://hluk.github.io/CopyQ/)

## Setup
The AI agent is capable of running a self-setup check when utilizing this skill. If any dependencies are missing, the agent will offer to install them via `brew` (macOS), `winget` (Windows), or `apt/pacman` (Linux).

To unlock the vault manually before using the agent:
```bash
export BW_SESSION=$(bw unlock --raw)
```
