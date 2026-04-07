---
name: multi-step-workflow
version: 2.5.1
description: "Adaptive SOP with Planning Mode, Autonomous Loop & Sub-agent Parallelism. Features a Manager-Worker architecture for horizontal scaling."
metadata:
  openclaw:
    always: true
  clawdbot:
    name: multi-step-workflow
    version: 2.5.1
    environment:
      bins:
        - node
---
# Standard Task SOP (Manager-Worker Edition)

This workflow ensures strict alignment (Planning) and high-speed parallel execution (Loop + Sub-agents).

## Phase 0: Triage & Analyze
1. **Analyze**: Assess task scope within the workspace.
2. **Threshold Check**:
   - **Simple Path**: < 3 steps. Direct execution.
   - **Standard Path**: >= 3 steps. Follow Path B.

---

## [Path A] Simple Path
1. **Confirm** intent -> **Execute** -> **Report**. Complete.

---

## [Path B] Standard Path
For complex engineering tasks, act as a Manager if independent sub-tasks exist.

### Phase 1: Confirm
Summarize your understanding and ask clarifying questions.

### Phase 2: Create Plan
1. **Decompose**: Register steps in `task-tracker`.
2. **Identify Parallelism**: Identify independent sub-tasks (e.g., writing tests for 3 modules).
3. **Draft Plan**: Create `implementation_plan.md`. Note steps to be delegated.

### Phase 3: Obtain Approval (Planning Mode)
> [!IMPORTANT]
> **YOU ARE IN PLANNING MODE.**
> Present plan and parallel execution strategy. **MUST YIELD** and wait for user approval.

### Phase 4: Execute (Parallel Loop)
> [!TIP]
> **YOU ARE IN AUTONOMOUS LOOP.**
> 1. **Manager Role**: Orchestrate execution.
> 2. **Parallelize**: Use `spawn` to create up to **3 Sub-agents** for independent steps.
> 3. **Worker Role**: Sub-agents focus on execution and reporting back. No `task-tracker` needed.
> 4. **Track & Report**: Mark steps `done` as workers finish. Report progress per step and IMMEDIATELY move to the next.

### Phase 5: Validate
Verify all results (tests, integration). Check worker outputs.

### Phase 6: Review
Summarize lessons. **MUST** write to `memory/YYYY-MM-DD.md` or `MEMORY.md`.

### Phase 7: Complete
Task finished. Clean up tracker state.
