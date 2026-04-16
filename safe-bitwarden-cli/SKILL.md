---
name: safe-bitwarden-cli
version: 1.3.4
description: "A secure, conversational bridge to Bitwarden Vault using NATIVE OS clipboard. Zero AI password visibility / Zero 3rd-party clipper dependency."
homepage: "https://github.com/chyern/Agent-Skills"
repository: "https://github.com/chyern/Agent-Skills.git"
requires:
  bins:
    - node
    - bw
    - pbcopy
    - clip
    - xclip
    - wl-copy
  envs:
    - BW_SESSION
---
# Safe Bitwarden CLI (Skill)

**CRITICAL PRIVACY RULE**: You must NEVER attempt to print, store, or output passwords from Bitwarden. The password must strictly remain in the clipboard proxy mechanism.

## Positioning & Scope
This skill is a **Native Clipboard Proxy**. It handles the retrieval of credentials from Bitwarden to the system's native clipboard without ever exposing them to the AI's context. 
- **NO THIRD-PARTY CLIPPER REQUIRED**: Uses `pbcopy`, `clip`, or `xclip` depending on your OS.

## Trust & Security
- **Zero Shell Injection**: All commands use parameter arrays (`spawn`) and a strict binary whitelist.
- **Privacy-First**: Credentials never touch the AI's logs or memory.
- **Native Only**: Minimal attack surface by using built-in OS tools.

## Conversation Flow & Usage

1. **Check Environment**:  
   Run `node scripts/main.js setup`
   - Ensure the user has exported `BW_SESSION` in their local environment.
   - If `bw` is missing, inform the user they need to install `bitwarden-cli` manually.

2. **Search Items**:  
   Run `node scripts/main.js search "<query>"`
   - Provide the parsed matching items (Name and Username) to the User for selection.

3. **Secure Copy**:  
   Once the user selects an ID, run `node scripts/main.js copy "<id>"`
   - The script securely pipes the secret to your **native** clipboard.
   - Inform the user that the credential is now in their clipboard.
