---
name: safe-bitwarden-cli
version: 1.3.5
description: "A secure bridge to Bitwarden Vault. AI-blind retrieval using native OS clipboard proxy."
homepage: "https://github.com/chyern/Agent-Skills"
repository: "https://github.com/chyern/Agent-Skills.git"
requires:
  bins:
    - node
    - bw
  envs:
    - BW_SESSION
---
# Safe Bitwarden CLI (Skill)

**PRIVACY FIRST**: Credentials strictly remain in the system clipboard. AI agent never sees the plain passwords.

## Positioning & Scope
This skill is a **Native Clipboard Proxy**. It retrieves credentials from Bitwarden and pipes them directly to your OS clipboard.
- **Dependencies**: Requires [Bitwarden CLI (`bw`)](https://github.com/bitwarden/clients/tree/master/apps/cli) to be installed.
- **Platform Support**: Automatically uses native tools: `pbcopy` (macOS), `clip` (Windows), or `xclip`/`wl-copy` (Linux).

## Trust & Security
- **Zero Shell Injection**: Pure asynchronous spawns with hardcoded binary paths.
- **Explicit Manifest**: Declares `BW_SESSION` as a required environment variable for registry transparency.

## Usage Guide

1. **Environment Setup**:  
   Run `node scripts/main.js setup`
   - Ensure `BW_SESSION` is exported locally: `export BW_SESSION=$(bw unlock --raw)`

2. **Search Items**:  
   Run `node scripts/main.js search "<query>"`
   - AI provides matches for selection.

3. **Secure Copy**:  
   Run `node scripts/main.js copy "<id>"`
   - Secret is transmitted directly to the native clipboard via secure pipe.
