---
name: multi-step-workflow
version: 2.3.0
description: "Adaptive SOP with Planning Mode. Efficiently handles simple tasks (< 3 steps) and complex engineering tasks (>= 3 steps) via a branching workflow (Analyze → Triage → Plan → Approve → Execute)."
metadata:
  openclaw:
    always: true
  clawdbot:
    name: multi-step-workflow
    version: 2.3.0
    environment:
      bins:
        - node
---
# Standard Task SOP (Adaptive + Planning Mode)

This workflow ensures efficiency for small tasks and reliability for complex engineering work.

## Phase 0: Triage & Analyze (分析与分流)
1. **Analyze**: Quickly assess the task scope within the workspace.
2. **Threshold Check**:
   - **Simple Path**: Straightforward tasks (e.g., read 1 file, explain code) that take **FEWER than 3 steps**.
   - **Standard Path**: Engineering tasks (e.g., refactoring, debugging, research) requiring **3 OR MORE steps**.

---

## [Path A] Simple Path (快速路径)
1. **Confirm**: State your immediate intent.
2. **Execute**: Perform the task directly. No `task-tracker` needed.
3. **Report**: Deliver results. Done.

---

## [Path B] Standard Path (标准流程)
For complex tasks, you MUST use **Planning Mode** to align with the user before modification.

### Phase 1: Confirm (核对)
Summarize your initial understanding and ask clarifying questions if needed.

### Phase 2: Create Plan (创建计划)
1. **Decompose**: Break the task into steps and register in `task-tracker`.
2. **Draft Plan**: Create an `implementation_plan.md` in the workspace (or output it clearly).
   - **Include**: Core strategy, affected files, and potential risks.

```bash
node scripts/task-tracker.js new "<task>" "<step1|step2|step3|...>"
```

### Phase 3: Obtain Approval (获得批准 - Planning Mode)
> [!IMPORTANT]
> **YOU ARE NOW IN PLANNING MODE.**
> 1. Present your plan and steps to the user.
> 2. **MUST YIELD**: Stop and wait for the user to say "OK", "Approved", or "Go ahead".
> 3. **DO NOT** perform any destructive or modifying actions until approved.

### Phase 4: Execute (执行)
Once approved, work through steps **one at a time**.
1. Execute the current step.
2. Mark it done: `node scripts/task-tracker.js done "<task>" <step_number>`
3. Briefly report progress, then move to the next step.

### Phase 5: Validate (验收)
Verify results (tests, outputs). If it fails, go back to Phase 4.

### Phase 6: Review (复盘)
Summarize lessons and follow-up items. **MUST** write to `memory/YYYY-MM-DD.md` or `MEMORY.md`.

### Phase 7: Complete (结束)
Task done. Clean up tracker state.
