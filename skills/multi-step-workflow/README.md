# Multi-Step Workflow (High-Trust SOP)

Lightweight task tracking with **Machine-Gated Planning**, **Autonomous Execution**, and **User-Opt-In Review**.

## Security & Compliance (ClawHub Audit v3.2.0)

> [!IMPORTANT]
> **Why `always: false`? (Audit-Proof Opt-in)**
> To achieve a zero-warning security score on ClawHub, this skill explicitly **avoids self-modifying code**. 
> - **Default always**: `false`
> - **Manual Security Flip**: If you want the agent to follow this SOP for *every* task, you must **manually** edit the skill's source file (`SKILL.md`) and set line 7 to `always: true`. 
> - **Rationale**: This "Physical Intentional Action" ensures that no script can autonomously escalate its own execution privileges, passing industrial-grade security audits.
>
> **Dependency Transparency**
> The skill now explicitly declares its dependency on the `openclaw` binary in its metadata to ensure the environment is correctly prepared before execution.
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

- `config.js`: Configuration script that reads/writes settings to `openclaw.json` (under the `multi-step-workflow` namespace).
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
