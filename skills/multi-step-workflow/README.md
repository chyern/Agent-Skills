# Multi-Step Workflow (Adaptive SOP + Autonomous Loop)

Lightweight task tracking for AI agents. This skill enforces a professional **Planning Mode** followed by a high-speed **Autonomous Loop** for complex engineering tasks.

## Adaptive Workflow Logic

The agent branches based on task complexity to maximize efficiency:

1. **Simple Path (< 3 steps)**: For one-off tasks (reading a file, explaining a function). The agent proceeds immediately.
2. **Standard Path (>= 3 steps)**: For engineering work. 
   - **Step 1: Planning Mode**: Agent presents a plan and **MUST WAIT for your approval**.
   - **Step 2: Autonomous Loop**: Once approved, the agent enters an autonomous execution cycle — it completes a step, reports progress, and **immediately starts the next step** without waiting for you.

## Why

This skill solves the "AI laziness" or "AI interruption" problem. By granting the agent an autonomous loop *after* you've approved the plan, it can finish the entire job in one go while still giving you the chance to vet the strategy beforehand.

## Security & ClawHub Notice

> [!IMPORTANT]
> **Why `always: true`?**
> This skill provides a Standard Operating Procedure (SOP). By setting `always: true`, the agent is always aware that it *must* plan complex tasks first.
>
> **Autonomous Execution**
> The "Autonomous Loop" only triggers AFTER you have explicitly approved an implementation plan. You maintain full control over the entry point of the automation.

## Scripts

| Script | Purpose |
|--------|---------|
| `task-tracker.js` | Break tasks into steps, mark done, see progress |
| `context-snapshot.js` | Save findings before context compaction |

## Standard Usage (>= 3 steps)

1. **Analysis**: Agent identifies the task as "Standard".
2. **Planning**: Agent creates steps and an implementation plan. 
3. **Approval**: Agent says "I am in Planning Mode" and **STOP**. 
4. **Autonomous Loop**: You say "OK". The agent then loops through all steps, reporting after each one, until finished.

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
