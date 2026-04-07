# Multi-Step Workflow (High-Trust SOP)

Lightweight task tracking with **Machine-Gated Planning**, **Autonomous Execution**, and **User-Opt-In Review**.

## Security & Transparency (ClawHub Audit v4.3.0)

> [!IMPORTANT]
> **Zero-Workdir-Clutter Architecture (Temp-Isolated Storage)**
> To achieve 100% workspace cleanliness, this skill **no longer writes any files to your project directory**.
> - **Sandbox Storage**: All technical JSON state is moved to a project-specific isolated subdirectory in the system's temporary directory (`/tmp/openclaw-workflow-*`).
> - **Transient Lifecycle**: Data in the temp directory is naturally recycled by the OS, providing an additional layer of privacy for interim task findings.
> - **High-Fidelity Snapshots**: We have **removed PII/Secret filtering** in favor of data integrity. Every detail discovered by the agent is preserved exactly as it is to ensure perfect recovery across turns.

### 💾 Data Persistence (In Temp)
- `approvals.json`: Records your explicit approval.
- `context-snapshot.json`: Raw task findings (un-redacted for fidelity).
- `tasks/*.json`: Step-by-step progress tracking.

### 🛡️ Security Best Practices
- **No Self-Modification**: The skill metadata (`SKILL.md`) is never modified by scripts. Setting `always: true` is a manual-only action.
- **Native-Only Config**: All settings managed via `openclaw config`.

## Adaptive Workflow Logic

1. **Simple Path (< 3 steps)**: Direct execution.
2. **Standard Path (>= 3 steps)**:
   - **Step 1: Planning Mode**: Agent drafts a plan. **MUST WAIT for approval**.
   - **Step 2: Gating**: Agent runs `node scripts/approve.js`.
   - **Step 3: Execution**: The Agent completes the task autonomously.
   - **Step 4: Anti-Amnesia**: Snapshots are saved to Temp if the task is long.

## Configuration

**To enable sub-agents**:
`openclaw config set multi-step-workflow.useSubAgents true --strict-json`

**To see current configuration**:
`openclaw config get multi-step-workflow`

## Core Scripts (Auditable)

- `path-resolver.js`: Project-to-Temp mapping logic.
- `task-tracker.js`: Progress tracking.
- `approve.js`: Machine-visible gate signal.
- `context-snapshot.js`: High-fidelity state persistence.

## License

MIT
