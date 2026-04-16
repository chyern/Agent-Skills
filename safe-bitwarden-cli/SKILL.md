---
name: safe-bitwarden-cli
version: 1.5.1
description: "Industrial-grade secure bridge to Bitwarden using pure Shell. Zero-trust kernel-level piping and Zero Node.js footprint."
homepage: "https://github.com/chyern/Agent-Skills"
repository: "https://github.com/chyern/Agent-Skills.git"
env_vars:
  - BW_SESSION
envs:
  - BW_SESSION
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
- **Zero Eval**: All native tools are invoked directly via absolute/resolved paths to prevent shell injection.
- **Direct Kernel-Pipe**: Passwords flow directly from `bw` to the system clipboard via OS-level streams.

## Positioning & Scope
This skill is a **Hardened Native Clipboard Proxy**.
- **Privacy**: AI-Blind retrieval. Secrets never enter high-level runtime memory.
- **Binary Dependencies**: Explicitly declares all native clippers (`pbcopy`/`clip`/`xclip`/`wl-copy`) and **Python 3** (used strictly for non-sensitive JSON parsing) for maximum registry transparency.

## Usage Guide

1. **Environment Setup**:  
   Run `bash scripts/main.sh setup`
   - You **must** export `BW_SESSION` locally: `export BW_SESSION=$(bw unlock --raw)`

2. **Search Items**:  
   Run `bash scripts/main.sh search "<query>"`
   - Uses localized Python3 to extract only `id`/`name`.

3. **Secure Copy**:  
   Run `bash scripts/main.sh copy "<id>"`
   - The OS kernel handles the secret transfer.
