#!/usr/bin/env node
/**
 * task-tracker - Lightweight multi-step task tracker (Node.js version)
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, unlinkSync } from 'fs';
import { resolve, join } from 'path';
import { execSync } from 'child_process';

const TRACKER_DIR = resolve(process.env.HOME, '.openclaw/workspace/project/task-tracker');
mkdirSync(TRACKER_DIR, { recursive: true });

function taskId(name) {
  return Buffer.from(name).toString('hex');
}

function loadTask(name) {
  const path = join(TRACKER_DIR, `${taskId(name)}.json`);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf8'));
}

function saveTask(name, data) {
  const path = join(TRACKER_DIR, `${taskId(name)}.json`);
  writeFileSync(path, JSON.stringify(data, null, 2));
}

function cmdNew(name, stepsRaw) {
  const steps = stepsRaw.split('|').map(s => s.trim()).filter(Boolean);
  const data = {
    name,
    status: 'in_progress',
    steps,
    done: [],
    created: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };
  saveTask(name, data);
  console.log(`[OK] Task created: ${name} (${steps.length} steps)`);
  return data;
}

function cmdDone(name, stepNum) {
  const data = loadTask(name);
  if (!data) {
    console.log(`[ERROR] Task not found: ${name}`);
    return;
  }
  const stepIdx = parseInt(stepNum, 10) - 1;
  if (!data.done.includes(stepIdx)) {
    data.done.push(stepIdx);
    data.done.sort((a, b) => a - b);
  }
  
  if (data.done.length === data.steps.length) {
    data.status = 'completed';
  }
  saveTask(name, data);
  
  const remaining = data.steps.length - data.done.length;
  if (remaining === 0) {
    console.log(`[DONE] All steps completed!`);
    autoTransition(name);
  } else {
    console.log(`[OK] Step ${stepNum} done. ${remaining} remaining.`);
  }
}

function autoTransition(taskName) {
  try {
    // Attempt to transition state machine from EXECUTING to VERIFYING
    const scriptDir = dirname(new URL(import.meta.url).pathname);
    const smPath = join(scriptDir, 'state-machine.js');
    console.log(`[AUTO] Attempting state transition to VERIFYING...`);
    // Note: We need a mapping from taskName to taskId in state-machine. 
    // For now, let's assume one main task or use the same ID if possible.
    // In many cases, the taskName in tracker is the taskName in state-machine.
    // We'll search for the taskId in state-machine.
  } catch (e) {
    // Fail silently if state machine transition fails
  }
}

function cmdStatus(name) {
  const data = loadTask(name);
  if (!data) {
    console.log(`[ERROR] Task not found: ${name}`);
    return;
  }
  console.log(`Task: ${data.name}`);
  console.log(`Status: ${data.status}  Progress: ${data.done.length}/${data.steps.length}`);
  console.log('');
  data.steps.forEach((s, i) => {
    const mark = data.done.includes(i) ? '[x]' : '[ ]';
    console.log(`  ${mark} ${i + 1}. ${s}`);
  });
}

function cmdList() {
  const files = readdirSync(TRACKER_DIR).filter(f => f.endsWith('.json'));
  if (files.length === 0) {
    console.log('[INFO] No active tasks.');
    return;
  }
  console.log(`[TASKS] ${files.length} active:`);
  files.sort().forEach(f => {
    const d = JSON.parse(readFileSync(join(TRACKER_DIR, f), 'utf8'));
    const bar = '#'.repeat(d.done.length) + '-'.repeat(d.steps.length - d.done.length);
    console.log(`  ${d.name} [${bar}] ${d.done.length}/${d.steps.length}`);
  });
}

function cmdClear(name) {
  const path = join(TRACKER_DIR, `${taskId(name)}.json`);
  if (existsSync(path)) {
    unlinkSync(path);
    console.log(`[DELETED] ${name}`);
  } else {
    console.log(`[ERROR] Task not found: ${name}`);
  }
}

// CLI handling
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const [cmd, arg1, arg2] = process.argv.slice(2);

if (cmd === 'new' && arg1 && arg2) {
  cmdNew(arg1, arg2);
} else if (cmd === 'done' && arg1 && arg2) {
  cmdDone(arg1, arg2);
} else if (cmd === 'status' && arg1) {
  cmdStatus(arg1);
} else if (cmd === 'list') {
  cmdList();
} else if (cmd === 'clear' && arg1) {
  cmdClear(arg1);
} else {
  console.log('Usage:');
  console.log('  task-tracker.js new "<task>" "<step1|step2|step3>"');
  console.log('  task-tracker.js done "<task>" <step_number>');
  console.log('  task-tracker.js status "<task>"');
  console.log('  task-tracker.js list');
  console.log('  task-tracker.js clear "<task>"');
}
