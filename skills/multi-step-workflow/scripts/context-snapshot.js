#!/usr/bin/env node
/**
 * context-snapshot - Preserve task context before OpenClaw compaction
 * 
 * When OpenClaw auto-compacts context, conversation history gets summarized
 * and older turns are removed. This script lets the model save TASK-CRITICAL
 * information to a file that survives compaction.
 * 
 * Usage:
 *   node context-snapshot.js save "<task>" "<findings>" "<pending>"
 *   node context-snapshot.js load
 *   node context-snapshot.js clear
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';

const SNAPSHOT_FILE = resolve(process.env.HOME, '.openclaw/workspace/project/context-snapshot.json');
mkdirSync(dirname(SNAPSHOT_FILE), { recursive: true });

function load() {
  if (!existsSync(SNAPSHOT_FILE)) return null;
  try { return JSON.parse(readFileSync(SNAPSHOT_FILE, 'utf8')); }
  catch { return null; }
}

function save(data) {
  writeFileSync(SNAPSHOT_FILE, JSON.stringify(data, null, 2));
}

const [cmd, arg1, arg2, arg3] = process.argv.slice(2);

if (cmd === 'save') {
  if (!arg1) {
    console.log(JSON.stringify({ error: 'Usage: context-snapshot.js save "<task>" "<findings>" "<pending>"' }));
    process.exit(1);
  }
  const snapshot = {
    task: arg1,
    findings: arg2 || '',
    pending: arg3 || '',
    savedAt: new Date().toISOString(),
    contextAtSave: null, // model fills this in if known
  };
  save(snapshot);
  console.log(JSON.stringify({
    ok: true,
    message: 'Snapshot saved. This will survive context compaction.',
    savedAt: snapshot.savedAt
  }));
}

else if (cmd === 'load') {
  const snapshot = load();
  if (!snapshot) {
    console.log(JSON.stringify({ message: 'No snapshot found.' }));
  } else {
    console.log(JSON.stringify(snapshot, null, 2));
  }
}

else if (cmd === 'clear') {
  const snapshot = load();
  if (snapshot) {
    save({ ...snapshot, _clearedAt: new Date().toISOString() });
  }
  console.log(JSON.stringify({ ok: true, message: 'Snapshot cleared.' }));
}

else {
  console.log('Usage:');
  console.log('  context-snapshot.js save "<task>" "<findings>" "<pending>"');
  console.log('  context-snapshot.js load');
  console.log('  context-snapshot.js clear');
}
