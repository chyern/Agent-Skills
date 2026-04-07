# Multi-Step Workflow (High-Trust SOP)

Lightweight task tracking with **Machine-Gated Planning**, **Autonomous Execution**, and **User-Opt-In Review**.

## Security & Compliance (ClawHub Audit v3.0.0)

> [!IMPORTANT]
> **Why `always: true`?**
> This skill provides a Standard Operating Procedure (SOP). By setting `always: true`, the agent is always aware that it *should* follow a structured workflow for any complex task (>= 3 steps). 
> **To disable global enforcement (Opt-out)**: Run the following command in your terminal:
> `sed -i '' '/always: true/d' ~/.openclaw/workspace/project/SKILL.md` (macOS) or use your system equivalent.
>
> **Machine-Enforceable Gate**
> The agent is instructed to run `node scripts/approve.js` **ONLY** after you have explicitly approved the Implementation Plan. This provides a machine-verifiable signal that the planning phase has passed.
>
> **Sandboxing & Configurable Spawn Constraints**
> The agent is strictly instructed to execute all tasks sequentially by itself by default. It is **forbidden** from using the `spawn` tool for sub-agents unless explicitly enabled via configuration. This solves platform audit warnings regarding privilege escalation.
> To enable sub-agents (High-Throughput Parallelism), run:
> `node ~/.openclaw/workspace/project/scripts/config.js set useSubAgents true`
> To set max sub-agents limit (default is 3):
> `node ~/.openclaw/workspace/project/scripts/config.js set maxSubAgents 2`
>
> **User-Opt-In Review**
> In Phase 6 (Review), the agent is explicitly commanded **NOT to auto-write** to your memory files. It will purely display a breakdown of what went well and what didn't in the chat, leaving the final decision of whether to save it to you.
>
> **Runtime & Storage**
> - **Binary**: Requires **Node.js >= 18**.
> - **Storage**: Technical JSON state (`approvals.json`, `context-snapshot.json`, etc.) is stored in `~/.openclaw/workspace/project/`.

## Adaptive Workflow Logic

1. **Simple Path (< 3 steps)**: Direct execution.
2. **Standard Path (>= 3 steps)**:
   - **Step 1: Planning Mode**: Agent drafts a plan. **MUST WAIT for approval**.
   - **Step 2: Gating**: Agent runs `node scripts/approve.js` once you say "OK".
   - **Step 3: Execution**: The Agent completes the task autonomously (sequentially by default, or parallel with sub-agents if `useSubAgents` is enabled in config).
   - **Step 4: Anti-Amnesia**: If the task runs long, the agent proactively saves snapshots (`context-snapshot.js`) to survive context compaction.

## Scripts & Storage

- `config.js`: Workflow settings manager (sub-agents, parallelism limits).
- `task-tracker.js`: Core progress tracking.
- `approve.js`: Machine-visible gate signal.
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
