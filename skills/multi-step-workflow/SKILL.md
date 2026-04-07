---
name: multi-step-workflow
version: 2.1.0
description: "Standard Operating Procedure for complex tasks. Enforces a structured workflow: Analyze → Confirm → Decompose → Execute → Validate → Review → Complete. Use for any task with more than 3 steps, research, debugging, refactoring, or multi-file changes."
metadata:
  openclaw:
    always: true
  clawdbot:
    name: multi-step-workflow
    version: 2.1.0
    environment:
      bins:
        - node
---
# Standard Task SOP

For complex tasks, follow this workflow strictly.

## Phase 1: Analyze (分析)
Understand the task fully. Read relevant files, research context, identify scope.

## Phase 2: Confirm (核对)
Summarize your understanding back to the user. Ask clarifying questions. Do NOT proceed until alignment is confirmed.

## Phase 3: Decompose (拆解)
Break the task into concrete steps, then register them:

```bash
node scripts/task-tracker.js new "<task>" "<step1|step2|step3|...>"
```

## Phase 4: Execute (执行)
Work through each step. After completing each one, mark it done:

```bash
node scripts/task-tracker.js done "<task>" <step_number>
```

If context compaction is imminent, save your progress:

```bash
node scripts/context-snapshot.js save "<task>" "<findings>" "<pending>"
```

## Phase 5: Validate (验收)
Verify the results match expectations. Run tests, check outputs, confirm with user.

**If validation fails:** Go back to Phase 4 — fix the issues, then re-validate. Repeat until all checks pass. Do NOT proceed to Phase 6 with known failures.

## Phase 6: Review (复盘)
Briefly summarize: what was done, what was learned, any follow-up items.

## Phase 7: Complete (结束)
Task is done. Clean up if needed.
