# Safe Bitwarden CLI

A secure, conversational, and cross-platform bridge for interacting with your Bitwarden Vault using an AI Agent.

## Core Philosophy: "AI Password Blindness"
This tool is designed with a strict zero-trust policy regarding sensitive data exposed to the AI model itself:
1. **Piped Isolation**: The AI triggers a password fetch, but the password is piped directly from `bw` (Bitwarden CLI) into your **Native OS Clipboard** (`pbcopy`, `clip`, or `xclip`) using Node.js stream piping.
2. **No Shell Interpolation**: All commands are executed using argument arrays (`spawn`) without a shell, eliminating command-injection vulnerabilities.
3. **No 3rd-Party Clipper**: This version removes the dependency on CopyQ, relying entirely on built-in system tools for maximum trust and minimal footprint.

**Note**: This skill focuses on **Secure Retrieval** to the clipboard. It does not perform automated pasting, software installation, or clipboard clearing.

## Dependencies

This skill requires the following tools to be installed on your system:
- [Bitwarden CLI (`bw`)](https://github.com/bitwarden/clients/tree/master/apps/cli)
- **Native Clipboard Tools** (usually pre-installed): `pbcopy` (macOS), `clip` (Windows), or `xclip`/`wl-copy` (Linux).

## Setup
To verify your environment manually:
```bash
node scripts/main.js setup
```

To unlock the vault manually before using the agent:
```bash
export BW_SESSION=$(bw unlock --raw)
```

## Repository & Issues

This skill is part of the [Agent-Skills](https://github.com/chyern/Agent-Skills) collection.
Feel free to download, star, or submit issues!
