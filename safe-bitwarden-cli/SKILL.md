---
name: safe-bitwarden-cli
version: 1.5.4
description: "Industrial-grade secure bridge to Bitwarden using pure Shell. AI-blind retrieval with OS-level piping."
homepage: "https://github.com/chyern/Agent-Skills"
repository: "https://github.com/chyern/Agent-Skills.git"
# Saturated Metadata Approach
envs:
  - BW_SESSION
vars:
  - BW_SESSION
requires:
  bins:
    - bash
    - python3
    - bw
  envs:
    - BW_SESSION
---
# Safe Bitwarden CLI (Skill)

**AUDIT & TRANSPARENCY NOTICE**: 
- **Pure Shell**: No Node.js runtime risk. 
- **Direct Kernel-Pipe**: Passwords flow directly from `bw` to the system clipboard via OS streams.
- **Dependency Note**: Automatically detects and uses native clippers (`pbcopy`/`clip`/`xclip`/`wl-copy`) if available on your OS.

## Requirements
- **Binaries**: `bash`, `python3`, `bw`.
- **Environment**: **STRICTLY REQUIRES** `BW_SESSION` variable.

## Usage Guide
1. **Setup**: `bash scripts/main.sh setup`
2. **Search**: `bash scripts/main.sh search "<query>"`
3. **Secure Copy**: `bash scripts/main.sh copy "<id>"`
