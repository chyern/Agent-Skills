---
name: safe-bitwarden-cli
version: 1.2.0
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

## Trust & Security
- **Zero Shell Injection**: All commands use parameter arrays (`spawn`) and a strict binary whitelist.
- **Privacy-First**: Credentials never touch the AI's logs or memory.
- **External Dependencies**: This skill requires `bw` and `copyq` to be pre-installed on the system.
- **Clipboard Management**: This skill does NOT perform automatic clearing of the clipboard. Users are responsible for managing their clipboard history and clearing secrets after use.

## Conversation Flow & Usage

1. **Check Environment**:  
   Run `node scripts/main.js setup`
   - Ensure the user has exported `BW_SESSION` in their local environment.
   - If `bw` or `copyq` is missing, inform the user they need to install these tools manually.

2. **Search Items**:  
   Run `node scripts/main.js search "<query>"`
   - Provide the parsed matching items (Name and Username) to the User for selection.

3. **Secure Copy**:  
   Once the user selects an ID, run `node scripts/main.js copy "<id>"`
   - The script securely pipes the secret to `copyq` using Node.js streams.
   - Inform the user that the credential is now in their clipboard.
