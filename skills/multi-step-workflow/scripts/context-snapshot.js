#!/usr/bin/env node
/**
 * context-snapshot - Preserve task context before OpenClaw compaction
 * 
 * When OpenClaw auto-compacts context, conversation history gets summarized
 * and older turns are removed. This script lets the model save TASK-CRITICAL
 * information to a file that survives compaction.
 * 
 * Usage:
 *   node context-snapshot.js save "<task>" "<findings>" "<pending>" ["<last_error>"]
 *   node context-snapshot.js load
 *   node context-snapshot.js clear
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { getTempDir } from './path-resolver.js';

const SNAPSHOT_FILE = resolve(getTempDir(), 'context-snapshot.json');

/**
 * Saves the current workspace context into a temporary snapshot file.
 */
function saveSnapshot(task, findings, pending, lastError = null) {
  const snapshot = {
    timestamp: new Date().toISOString(),
    project_root: process.cwd(),
    task,
    findings, // Raw fidelity
    pending,
    lastError,
    status: 'active'
  };

  writeFileSync(SNAPSHOT_FILE, JSON.stringify(snapshot, null, 2));
  console.log(`Snapshot saved to ${SNAPSHOT_FILE}`);
}

/**
 * Loads the last saved snapshot for the current project.
 */
function loadSnapshot() {
  if (!existsSync(SNAPSHOT_FILE)) {
    console.log('No snapshot found for this project.');
    return null;
  }

  const data = readFileSync(SNAPSHOT_FILE, 'utf8');
  return JSON.parse(data);
}

const [cmd, arg1, arg2, arg3, arg4] = process.argv.slice(2);

if (cmd === 'save') {
  if (!arg1) {
    console.log(JSON.stringify({ error: 'Usage: context-snapshot.js save "<task>" "<findings>" "<pending>" ["<last_error>"]' }));
    process.exit(1);
  }
  const snapshot = {
    task: sanitize(arg1),
    findings: sanitize(arg2 || ''),
    pending: sanitize(arg3 || ''),
    lastError: sanitize(arg4 || ''),
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
  console.log('  context-snapshot.js save "<task>" "<findings>" "<pending>" ["<last_error>"]');
  console.log('  context-snapshot.js load');
  console.log('  context-snapshot.js clear');
}
