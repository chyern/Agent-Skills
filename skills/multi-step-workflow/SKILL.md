---
name: multi-step-workflow
description: "Universal agent workflow engine with state machine. Use for any complex multi-step task: research, debugging, configuration, building, analysis, documentation. Fully self-managing."
metadata:
  {
    "openclaw": {
      "emoji": "⚙️",
      "requires": { "bins": ["node", "python3"] },
    },
  }
---

# Agent Workflow

## State Machine

```
IDLE → PLANNING → DELEGATING → EXECUTING → VERIFYING → MEMORYING → DONE
                            ↓
                     WAITING_SUBAGENT → EXECUTING
                            ↓
                       BLOCKED → EXECUTING (or DONE if cancelled)
```

### States

| State | Meaning |
|-------|---------|
| `IDLE` | No active task |
| `PLANNING` | Analyzing task, breaking into steps |
| `DELEGATING` | Running delegate decision |
| `EXECUTING` | Running steps, loop through |
| `VERIFYING` | Verifying results match expectations. Fail → retry EXECUTING |
| `WAITING_SUBAGENT` | Sub-agent running, waiting for result |
| `MEMORYING` | Writing learned patterns to memory |
| `BLOCKED` | Waiting for user confirmation |
| `DONE` | Task completed |
| `FAILED` | Task failed (can retry → PLANNING) |

## Scripts

### delegate — context info only (model decides)

```bash
SKILL_DIR="$(npm root -g)/openclaw/skills/multi-step-workflow"
node "$SKILL_DIR/scripts/delegate.js" <context_pct>
```

Provides context information only. Model decides on its own: SUBAGENT / MAIN / BLOCK / MAIN_ONLY.

### context-snapshot — preserve task context before compaction

```bash
SKILL_DIR="$(npm root -g)/openclaw/skills/multi-step-workflow"
node "$SKILL_DIR/scripts/context-snapshot.js" save "<task>" "<findings>" "<pending>"
node "$SKILL_DIR/scripts/context-snapshot.js" load
node "$SKILL_DIR/scripts/context-snapshot.js" clear
```

Saves task-critical info to external file before OpenClaw auto-compacts context. Survives compaction.

### task-tracker — track steps

```bash
SKILL_DIR="$(npm root -g)/openclaw/skills/multi-step-workflow"
python3 "$SKILL_DIR/scripts/task-tracker.py" new "<task>" "<step1|step2|step3>"
python3 "$SKILL_DIR/scripts/task-tracker.py" done "<task>" 1
python3 "$SKILL_DIR/scripts/task-tracker.py" list
```

### state-machine — workflow state manager

```bash
SKILL_DIR="$(npm root -g)/openclaw/skills/multi-step-workflow"
node "$SKILL_DIR/scripts/state-machine.js" init "<task_id>" "<task_name>"
node "$SKILL_DIR/scripts/state-machine.js" get "<task_id>"
node "$SKILL_DIR/scripts/state-machine.js" transition "<task_id>" "<from_state>" "<to_state>"
```

Commands: init, get, transition, list, delete
