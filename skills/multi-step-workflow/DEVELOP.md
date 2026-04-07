# Developer Guide

## Documentation Standards

1. **SKILL.md** — AI usage docs. Keep minimal: only what the AI needs to know to call the scripts correctly.
2. **README.md / README_zh.md** — Human-facing docs. Be thorough: design philosophy, usage examples, decision logic, script API.

## Development Principles

1. **Privacy** — Never expose any user personal information (username, address, email, server info, etc.) in skill files.
2. **Plug & Play** — Skill must work out of the box after installation. No manual configuration required.
3. **Universality** — Skill applies to any task scenario, not limited to a specific use case.

## Pre-Publish Checklist

> Note: `$SKILL_DIR` in examples should be replaced with actual installation path. Use `$(npm root -g)/openclaw/skills/multi-step-workflow` or equivalent.

```bash
# 1. Privacy check
grep -rEl "<personal-info>" "$(npm root -g)/openclaw/skills/multi-step-workflow/scripts/" || echo "Clean"
grep -rEl "<personal-info>" "$(npm root -g)/openclaw/skills/multi-step-workflow/README.md" || echo "README.md: Clean"
grep -rEl "<personal-info>" "$(npm root -g)/openclaw/skills/multi-step-workflow/README_zh.md" || echo "README_zh.md: Clean"

# 2. Verify all scripts work
SKILL_DIR="$(npm root -g)/openclaw/skills/multi-step-workflow"
node "$SKILL_DIR/scripts/delegate.js" 35
node "$SKILL_DIR/scripts/context-snapshot.js" save "test" "test" "test"
node "$SKILL_DIR/scripts/context-snapshot.js" load
node "$SKILL_DIR/scripts/context-snapshot.js" clear
node "$SKILL_DIR/scripts/state-machine.js" | head -1
python3 "$SKILL_DIR/scripts/task-tracker.py" | head -1
```

Checklist before publishing:
1. No personal information in skill files
2. SKILL.md is up to date
3. README is up to date

**Rule: Never publish without verification and user instruction.**
**Blocking: If any verification step fails, do not publish. Fix first.**
