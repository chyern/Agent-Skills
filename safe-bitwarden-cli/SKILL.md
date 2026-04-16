---
name: safe-bitwarden-cli
version: 1.1.0
description: "A secure, conversational bridge to Bitwarden Vault using OS clipboard proxy. AI-blind account retrieval."
homepage: "https://github.com/chyern/Agent-Skills"
repository: "https://github.com/chyern/Agent-Skills.git"
metadata:
  always: false
  requires:
    bins:
      - node
      - copyq
      - bw
    envs:
      - BW_SESSION
---
# Safe Bitwarden CLI (Skill)

**CRITICAL PRIVACY RULE**: You must NEVER attempt to print, store, or output passwords from Bitwarden. The password must strictly remain in the clipboard proxy mechanism.

## Positioning & Scope
This skill is a **Secure Clipboard Proxy**. It handles the retrieval of credentials from Bitwarden to the system clipboard without ever exposing them to the AI's context. 
It does **NOT** perform pasting. Pasting should be handled manually by the user or via other automation tools.

## Security & Trust Notice
- **Zero Shell Injection**: All commands use parameter arrays (`spawn`) and a strict binary whitelist.
- **Trusted Source**: Open source repository at [github.com/chyern/Agent-Skills](https://github.com/chyern/Agent-Skills).
- **Manual Oversight**: The `install` action triggers system package managers (brew/winget/apt). **Always ask the user for explicit permission before running installation commands.**

## Conversation Flow & Usage

1. **Check/Setup Environment**:  
   Run `node scripts/main.js setup`
   - Ensure the user has exported `BW_SESSION` in their local environment.
   - If `bw` or `copyq` is missing, you may offer to run `node scripts/main.js install` after explicit user confirmation.

2. **Search Items**:  
   Run `node scripts/main.js search "<query>"`
   - Provide the parsed matching items (Name and Username) to the User for selection.

3. **Secure Copy**:  
   Once the user selects an ID, run `node scripts/main.js copy "<id>"`
   - The script securely pipes the secret to `copyq` using Node.js streams.
   - **Important**: Inform the user that the credential is now in their clipboard and they have ~30 seconds to paste it before it is cleared.
