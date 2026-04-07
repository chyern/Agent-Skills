---
name: multi-step-workflow
version: 2.5.0
description: "Adaptive SOP with Planning Mode, Autonomous Loop & Sub-agent Parallelism. Features a Manager-Worker architecture to delegate independent tasks to up to 3 sub-agents in parallel."
metadata:
  openclaw:
    always: true
  clawdbot:
    name: multi-step-workflow
    version: 2.5.0
    environment:
      bins:
        - node
---
# Standard Task SOP (Manager-Worker Edition)

This workflow combines strict alignment (Planning) with high-speed parallel execution (Loop + Sub-agents).

## Phase 0: Triage & Analyze (分析与分流)
1. **Analyze**: Assess task scope.
2. **Threshold Check**:
   - **Simple Path**: < 3 steps. Direct execution.
   - **Standard Path**: >= 3 steps. Follow Path B.

---

## [Path A] Simple Path (快速路径)
1. **Confirm** intent -> **Execute** -> **Report**. Done.

---

## [Path B] Standard Path (标准流程)
For complex tasks, act as a **Manager** if multiple independent sub-tasks exist.

### Phase 1: Confirm (核对)
Summarize understanding and ask clarifying questions.

### Phase 2: Create Plan (创建与路由)
1. **Decompose**: Register steps in `task-tracker`.
2. **Identify Parallelism**: Check for independent sub-tasks (e.g., writing tests for 3 different modules).
3. **Draft Plan**: Create `implementation_plan.md`. Note which steps will be delegated to Sub-agents.

### Phase 3: Obtain Approval (获得批准 - Planning Mode)
> [!IMPORTANT]
> **YOU ARE IN PLANNING MODE.**
> Present plan and parallel execution strategy. **MUST YIELD** and wait for approval.

### Phase 4: Execute (并行执行循环)
> [!TIP]
> **YOU ARE IN AUTONOMOUS LOOP.**
> 1. **Manager Role**: Orchestrate the execution.
> 2. **Parallelize**: For independent steps, use `spawn` to create up to **3 Sub-agents** simultaneously.
> 3. **Worker Role (Sub-agents)**: Sub-agents focus only on execution and reporting back. They do NOT need to run `task-tracker`.
> 4. **Track & Report**: Mark steps `done` as workers finish. Report progress per step and IMMEDIATELY move to the next.

### Phase 5: Validate (验收)
Verify results (tests, integration). Link all worker outputs.

### Phase 6: Review (复盘)
Summarize lessons. **MUST** write to `memory/YYYY-MM-DD.md` or `MEMORY.md`.

### Phase 7: Complete (结束)
Task done. Clean up tracker state.
