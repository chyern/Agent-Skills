# Agent Workflow

**Universal agent workflow engine with state machine.** Works for any OpenClaw agent — research, debugging, configuration, building, analysis, documentation. Self-managing, zero config.

## Architecture

Task received → [State Machine] → Done
                    ↑
              ┌─────┴─────┐
              │           │
         Scripts       Loop
         delegate    through
         task-tracker  steps
         state-machine

The workflow is driven by three scripts coordinated through a state machine. The state machine tracks which phase each task is in; scripts read/write state to communicate.

## Design

### Why a state machine?

Agents often start a task, get interrupted, spawn sub-agents, or need to replan mid-execution. A state machine makes every phase explicit and recoverable — if the agent crashes mid-task, state is preserved and the next session can resume.

### Why separate scripts?

- **delegate.js** — context information provider. Model uses this to make its own routing decision.
- **task-tracker.py** — step tracking. Stores progress in JSON files under `~/.openclaw/workspace/project/task-tracker/`.
- **state-machine.js** — lifecycle management. Stores task state in `~/.openclaw/workspace/project/state-machine.json`.
- **context-snapshot.js** — task context preservation before OpenClaw compaction. Saves task-critical info to external JSON file.

Scripts are intentionally stateless between each other — they communicate through files, not function calls. This keeps them independently testable and resilient.

### State Machine

IDLE → PLANNING → DELEGATING → EXECUTING → VERIFYING → MEMORYING → DONE
                            ↓
                     WAITING_SUBAGENT → EXECUTING
                            ↓
                       BLOCKED → EXECUTING (or DONE)

| State | When entered |
|-------|-------------|
| IDLE | No active task |
| PLANNING | New task received, analyzing scope |
| DELEGATING | Plan ready, deciding route |
| EXECUTING | Steps are running |
| VERIFYING | Verifying results match expectations. Fail → retry EXECUTING |
| WAITING_SUBAGENT | Sub-agent spawned, waiting |
| MEMORYING | All steps done, writing patterns |
| BLOCKED | Waiting for user confirmation |
| DONE | Task finished |
| FAILED | Unrecoverable error, can retry |

### Routing (delegate.js — info only, model decides)

delegate.js provides **context information only**. The AI model decides on its own whether to use main session or sub-agent, based on its own judgment of the task's characteristics.

The model receives:
- Current context percentage and health status
- Guidance on when to use sub-agent vs main session
- BLOCK warning when context ≥ 80%

```bash
node delegate.js <context_pct>

```json
{
  "context": 25,
  "status": "healthy",
  "recommendation": "Context is healthy. Model can proceed at full speed.",
  "guidance": { ... }
}

**Model's routing principle:** Fully independent and parallelizable tasks → sub-agent. Sequential or context-dependent tasks → main session. Networking/realtime tasks → main session only.

### Script API

#### context-snapshot.js

```bash
# Save task context before compaction
node context-snapshot.js save "<task>" "<findings>" "<pending>"

# Load saved context (after compaction)
node context-snapshot.js load

# Clear snapshot when task is done
node context-snapshot.js clear
```

#### task-tracker.py

```bash
# Create a task with steps
python3 task-tracker.py new "<task>" "<step1|step2|step3>"

# Mark a step done
python3 task-tracker.py done "<task>" 1

# List all tasks
python3 task-tracker.py list

# Delete a task
python3 task-tracker.py clear "<task>"

All data stored in `~/.openclaw/workspace/project/task-tracker/` as JSON files.

#### state-machine.js

```bash
# Initialize a new task
node state-machine.js init "<task_id>" "<task_name>"

# Get current state
node state-machine.js get "<task_id>"

# Transition to new state
node state-machine.js transition "<task_id>" PLANNING

# List all active tasks
node state-machine.js list

# Delete a task
node state-machine.js delete "<task_id>"

State stored in `~/.openclaw/workspace/project/state-machine.json`. Invalid transitions are rejected — this is intentional enforcement of the state machine contract.

## Requirements

- `node` (for delegate.js and state-machine.js)
- `python3` (for task-tracker.py)

No other dependencies. No environment variables required.

## Extending

To add a new state, modify `state-machine.js`:
1. Add the state to the `S` constant
2. Add allowed transitions in the `TRANSITIONS` map


## Philosophy

**Scaffolding should thin as the model strengthens.** Store only what can't be re-derived. Keep the framework light.

## License

MIT
