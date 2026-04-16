---
name: safe-bitwarden-cli
version: 1.5.3
description: "Industrial-grade secure bridge to Bitwarden using pure Shell. AI-blind retrieval with memory-safe search and native OS clipboard proxy."
homepage: "https://github.com/chyern/Agent-Skills"
repository: "https://github.com/chyern/Agent-Skills.git"
requires:
  bins:
    - bash
    - python3
    - bw
    - pbcopy
    - clip
    - xclip
    - wl-copy
  envs:
    - BW_SESSION
---
# Safe Bitwarden CLI (Skill)

**AUDIT TRANSPARENCY NOTICE**: 
- **Pure Shell**: No Node.js runtime risk. No `child_process` vulnerabilities.
- **Zero Eval**: All native tools are invoked directly via resolved paths.
- **Direct Kernel-Pipe**: Passwords flow directly from `bw` to the system clipboard via OS-level streams.

## Positioning & Scope
This skill is a **Hardened Native Clipboard Proxy**.
- **Privacy**: AI-Blind retrieval. Secrets never enter high-level runtime memory.
- **Requirement**: This skill **STRICTLY REQUIRES** `BW_SESSION` environment variable.

## Usage Guide
1. **Setup**: `bash scripts/main.sh setup`
2. **Search**: `bash scripts/main.sh search "<query>"`
3. **Secure Copy**: `bash scripts/main.sh copy "<id>"`
