---
name: safe-bitwarden-cli
version: 1.0.4
description: "A secure, conversational bridge to Bitwarden Vault using OS clipboard proxy. Zero AI password visibility."
homepage: "https://github.com/chyern/Agent-Skills"
repository: "https://github.com/chyern/Agent-Skills.git"
metadata:
  always: false
  requires:
    bins:
      - node
      - copyq
      - bw
      - osascript
      - xdotool
      - wtype
      - powershell
    envs:
      - BW_SESSION
---
# Safe Bitwarden CLI (Skill)

**CRITICAL PRIVACY RULE**: You must NEVER attempt to print, store, or output passwords from Bitwarden. The password must strictly remain in the clipboard proxy mechanism.

## Security & Trust Notice
- **Zero Shell Injection**: All commands use parameter arrays (`spawn`) and a strict binary whitelist.
- **Trusted Source**: Open source repository at [github.com/chyern/Agent-Skills](https://github.com/chyern/Agent-Skills).
- **Manual Oversight**: The `install` action triggers system package managers (brew/winget/apt) and may require `sudo`. **Always ask the user for explicit permission before running installation commands.**

## Conversation Flow & Usage

1. **Check/Setup Environment**:  
   Run `node scripts/main.js setup`
   - Ensure the user has exported `BW_SESSION` in their local environment.
   - If `bw` or `copyq` is missing, you may offer to run `node scripts/main.js install` **only after** explicit user confirmation.

2. **Search Items**:  
   Run `node scripts/main.js search "<query>"`
   - Provide the parsed matching items (Name and Username) to the User for selection.

3. **Secure Copy**:  
   Once the user selects an ID, run `node scripts/main.js copy "<id>"`
   - The script securely pipes the secret to `copyq` using Node.js streams.
   - Remind the user they have ~30 seconds before the clipboard history is aggressively cleared.

4. **Simulate Paste (Automation)**:  
   Instruct the user to focus the target input field.
   Then run: `node scripts/main.js paste`
   - This simulates OS-level keystrokes (`Cmd+V`, `Ctrl+V`). Verify the target window is focused.
