# Multi-Step Workflow (Adaptive SOP + Planning Mode)

Lightweight task tracking for AI agents. This skill enforces a professional **Planning Mode** for complex tasks, ensuring the agent aligns with you before modifying code.

## Adaptive Workflow Logic

To keep things fast and focused, the agent branches based on task scale:

1. **Simple Path (< 3 steps)**: For one-off tasks (reading a file, explaining a function). The agent proceeds immediately.
2. **Standard Path (>= 3 steps)**: For engineering work. The agent enters **Planning Mode** (Phase 2 & 3). It must present a plan and **WAIT for your approval** before writing any code.

## Why

AI agents can be too eager. Planning Mode forces the agent to "think before doing" and gives you a chance to catch mistakes early. It also keeps progress organized in `task-tracker.js`.

## Security & ClawHub Notice

> [!IMPORTANT]
> **Why `always: true`?**
> This skill provides a Standard Operating Procedure (SOP). By setting `always: true`, the agent is always aware that it *must* plan complex tasks first. It is a logic engine, not a background process.
>
> **Data Tracking**
> - **Operational State**: `task-tracker.js` saves progress to `~/.openclaw/workspace/project/`.
> - **Memory**: Final reviews are written to your long-term memory (e.g., `memory/` or `MEMORY.md`).
> - **Plans**: Implementation plans are created as `.md` files in your workspace for transparency.

## Scripts

| Script | Purpose |
|--------|---------|
| `task-tracker.js` | Break tasks into steps, mark done, see progress |
| `context-snapshot.js` | Save findings before context compaction |

## Standard Usage (>= 3 steps)

1. **Step 1**: Agent analyzes the task and identifies it as "Standard".
2. **Step 2 (Planning Mode)**: Agent creates steps and an implementation plan. 
3. **Step 3 (Approval)**: Agent says "I am in Planning Mode" and **STOP**.
4. **Step 4 (Execution)**: Once you say "OK", the agent proceeds step-by-step.

## Manual Commands (Optional)

```bash
# See all active tasks and steps
node scripts/task-tracker.js list

# Mark a specific step as done
node scripts/task-tracker.js done "task name" 1
```

## Storage & Dependencies

- **Storage**: `~/.openclaw/workspace/project/`
- **Deps**: Node.js >= 18

## License

MIT
