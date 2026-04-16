---
name: safe-bitwarden-cli
version: 1.5.0
description: "Ultra-transparent secure bridge to Bitwarden using pure Shell. AI-blind retrieval with kernel-level piping and Zero Node.js footprint."
homepage: "https://github.com/chyern/Agent-Skills"
repository: "https://github.com/chyern/Agent-Skills.git"
env_vars:
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

**AUDIT TRANSPARENCY NOTICE**: This skill is implemented in pure **Bash Shell** to ensure maximum transparency. It utilizes native OS kernel piping to transfer credentials, providing zero-trust isolation from the AI runtime.

## Positioning & Scope
This skill is an **Ultra-Lean Native Clipboard Proxy**. 
- **Privacy**: Passwords never enter a high-level runtime's memory. They flow directly from `bw` to your clipboard through an OS-level pipe.
- **Search Security**: Non-sensitive metadata (ID/Name) is extracted using a localized Python3 JSON parser, ensuring only safe data is exposed to the AI.
- **Dependencies**: Requires [Bitwarden CLI (`bw`)](https://github.com/bitwarden/clients/tree/master/apps/cli) and **Python 3** (pre-installed on most systems).

## Trust & Security
- **Zero child_process Alerts**: By using a pure shell script, we avoid the security audit complexities of high-level runtime subprocess management.
- **Direct Piping**: Uses `bw get password "$ID" | $CLIPPER`, the safest possible way to handle secrets via CLI.

## Usage Guide

1. **Environment Setup**:  
   Run `bash scripts/main.sh setup`
   - Ensure `BW_SESSION` is exported locally: `export BW_SESSION=$(bw unlock --raw)`

2. **Search Items**:  
   Run `bash scripts/main.sh search "<query>"`
   - Returns cleaned metadata for selection.

3. **Secure Copy**:  
   Run `bash scripts/main.sh copy "<id>"`
   - The OS kernel handles the secret transfer. AI only triggers the event.
