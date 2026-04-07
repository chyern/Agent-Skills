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

const CONFIG_FILE = resolve(process.env.HOME, '.openclaw/workspace/project/openclaw.json');
const NAMESPACE = 'multi-step-workflow';

const DEFAULT_CONFIG = {
  useSubAgents: false,
  maxSubAgents: 3
};

function loadFullConfig() {
  if (!existsSync(CONFIG_FILE)) return {};
  try {
    return JSON.parse(readFileSync(CONFIG_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function getSkillConfig() {
  const data = loadFullConfig();
  return { ...DEFAULT_CONFIG, ...(data[NAMESPACE] || {}) };
}

function saveSkillConfig(skillConfig) {
  const data = loadFullConfig();
  data[NAMESPACE] = skillConfig;
  mkdirSync(dirname(CONFIG_FILE), { recursive: true });
  writeFileSync(CONFIG_FILE, JSON.stringify(data, null, 2));
}

const [cmd, key, value] = process.argv.slice(2);

if (cmd === 'get') {
  console.log(JSON.stringify(getSkillConfig(), null, 2));
} else if (cmd === 'set' && key && value) {
  const config = getSkillConfig();
  if (typeof DEFAULT_CONFIG[key] === 'boolean') {
    config[key] = value === 'true';
  } else if (typeof DEFAULT_CONFIG[key] === 'number') {
    config[key] = parseInt(value, 10);
  } else {
    config[key] = value;
  }
  saveSkillConfig(config);
  console.log(JSON.stringify({ ok: true, config_file: CONFIG_FILE, [NAMESPACE]: config }, null, 2));
} else {
  console.log('Usage:');
  console.log('  node scripts/config.js get');
  console.log('  node scripts/config.js set <key> <value>');
}
