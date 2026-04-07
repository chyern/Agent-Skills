#!/usr/bin/env node
/**
 * set-mode - Configure workflow mode between auto-pilot and manual approval
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, join, dirname } from 'path';

const PROJECT_DIR = resolve(process.env.HOME, '.openclaw/workspace/project');
const CONFIG_FILE = join(PROJECT_DIR, 'workflow-config.json');
mkdirSync(PROJECT_DIR, { recursive: true });

function loadConfig() {
  if (!existsSync(CONFIG_FILE)) return { auto_pilot: true };
  try {
    return JSON.parse(readFileSync(CONFIG_FILE, 'utf8'));
  } catch (e) {
    return { auto_pilot: true };
  }
}

function saveConfig(config) {
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

const mode = process.argv[2]?.toLowerCase();

if (mode === 'auto') {
  saveConfig({ auto_pilot: true });
  console.log('[MODE] Set to Auto-Pilot (Autonomous Execution Enabled)');
} else if (mode === 'manual' || mode === 'approval') {
  saveConfig({ auto_pilot: false });
  console.log('[MODE] Set to Manual Approval (User confirmation required for each step)');
} else if (mode === 'status') {
  const config = loadConfig();
  console.log(`Current Mode: ${config.auto_pilot ? 'Auto-Pilot' : 'Manual Approval'}`);
} else {
  console.log('Usage:');
  console.log('  node set-mode.js auto     - Enable autonomous execution');
  console.log('  node set-mode.js manual   - Require user approval for steps');
  console.log('  node set-mode.js status   - Display current mode');
}
