# Multi-Step Workflow (High-Trust SOP)

Lightweight task tracking with **Machine-Gated Planning**, **Autonomous Parallel Execution**, and **Anti-Amnesia Context Preservation**.

## Security & Compliance (ClawHub Audit v2.8.2)

> [!IMPORTANT]
> **Why `always: true`?**
> This skill provides a Standard Operating Procedure (SOP). By setting `always: true`, the agent is always aware that it *should* follow a structured workflow for any complex task (>= 3 steps). 
> **To disable global enforcement (Opt-out)**: Run the following command in your terminal:
> `sed -i '' '/always: true/d' ~/.openclaw/workspace/project/SKILL.md` (macOS) or use your system equivalent.
>
> **Machine-Enforceable Gate**
> The agent is instructed to run `node scripts/approve.js` **ONLY** after you have explicitly approved the Implementation Plan. This provides a machine-verifiable signal that the planning phase has passed.
>
> **Code-Level PII Sanitization**
> In Phase 6 (Review), the agent is explicitly commanded to use a dedicated script (`node scripts/sanitize-pii.js`) to enforce regex-based masking of emails, IPs, Auth tokens, and phone numbers before writing to long-term memory. Additionally, `context-snapshot.js` automatically applies this sanitization to any snapshot inputs before saving to disk.
>
> **Sandboxing & Spawn Constraints**
> The agent is strictly instructed to use the `spawn` tool **ONLY** for sub-tasks matching the approved plan. It is explicitly forbidden from running arbitrary OS discovery commands or network scanning. Consider running OpenClaw in a constrained environment if your project is highly sensitive.
>
> **Runtime & Storage**
> - **Binary**: Requires **Node.js >= 18**.
> - **Storage**: Technical JSON state (`approvals.json`, `context-snapshot.json`, etc.) is stored in `~/.openclaw/workspace/project/`.

## Adaptive Workflow Logic

1. **Simple Path (< 3 steps)**: Direct execution.
2. **Standard Path (>= 3 steps)**:
   - **Step 1: Planning Mode**: Agent drafts a plan. **MUST WAIT for approval**.
   - **Step 2: Gating**: Agent runs `node scripts/approve.js` once you say "OK".
   - **Step 3: Parallel Execution**: The Manager spawns workers and completes the task autonomously.
   - **Step 4: Anti-Amnesia**: If the task runs long, the agent proactively saves snapshots (`context-snapshot.js`) to survive context compaction.

## Scripts & Storage

- `task-tracker.js`: Core progress tracking.
- `approve.js`: Machine-visible gate signal.
- `sanitize-pii.js`: Code-level privacy masking module (Regex).
- `context-snapshot.js`: Workspace state persistence (now supports optional `[<last_error_log>]` capture and enforces auto-sanitization before saving).
- **Dependencies**: Node.js >= 18.

## Standard Usage

1. **Analysis**: Agent identifies task complexity.
2. **Planning**: Agent creates steps and an implementation plan. 
3. **Approval**: Agent says "In Planning Mode" and **STOPS**. 
4. **Execution**: You say "OK". Agent runs **approve.js** and starts the autonomous loop.
5. **Recovery**: If the agent forgets instructions mid-task due to session limits, it will auto-load its snapshot.

## License

MIT
