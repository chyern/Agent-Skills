---
name: multi-step-workflow
version: 2.6.1
description: "Professional SOP with Machine-Gated Planning Mode, Autonomous Loop & Sandboxed Sub-agents. Optimized for high-trust environments."
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
    version: 2.6.1
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
> 2. **Worker Role (Sub-agents)**: Use `spawn` for independent tasks (max 3). **ISOLATION**: Ensure sub-agents are restricted to their assigned files.
> 3. **Progress**: Mark steps `done`. Report each step and IMMEDIATELY move to the next.

### Phase 5: Validate
Verify results (tests, results). If a worker fails, go back to Phase 4.

### Phase 6: Review
Summarize lessons and outcomes. 
**PRIVACY:** Ensure all PII (Personally Identifiable Information) and sensitive credentials are **sanitized** (removed or masked) before writing to long-term memory files.
**MEMORY:** Write the sanitized summary to `memory/YYYY-MM-DD.md` or `MEMORY.md`.

### Phase 7: Complete
Task finished. Clean up state if necessary.
