---
name: safe-bitwarden-cli
version: 1.4.0
description: "Industrial-grade secure bridge to Bitwarden. AI-blind retrieval with memory-safe search and native OS clipboard proxy."
homepage: "https://github.com/chyern/Agent-Skills"
repository: "https://github.com/chyern/Agent-Skills.git"
env_vars:
  - BW_SESSION
envs:
  - BW_SESSION
requires:
  bins:
    - node
    - bw
  envs:
    - BW_SESSION
---
# Safe Bitwarden CLI (Skill)

**CRITICAL PRIVACY & SECURITY DATA**: 
1. **AI PASSWORD BLINDNESS**: Passwords strictly remain in the system clipboard. The AI agent never sees plain passwords.
2. **MEMORY SAFETY**: During search, the script explicitly nullifies sensitive data in the Node.js process memory immediately after extracting non-secret metadata (ID/Name/Username).
3. **SESSION SECURITY**: Access to your vault is gated by `BW_SESSION`. Provide this token only to trusted local environments.

## Positioning & Scope
This skill is a **Hardened Native Clipboard Proxy**.
- **Capabilities**: Securely search vault items and copy passwords to the native clipboard via a direct, memory-isolated pipeline.
- **Dependencies**: Requires [Bitwarden CLI (`bw`)](https://github.com/bitwarden/clients/tree/master/apps/cli) and native clippers (`pbcopy`/`clip`/`xclip`).

## Trust & Security
- **Zero Shell Injection**: Pure asynchronous spawns with hardcoded binary paths.
- **Audit-Ready Manifest**: Explicitly declares `BW_SESSION` across multiple metadata formats for registry transparency.

## Usage Guide

1. **Environment Setup**:  
   Run `node scripts/main.js setup`
   - You must export `BW_SESSION` locally: `export BW_SESSION=$(bw unlock --raw)`

2. **Search Items**:  
   Run `node scripts/main.js search "<query>"`
   - Uses memory-safe parsing to avoid secret exposure in the script's memory.

3. **Secure Copy**:  
   Run `node scripts/main.js copy "<id>"`
   - Secret is transmitted directly to the native clipboard via a secure Node.js stream pipe.
