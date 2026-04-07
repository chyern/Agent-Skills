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

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { execSync } from 'child_process';

const SKILL_MD = resolve(dirname(import.meta.url).replace('file://', ''), '../SKILL.md');
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
      // Some CLIs might return raw value or JSON
      try {
        const remote = JSON.parse(output);
        config = { ...config, ...remote };
      } catch {
        // If it's not JSON, it might be a single value, but 'get <namespace>' usually returns object
      }
    }
  } catch (e) {
    // Key might not exist, defaults are used
  }

  // Sync the 'always' value from SKILL.md (source of truth for the platform hook)
  if (existsSync(SKILL_MD)) {
    const content = readFileSync(SKILL_MD, 'utf8');
    const match = content.match(/always:\s*(true|false)/);
    if (match) config.always = match[1] === 'true';
  }
  
  return config;
}

function saveSkillConfig(skillConfig) {
  // 1. Sync values to global openclaw.json via CLI
  for (const [key, value] of Object.entries(skillConfig)) {
    try {
      // We use --strict-json to ensure booleans and numbers are typed correctly
      const jsonValue = JSON.stringify(value);
      execSync(`openclaw config set ${NAMESPACE}.${key} '${jsonValue}' --strict-json`, { stdio: 'ignore' });
    } catch (e) {
      console.error(`Failed to set ${NAMESPACE}.${key}`);
    }
  }

  // 2. Cross-file update: modify SKILL.md if 'always' is changed
  if (existsSync(SKILL_MD)) {
    let content = readFileSync(SKILL_MD, 'utf8');
    const newVal = skillConfig.always ? 'true' : 'false';
    const updated = content.replace(/(always:\s*)(true|false)/, `$1${newVal}`);
    if (content !== updated) {
      writeFileSync(SKILL_MD, updated);
      return true; 
    }
  }
  return false;
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
  
  const skillModified = saveSkillConfig(config);
  
  console.log(JSON.stringify({ 
    ok: true, 
    source: 'openclaw config cli',
    platform_hook_modified: key === 'always' && skillModified,
    [NAMESPACE]: config 
  }, null, 2));
} else {
  console.log('Usage:');
  console.log('  node scripts/config.js get');
  console.log('  node scripts/config.js set <key> <value>');
}
