# Multi-Step Workflow

Lightweight task tracking for AI agents. Break complex tasks into steps, track progress, and preserve context across compaction.

## Why

AI agents often lose track of progress on complex tasks — especially when context gets compacted mid-work. This skill gives the agent two simple tools to stay organized.

## Scripts

| Script | Purpose |
|--------|---------|
| `task-tracker.js` | Break tasks into steps, mark done, see progress |
| `context-snapshot.js` | Save findings before context compaction |

## Usage

### Task Tracker

```bash
# Create a task with steps
node scripts/task-tracker.js new "refactor auth" "analyze|design|implement|test"

# Mark step 1 done
node scripts/task-tracker.js done "refactor auth" 1

# See all tasks
node scripts/task-tracker.js list
```

### Context Snapshot

```bash
# Save before compaction
node scripts/context-snapshot.js save "refactor auth" "found 3 patterns" "implement remaining"

# Restore after compaction
node scripts/context-snapshot.js load

# Clean up
node scripts/context-snapshot.js clear
```

## Storage

All data stored in `~/.openclaw/workspace/project/`. Auto-created on first use.

## Dependencies

- Node.js >= 18

## Security

- Local filesystem only, no network calls
- No modifications to user source code unless part of the task

## License

MIT
