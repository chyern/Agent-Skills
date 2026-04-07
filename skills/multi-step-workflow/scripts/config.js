#!/usr/bin/env node
/**
 * scripts/config.js
 * 
 * Manages the workflow settings for the agent, particularly around security constraints
 * like the use of parallel sub-agents (which is restricted by default due to audit requirements).
 * 
 * Usage:
 *   node config.js get
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { homedir } from 'os';

const CONFIG_FILE = resolve(homedir(), '.openclaw/openclaw.json');
const NAMESPACE = 'multi-step-workflow';

const DEFAULT_CONFIG = {
  useSubAgents: false,
  maxSubAgents: 3,
  always: false
};

function getSkillConfig() {
  let config = { ...DEFAULT_CONFIG };
  
  if (existsSync(CONFIG_FILE)) {
    try {
      const data = JSON.parse(readFileSync(CONFIG_FILE, 'utf8'));
      if (data[NAMESPACE]) {
        config = { ...config, ...data[NAMESPACE] };
      }
    } catch {
      // JSON Parsing error or empty file, defaults are used
    }
  }
  
  return config;
}

const [cmd] = process.argv.slice(2);

if (cmd === 'get') {
  console.log(JSON.stringify(getSkillConfig(), null, 2));
} else {
  console.log('Usage:');
  console.log('  node scripts/config.js get');
  console.log('\nNOTE: To set/update configuration, please use the official CLI directly:');
  console.log(`  openclaw config set ${NAMESPACE}.<key> <value> --strict-json`);
}
