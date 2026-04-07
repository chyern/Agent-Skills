#!/usr/bin/env node
/**
 * state-machine - State manager for multi-step-workflow
 * 
 * Manages workflow state transitions:
 * IDLE → PLANNING → DELEGATING → EXECUTING → VERIFYING → MEMORYING → DONE
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const STATE_FILE = resolve(process.env.HOME, '.openclaw/workspace/project/state-machine.json');

// States
const S = {
  IDLE:        'IDLE',
  PLANNING:    'PLANNING',
  DELEGATING:  'DELEGATING',
  EXECUTING:   'EXECUTING',
  VERIFYING:   'VERIFYING',
  WAITING:     'WAITING_SUBAGENT',
  MEMORYING:   'MEMORYING',
  BLOCKED:     'BLOCKED',
  DONE:        'DONE',
  FAILED:      'FAILED',
};

// Valid transitions: currentState → [allowedNextStates]
const TRANSITIONS = {
  IDLE:       [S.PLANNING],
  PLANNING:   [S.DELEGATING, S.FAILED],
  DELEGATING: [S.EXECUTING, S.WAITING, S.BLOCKED, S.DONE],
  EXECUTING:  [S.VERIFYING, S.BLOCKED, S.FAILED],
  VERIFYING:  [S.MEMORYING, S.EXECUTING, S.FAILED],
  WAITING:    [S.EXECUTING, S.FAILED],
  MEMORYING:  [S.DONE, S.FAILED],
  BLOCKED:    [S.EXECUTING, S.DONE],
  DONE:       [],
  FAILED:     [S.PLANNING],
};

function load() {
  try { return JSON.parse(readFileSync(STATE_FILE, 'utf8')); }
  catch { return {}; }
}

function save(data) {
  writeFileSync(STATE_FILE, JSON.stringify(data, null, 2));
}

const cmd = process.argv[2];
const arg1 = process.argv[3];
const arg2 = process.argv[4];
const arg3 = process.argv[5];

if (!cmd) {
  console.log('Commands: init, get, transition, list, delete');
  console.log('States:', Object.values(S).join(', '));
  process.exit(0);
}

if (cmd === 'init') {
  if (!arg1 || !arg2) { console.log('Usage: init <task_id> <task_name>'); process.exit(1); }
  const data = load();
  data[arg1] = { taskId: arg1, taskName: arg2, state: S.IDLE,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    steps: [], notes: '' };
  save(data);
  console.log(JSON.stringify({ ok: true, taskId: arg1, state: S.IDLE }, null, 2));
}
else if (cmd === 'get') {
  if (!arg1) { console.log('Usage: get <task_id>'); process.exit(1); }
  const data = load();
  console.log(JSON.stringify(data[arg1] || { error: 'not found' }, null, 2));
}
else if (cmd === 'transition') {
  if (!arg1 || !arg2 || !arg3) { console.log('Usage: transition <task_id> <from_state> <to_state>'); process.exit(1); }
  const data = load();
  const t = data[arg1];
  if (!t) { console.log(JSON.stringify({ok: false, error: `Task ${arg1} not found`}, null, 2)); process.exit(1); }
  const valid = TRANSITIONS[t.state] || [];
  const newState = arg3.toUpperCase();
  if (!valid.includes(newState)) {
    console.log(JSON.stringify({ok: false, error: `Invalid: ${t.state} → ${newState}`, valid}, null, 2));
    process.exit(1);
  }
  t.state = newState;
  t.updatedAt = new Date().toISOString();
  save(data);
  console.log(JSON.stringify({ok: true, from: t.state, to: newState, task: t }, null, 2));
}
else if (cmd === 'list') {
  const data = load();
  console.log(JSON.stringify(Object.values(data).map(t => ({
    taskId: t.taskId, taskName: t.taskName, state: t.state, updatedAt: t.updatedAt,
  })), null, 2));
}
else if (cmd === 'delete') {
  if (!arg1) { console.log('Usage: delete <task_id>'); process.exit(1); }
  const data = load();
  delete data[arg1];
  save(data);
  console.log(JSON.stringify({ok: true}));
}
else {
  console.log(`Unknown command: ${cmd}`);
  process.exit(1);
}
