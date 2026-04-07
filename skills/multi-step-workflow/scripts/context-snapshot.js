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

// Simple regex patterns for common PII and secrets
const rules = [
  { name: 'Email', regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, replacement: '[REDACTED_EMAIL]' },
  { name: 'IPv4', regex: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g, replacement: '[REDACTED_IP]' },
  { name: 'Token/Key', regex: /(?:Bearer |Token |key=|password=|secret=)['"]?([a-zA-Z0-9\-_]{16,})['"]?/gi, replacement: '[REDACTED_SECRET]' },
  { name: 'Phone', regex: /(?:\+\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}\b/g, replacement: '[REDACTED_PHONE]' }
];

function sanitize(input) {
  if (!input) return input;
  let sanitized = input;
  for (const rule of rules) {
    sanitized = sanitized.replace(rule.regex, (match) => {
      if (match.toLowerCase().startsWith('bearer ')) return 'Bearer [REDACTED_SECRET]';
      if (match.toLowerCase().startsWith('token ')) return 'Token [REDACTED_SECRET]';
      if (match.toLowerCase().includes('key=')) return match.replace(/key=[^&\s]+/i, 'key=[REDACTED_SECRET]');
      if (match.toLowerCase().includes('password=')) return match.replace(/password=[^&\s]+/i, 'password=[REDACTED_SECRET]');
      if (match.toLowerCase().includes('secret=')) return match.replace(/secret=[^&\s]+/i, 'secret=[REDACTED_SECRET]');
      return rule.replacement;
    });
  }
  return sanitized;
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
