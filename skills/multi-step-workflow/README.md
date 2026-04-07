# Multi-Step Workflow (High-Trust SOP)

Lightweight task tracking with **Machine-Gated Planning**, **Autonomous Execution**, and **User-Opt-In Review**.

## Security & Transparency (ClawHub Audit v4.1.0)

> [!IMPORTANT]
> **Native CLI Configuration Architecture (Zero-Config-Script)**
> This version uses OpenClaw's official CLI (`openclaw config`) for all system settings. We have removed separate configuration scripts to minimize the security surface.
> - **Native Config**: The agent interacts directly with your global `~/.openclaw/openclaw.json`.
> - **In-Instruction Defaults**: Fallback logic is handled by the agent's logic based on the SOP.

### 💾 Filesystem Impact & Data Persistence
To ensure task state persists across turn limits, this skill writes technical JSON files to `~/.openclaw/workspace/project/`:
- `approvals.json`: Records your explicit approval of a task plan.
- `context-snapshot.json`: Encrypted/Sanitized task findings to survive context compaction.
- `*.json` (in tracker dir): Records step-by-step progress for the task.

### 🛡️ Privacy & Security Best Practices
- **PII Redaction**: `context-snapshot.js` uses regex to mask common PII/secrets. **Warning**: This is not 100% perfect. Avoid task snapshots for projects involving high-value, non-standard plaintext secrets.
- **Sub-Agent Safety**: By default, `useSubAgents` is `false`. Only enable this via `openclaw config` if you trust the project environment.
- **Manual Always-On**: Setting `always: true` in `SKILL.md` is a **strictly manual** action for users who want this SOP enforced globally.

## Adaptive Workflow Logic

1. **Simple Path (< 3 steps)**: Direct execution.
2. **Standard Path (>= 3 steps)**:
   - **Step 1: Planning Mode**: Agent drafts a plan. **MUST WAIT for approval**.
   - **Step 2: Gating**: Agent runs `node scripts/approve.js` once you say "OK".
   - **Step 3: Execution**: The Agent completes the task autonomously, following the system-level configuration for parallelism.
   - **Step 4: Anti-Amnesia**: Snapshots are saved to `context-snapshot.js` if the task is long.

## Configuration

**To enable sub-agents (High-Throughput Parallelism)**:
`openclaw config set multi-step-workflow.useSubAgents true --strict-json`

**To see current configuration**:
`openclaw config get multi-step-workflow`

## Core Scripts (Auditable)

- `task-tracker.js`: Core progress tracking.
- `approve.js`: Machine-visible gate signal.
- `context-snapshot.js`: Workspace state persistence (with PII sanitization).
- **Dependencies**: Node.js >= 18, OpenClaw CLI.

## License

MIT
