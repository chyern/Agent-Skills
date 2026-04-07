#!/usr/bin/env node
/**
 * delegate - Context information provider for AI routing decision
 * 
 * This script provides CONTEXT INFORMATION only. It does NOT make routing decisions.
 * The AI model decides on its own whether to use main session or sub-agent,
 * based on its own judgment of the task's characteristics.
 * 
 * Usage: node delegate.js <context_percent>
 * 
 * Output: JSON with context info only
 */

const [contextPct] = process.argv.slice(2);

if (contextPct === undefined) {
  console.log(JSON.stringify({
    decision: "error",
    reason: "Usage: delegate <context_percent>"
  }));
  process.exit(1);
}

const context = parseInt(contextPct, 10);

let status, recommendation;

if (context >= 80) {
  status = "critical";
  recommendation = "BLOCK — context emergency. New tasks will add more load. Clear context before proceeding.";
} else if (context >= 60) {
  status = "high";
  recommendation = "Context is elevated. Consider: Is this task truly independent? Can it be split? Sub-agent recommended if parallelizable.";
} else if (context >= 40) {
  status = "caution";
  recommendation = "Context is moderate. Watch for compaction triggers if task is long-running.";
} else {
  status = "healthy";
  recommendation = "Context is healthy. Model can proceed at full speed.";
}

console.log(JSON.stringify({
  context,
  status,
  recommendation,
  guidance: {
    SUBAGENT: "Use sub-agent for: fully independent parallel tasks (multiple items, concurrent operations). Avoid sub-agent for: networking/realtime tasks (search, fetch, screenshot) — these are unstable in isolated sessions.",
    MAIN: "Use main session for: sequential tasks, context-dependent reasoning, networking/realtime tasks.",
    BLOCK: "Block all new tasks until context drops below 80%.",
    MAIN_ONLY: "Networking/realtime tasks MUST run in main session. Sub-agent isolated environment makes these unstable."
  }
}));
