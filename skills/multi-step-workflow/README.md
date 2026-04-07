# Multi-Step Workflow (High-Trust SOP)

Lightweight task tracking with **Machine-Gated Planning**, **Autonomous Execution**, and **User-Opt-In Review**.

## Security & Compliance (ClawHub Audit v3.2.1)

> [!IMPORTANT]
> **Zero-Shell Execution (Audit-Proof)**
> To satisfy platform security audits, the skill's own code **no longer executes any shell commands**. 
> - **Read (fs-only)**: Configuration is read directly from `~/.openclaw/openclaw.json` via native Node `fs` (No `child_process`).
> - **Write (System-only)**: The skill script **cannot** modify system configuration. To change settings, the Agent (or the User) must use the official `openclaw` CLI directly.
> - **Rationale**: This "Read-Write Separation" prevents any possibility of a skill autonomously escalating its own binary execution privileges.
>
> **Global Toggle (Manual-only)**
> Setting `always: true` in `SKILL.md` is a **strictly manual** security action. The skill code is physically incapable of modifying this file.

> [!NOTE]
> **User-Opt-In Review**
> In Phase 6 (Review), the agent is explicitly commanded **NOT to auto-write** to your memory files. It will purely display a breakdown of what went well and what didn't in the chat, leaving the final decision of whether to save it to you.

## Adaptive Workflow Logic

1. **Simple Path (< 3 steps)**: Direct execution.
2. **Standard Path (>= 3 steps)**:
   - **Step 1: Planning Mode**: Agent drafts a plan. **MUST WAIT for approval**.
   - **Step 2: Gating**: Agent runs `node scripts/approve.js` once you say "OK".
   - **Step 3: Execution**: The Agent completes the task autonomously.
   - **Step 4: Anti-Amnesia**: If the task runs long, the agent proactively saves snapshots (`context-snapshot.js`).

## Configuration

To enable sub-agents (High-Throughput Parallelism), run the system command:
`openclaw config set multi-step-workflow.useSubAgents true --strict-json`

To view current configuration safely:
`node scripts/config.js get` (read-only, no shell spawn)

## Scripts & Storage

- `config.js`: Read-only configuration helper.
- `task-tracker.js`: Core progress tracking.
- `approve.js`: Machine-visible gate signal.
- `context-snapshot.js`: Workspace state persistence (with PII sanitization).
- **Dependencies**: Node.js >= 18, OpenClaw CLI.

## Standard Usage

1. **Analysis**: Agent identifies task complexity.
2. **Planning**: Agent creates steps and an implementation plan. 
3. **Approval**: Agent says "In Planning Mode" and **STOPS**. 
4. **Execution**: You say "OK". Agent runs **approve.js** and starts the autonomous loop.
5. **Recovery**: If the agent forgets instructions mid-task, it will auto-load its snapshot.

## License

MIT
