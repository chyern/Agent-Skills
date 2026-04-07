# Developer Guide

## Documentation Standards

1. **SKILL.md** — AI usage docs. Keep minimal: only what the AI needs to call the scripts.
2. **README.md / README_zh.md** — Human-facing docs. Design philosophy, usage examples.

## Development Principles

1. **Privacy** — Never expose user personal information in skill files.
2. **Plug & Play** — Must work out of the box. No manual configuration.
3. **Simplicity** — Fewer scripts = easier for AI to use. Resist complexity.

## Pre-Publish Checklist

```bash
# 1. Privacy check
grep -rEl "<personal-info>" scripts/ || echo "Clean"

# 2. Verify scripts
node scripts/task-tracker.js new "test" "a|b" && node scripts/task-tracker.js list
node scripts/context-snapshot.js save "test" "findings" "pending"
node scripts/context-snapshot.js load
node scripts/context-snapshot.js clear
```

**Rule: Never publish without verification and user instruction.**
