---
name: multi-step-workflow
version: 2.8.2
description: "Professional SOP with Machine-Gated Planning, Autonomous Loop, Sandboxed Sub-agents, and Code-Level PII Sanitization for ultimate trust."
metadata:
  openclaw:
    always: true
    requires:
      bins:
        - node
    storage:
      - "~/.openclaw/workspace/project/"
  clawdbot:
    name: multi-step-workflow
    version: 2.8.2
---
# Standard Task SOP (High-Trust Edition)

Follow this adaptive workflow to ensure task reliability and professional-grade execution.

## Phase 0: Triage & Analyze
1. **Analyze**: Assess task scope within the workspace.
2. **Threshold Check**:
   - **Simple Path**: < 3 steps. Direct execution.
   - **Standard Path**: >= 3 steps. Follow Path B.

---

## [Path A] Simple Path
1. **Confirm** intent -> **Execute** -> **Report**. DONE.

---

## [Path B] Standard Path (Machine-Gated)
For complex engineering, act as a **Manager** and ensure all workers are **Sandboxed**.

### Phase 1: Confirm
Summarize your understanding and align on the objective.

### Phase 2: Create Plan
1. **Decompose**: Register steps in `task-tracker.js`.
2. **Parallelize**: Identify independent sub-tasks for delegation.
3. **Draft Plan**: Create `implementation_plan.md`. Be explicit about worker scope.

### Phase 3: Obtain Approval (Planning Mode - THE GATE)
> [!IMPORTANT]
> **YOU ARE IN PLANNING MODE.**
> 1. Present plan. **MUST YIELD** and wait for user approval.
> 2. **GATING**: Once approved, YOU MUST RUN: `node scripts/approve.js "<task>"`
> 3. **DO NOT** modify any files until this symbolic gate script is run.

### Phase 4: Execute (Autonomous Parallel Loop)
> [!TIP]
> **YOU ARE IN AUTONOMOUS LOOP.**
> 1. **Manager Role**: Orchestrate execution using the approved plan.
> 2. **Worker Role (Sub-agents)**: Use `spawn` **ONLY** for tasks matching the approved plan (max 3). **RESTRICTION**: Do NOT use `spawn` for arbitrary OS commands or network scanning. Ensure sub-agents are strictly sandboxed to their assigned files.
> 3. **Progress**: Mark steps `done`. Report each step and IMMEDIATELY move to the next.
> 4. **Context Preservation (Anti-Amnesia)**: If you extract a crucial finding (e.g. an obscure API, a workaround) OR if the task is taking many turns and you suspect context compaction is imminent:
>    `node scripts/context-snapshot.js save "<task>" "<findings>" "<pending>" ["<last_error_log>"]`
>    *Self-Healing*: If you suddenly forget your plan or loose context mid-loop, run `node scripts/context-snapshot.js load` to recover.

### Phase 5: Validate
Verify results (tests, results). If a worker fails, go back to Phase 4.

### Phase 6: Review
Evaluate if there are any significant findings, reusable patterns, or critical lessons worth remembering. 
- If the task was routine, you may skip memory writing.
- If there is valuable information:
  **PRIVACY (Enforcement in Code):** You MUST sanitize your summary using the provided script before writing it out:
  `node scripts/sanitize-pii.js "<your_summary>"`
  **MEMORY:** Write the resulting sanitized string to `memory/YYYY-MM-DD.md` or `MEMORY.md`.

### Phase 7: Complete
Task finished. Clean up state if necessary.
