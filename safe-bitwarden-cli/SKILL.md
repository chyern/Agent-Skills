---
name: safe-bitwarden-cli
version: 1.0.2
description: "A secure, conversational bridge to Bitwarden Vault using OS clipboard proxy. Zero AI password visibility."
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
---
# Safe Bitwarden CLI (Skill)

**CRITICAL PRIVACY RULE**: You must NEVER attempt to print, store, or output passwords from Bitwarden. The password must strictly remain in the clipboard proxy mechanism.

## Conversation Flow & Usage

1. **Check/Setup Environment**:  
   Run `node scripts/main.js setup`
   - If `bw` or `copyq` is missing, run `node scripts/main.js install` after obtaining user permission.
   - If `bw` is locked, advise the user to unlock it in their terminal manually: `export BW_SESSION=$(bw unlock --raw)`

2. **Search Items**:  
   Run `node scripts/main.js search "<query>"`
   - Provide the parsed matching items (Name and Username) to the User for selection.

3. **Secure Copy**:  
   Once the user selects an ID, run `node scripts/main.js copy "<id>"`
   - Do NOT attempt to read the password. The script will securely pipe it to `copyq`.
   - Remind the user they have ~30 seconds before the clipboard history is aggressively cleared.

4. **Simulate Paste (Automation)**:  
   Instruct the user to focus the target input field.
   Then run: `node scripts/main.js paste`
   - This will simulate `Cmd+V`, `Ctrl+V` based on the host OS.
