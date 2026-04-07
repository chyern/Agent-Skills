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

import { execSync } from 'child_process';

const NAMESPACE = 'multi-step-workflow';

const DEFAULT_CONFIG = {
  useSubAgents: false,
  maxSubAgents: 3,
  always: false
};

function getSkillConfig() {
  let config = { ...DEFAULT_CONFIG };
  try {
    const output = execSync(`openclaw config get ${NAMESPACE}`, { 
      encoding: 'utf8', 
      stdio: ['ignore', 'pipe', 'ignore'] 
    }).trim();
    
    if (output && output !== 'undefined' && output !== 'null') {
      try {
        const remote = JSON.parse(output);
        config = { ...config, ...remote };
      } catch {
        // Fallback to internal defaults if parsing fails
      }
    }
  } catch (e) {
    // Failsafe: if key doesn't exist, DEFAULT_CONFIG is used
  }
  return config;
}

function saveSkillConfig(skillConfig) {
  // Sync values to global openclaw.json via system CLI
  for (const [key, value] of Object.entries(skillConfig)) {
    try {
      const jsonValue = JSON.stringify(value);
      execSync(`openclaw config set ${NAMESPACE}.${key} '${jsonValue}' --strict-json`, { stdio: 'ignore' });
    } catch (e) {
      console.error(`Failed to set ${NAMESPACE}.${key}`);
    }
  }
}

const [cmd, key, value] = process.argv.slice(2);

if (cmd === 'get') {
  console.log(JSON.stringify(getSkillConfig(), null, 2));
} else if (cmd === 'set' && key && value) {
  const config = getSkillConfig();
  
  if (key === 'always' || typeof DEFAULT_CONFIG[key] === 'boolean') {
    config[key] = value === 'true';
  } else if (typeof DEFAULT_CONFIG[key] === 'number') {
    config[key] = parseInt(value, 10);
  } else {
    config[key] = value;
  }
  
  saveSkillConfig(config);
  
  console.log(JSON.stringify({ 
    ok: true, 
    source: 'openclaw config cli',
    message: key === 'always' ? 'Always-on preference saved to openclaw.json. NOTE: Manual SKILL.md edit required for physical platform load hook (security restriction).' : 'Config saved.',
    [NAMESPACE]: config 
  }, null, 2));
} else {
  console.log('Usage:');
  console.log('  node scripts/config.js get');
  console.log('  node scripts/config.js set <key> <value>');
}
