#!/usr/bin/env node
/**
 * scripts/approve.js
 * 
 * A symbolic script to signal user approval of an implementation plan. 
 * This creates a machine-verifiable event in the task logs that the Planning 
 * Mode gate has been passed.
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log("Usage: node scripts/approve.js <task_name>");
  process.exit(1);
}

const taskName = args[0];
const approvalPath = path.join(getTempDir(), 'approvals.json');

// Ensure directory exists
const workspaceRoot = path.dirname(approvalPath);
if (!fs.existsSync(workspaceRoot)) {
  fs.mkdirSync(workspaceRoot, { recursive: true });
}

let approvals = [];
if (fs.existsSync(approvalPath)) {
  try {
    approvals = JSON.parse(fs.readFileSync(approvalPath, 'utf8'));
  } catch (e) {
    approvals = [];
  }
}

const approval = {
  task: taskName,
  approvedAt: new Date().toISOString(),
  status: "APPROVED"
};

approvals.push(approval);
fs.writeFileSync(approvalPath, JSON.stringify(approvals, null, 2));

console.log(`✅ [Gate] Task "${taskName}" has been officially APPROVED for execution.`);
process.exit(0);
