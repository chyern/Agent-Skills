#!/usr/bin/env node
/**
 * scripts/config.js
 * 
 * Manages the workflow settings for the agent, particularly around security constraints
 * like the use of parallel sub-agents (which is restricted by default due to audit requirements).
 * 
 * Usage:
 *   node config.js get
 *   node config.js set useSubAgents true
 *   node config.js set maxSubAgents 2
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';

const CONFIG_FILE = resolve(process.env.HOME, '.openclaw/workspace/project/workflow.config.json');

const DEFAULT_CONFIG = {
  useSubAgents: false,
  maxSubAgents: 3
};

function load() {
  if (!existsSync(CONFIG_FILE)) return DEFAULT_CONFIG;
  try {
    const data = JSON.parse(readFileSync(CONFIG_FILE, 'utf8'));
    return { ...DEFAULT_CONFIG, ...data };
  } catch {
    return DEFAULT_CONFIG;
  }
}

function save(config) {
  mkdirSync(dirname(CONFIG_FILE), { recursive: true });
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

const [cmd, key, value] = process.argv.slice(2);

if (cmd === 'get') {
  console.log(JSON.stringify(load(), null, 2));
} else if (cmd === 'set' && key && value) {
  const config = load();
  // Simple type casting based on default values
  if (typeof DEFAULT_CONFIG[key] === 'boolean') {
    config[key] = value === 'true';
  } else if (typeof DEFAULT_CONFIG[key] === 'number') {
    config[key] = parseInt(value, 10);
  } else {
    config[key] = value;
  }
  save(config);
  console.log(JSON.stringify({ ok: true, config }, null, 2));
} else {
  console.log('Usage:');
  console.log('  node scripts/config.js get');
  console.log('  node scripts/config.js set <key> <value>');
}
