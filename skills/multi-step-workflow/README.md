# Multi-Step Workflow (High-Trust SOP)

Lightweight task tracking with **Machine-Gated Planning**, **Autonomous Parallel Execution**, and **Privacy-Aware Reviews**.

## Security & Compliance (ClawHub Audit v2.6.1)

> [!IMPORTANT]
> **Why `always: true`?**
> This skill provides a Standard Operating Procedure (SOP). By setting `always: true`, the agent is always aware that it *should* follow a structured workflow for any complex task (>= 3 steps). 
> **To disable global enforcement**: Ask the agent to "Remove 'always: true' from the multi-step-workflow metadata" or manually edit `SKILL.md`.
>
> **Machine-Enforceable Gate**
> The agent is instructed to run `node scripts/approve.js` **ONLY** after you have explicitly approved the Implementation Plan. This provides a machine-verifiable signal that the planning phase has passed.
>
> **Privacy & Sanitization**
> In Phase 6 (Review), the agent is explicitly commanded to **sanitize PII** (Personally Identifiable Information) and sensitive credentials before writing to long-term memory.
>
> **Runtime & Storage**
> - **Binary**: Requires **Node.js >= 18**.
> - **Storage**: Technical JSON state is stored in `~/.openclaw/workspace/project/`.

## Adaptive Workflow Logic

1. **Simple Path (< 3 steps)**: Direct execution.
2. **Standard Path (>= 3 steps)**:
   - **Step 1: Planning Mode**: Agent drafts a plan. **MUST WAIT for approval**.
   - **Step 2: Gating**: Agent runs `node scripts/approve.js` once you say "OK".
   - **Step 3: Parallel Execution**: The Manager spawns workers and completes the task autonomously.

## Scripts & Storage

- `task-tracker.js`: Core progress tracking.
- `approve.js`: Machine-visible gate signal.
- `context-snapshot.js`: Workspace state persistence.
- **Dependencies**: Node.js >= 18.

## Standard Usage

1. **Analysis**: Agent identifies task complexity.
2. **Planning**: Agent creates steps and an implementation plan. 
3. **Approval**: Agent says "In Planning Mode" and **STOPS**. 
4. **Execution**: You say "OK". Agent runs **approve.js** and starts the autonomous loop.

## License

MIT
