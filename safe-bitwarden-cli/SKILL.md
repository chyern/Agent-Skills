---
name: safe-bitwarden-cli
version: 1.5.2
description: "Industrial-grade secure bridge to Bitwarden using pure Shell. Zero-trust kernel-level piping and Zero Node.js footprint."
homepage: "https://github.com/chyern/Agent-Skills"
repository: "https://github.com/chyern/Agent-Skills.git"
# Metadata Standardization for v1.5.2
env_vars:
  BW_SESSION: "Required Bitwarden session token. Obtain via: export BW_SESSION=$(bw unlock --raw)"
requires:
  bins:
    bash: "Skill entrypoint"
    python3: "Used for memory-safe JSON parsing"
    bw: "Bitwarden CLI"
    pbcopy: "macOS Clipper"
    clip: "Windows Clipper"
    xclip: "Linux/X11 Clipper"
    wl-copy: "Linux/Wayland Clipper"
  envs:
    BW_SESSION: "Session authentication token for Bitwarden CLI"
---
# Safe Bitwarden CLI (Skill)

**AUDIT TRANSPARENCY NOTICE**: 
- **Pure Shell**: No Node.js runtime risk. No `child_process` vulnerabilities.
- **Zero Eval**: All native tools are invoked directly via resolved paths.
- **Direct Kernel-Pipe**: Passwords flow directly from `bw` to the system clipboard via OS-level streams.

## Positioning & Scope
This skill is a **Hardened Native Clipboard Proxy**.
- **Privacy**: AI-Blind retrieval. Secrets never enter high-level runtime memory.
- **Environment**: This skill **REQUIRES** `BW_SESSION`. Please ensure it is exported in your environment.

## Trust & Security
- **Zero child_process Alerts**: By using a pure shell script, we avoid runtime memory exposure.
- **Search Security**: Non-sensitive metadata (ID/Name) is extracted using a localized Python3 JSON parser.

## Usage Guide

1. **Environment Setup**:  
   Run `bash scripts/main.sh setup`
   - You **must** export `BW_SESSION` locally: `export BW_SESSION=$(bw unlock --raw)`

2. **Search Items**:  
   Run `bash scripts/main.sh search "<query>"`

3. **Secure Copy**:  
   Run `bash scripts/main.sh copy "<id>"`
