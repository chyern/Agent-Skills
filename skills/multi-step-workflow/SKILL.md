---
name: multi-step-workflow
version: 2.4.0
description: "Adaptive SOP with Planning Mode & Autonomous Loop. Features a triage phase for simple tasks and a structured, self-advancing execution loop for complex engineering tasks."
metadata:
  openclaw:
    always: true
  clawdbot:
    name: multi-step-workflow
    version: 2.4.0
    environment:
      bins:
        - node
---
# Standard Task SOP (Adaptive + Autonomous Loop)

This workflow combines strict user-alignment (Planning Mode) with high-speed automated execution (Autonomous Loop).

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
For complex tasks, use **Planning Mode** to align and **Autonomous Loop** to execute.

### Phase 1: Confirm (核对)
Summarize your initial understanding and ask clarifying questions if needed.

### Phase 2: Create Plan (创建计划)
1. **Decompose**: Break the task into steps and register in `task-tracker`.
2. **Draft Plan**: Create an `implementation_plan.md` in the workspace.

```bash
node scripts/task-tracker.js new "<task>" "<step1|step2|step3|...>"
```

### Phase 3: Obtain Approval (获得批准 - Planning Mode)
> [!IMPORTANT]
> **YOU ARE NOW IN PLANNING MODE.**
> 1. Present your plan and steps to the user.
> 2. **MUST YIELD**: Stop and wait for the user to say "OK", "Approved", or "Go ahead".
> 3. **DO NOT** perform any modifying actions until approved.

### Phase 4: Execute (执行 - Autonomous Loop)
> [!TIP]
> **YOU ARE NOW IN AUTONOMOUS LOOP.**
> 1. Start with the first step.
> 2. **Execute** the step.
> 3. **Mark Done**: `node scripts/task-tracker.js done "<task>" <step_number>`
> 4. **Brief Report**: Summarize what was completed in this step.
> 5. **Loop**: **IMMEDIATELY** proceed to the next step. DO NOT wait for user input unless blocked or task finished.

### Phase 5: Validate (验收)
Verify results (tests, outputs). If it fails, go back to Phase 4.

### Phase 6: Review (复盘)
Summarize lessons and follow-up items. **MUST** write to `memory/YYYY-MM-DD.md` or `MEMORY.md`.

### Phase 7: Complete (结束)
Task done. Clean up tracker state.
