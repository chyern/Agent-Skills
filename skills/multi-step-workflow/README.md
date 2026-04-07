# Multi-Step Workflow (Manager-Worker Edition)

Lightweight task tracking for AI agents. This skill enforces a professional **Manager-Worker (Parallel)** architecture for complex engineering tasks.

## Adaptive Workflow Logic

The agent branches based on task complexity to maximize efficiency:

1. **Simple Path (< 3 steps)**: For one-off tasks. The agent proceeds immediately.
2. **Standard Path (>= 3 steps)**:
   - **Step 1: Planning Mode**: Agent drafts a plan and identifies tasks that can be parallelized. **MUST WAIT for your approval**.
   - **Step 2: Parallel Execution**: Once approved, the agent acts as a **Manager**. It uses `spawn` to create up to **3 Sub-agents** simultaneously for independent worker tasks, dramatically increasing throughput.

## Why

Single-threaded AI task execution is slow for large projects. This skill solves the bottleneck by enabling **Horizontal Scaling**. For example, when adding tests to 5 modules, the Manager-Worker mode can process multiple modules at once.

## Security & ClawHub Notice

> [!IMPORTANT]
> **Manager Role**
> Only the main Agent maintains the `task-tracker.js` state. Sub-agents (Workers) are lifecycle-short and do NOT have authorization to modify global state.
>
> **Concurrency Limit**
> Standard limit is **3 simultaneous Sub-agents** to prevent API/CPU congestion.

## Scripts

| Script | Purpose |
|--------|---------|
| `task-tracker.js` | Break tasks into steps, mark done, see progress |
| `context-snapshot.js` | Save findings before context compaction |

## Standard Usage (>= 3 steps)

1. **Analysis**: Agent identifies the task as "Standard".
2. **Planning**: Agent creates steps and identifies parallel workers.
3. **Approval**: Agent says "I am in Planning Mode" and **STOP**. 
4. **Execution**: You say "OK". The Manager spawns workers and orchestrates completion.

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
