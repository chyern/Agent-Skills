---
name: multi-step-workflow
version: 2.0.0
description: "MUST USE for any complex task, multi-step task, research, deep debugging, refactoring, large-scale code changes, or analysis. Breaks tasks into trackable steps and preserves context across compaction."
metadata:
  openclaw:
    always: true
  clawdbot:
    name: multi-step-workflow
    version: 2.0.0
    environment:
      bins:
        - node
---
# Multi-Step Workflow

For complex tasks, break them into steps and track progress.

## When to Use

- Task has more than 3 steps
- Research, debugging, refactoring, or multi-file changes
- Long-running tasks that might hit context compaction

## Step Tracking

```bash
# Break task into steps
node scripts/task-tracker.js new "task name" "step1|step2|step3"

# Mark a step done
node scripts/task-tracker.js done "task name" 1

# See all progress
node scripts/task-tracker.js list
```

## Context Snapshot (before compaction)

```bash
# Save key findings so they survive context compaction
node scripts/context-snapshot.js save "task name" "what I found" "what's left to do"

# Restore after compaction
node scripts/context-snapshot.js load
```
