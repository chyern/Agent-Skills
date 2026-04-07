#!/usr/bin/env node
/**
 * workflow-status - Unified view of the multi-step-workflow state
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, join } from 'path';

const PROJECT_DIR = resolve(process.env.HOME, '.openclaw/workspace/project');
const STATE_FILE = join(PROJECT_DIR, 'state-machine.json');
const TRACKER_DIR = join(PROJECT_DIR, 'task-tracker');

function loadJson(path) {
  if (!existsSync(path)) return null;
  try { return JSON.parse(readFileSync(path, 'utf8')); }
  catch { return null; }
}

function getStatus() {
  const states = loadJson(STATE_FILE) || {};
  const activeTasks = Object.values(states);
  
  console.log('=== Multi-Step Workflow Status ===\n');
  
  if (activeTasks.length === 0) {
    console.log('No active tasks in state machine.');
    return;
  }
  
  activeTasks.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).forEach(task => {
    console.log(`Task: ${task.taskName} [${task.taskId}]`);
    console.log(`State: ${task.state} (Updated: ${task.updatedAt})`);
    
    // Check task tracker for details
    const trackerId = Buffer.from(task.taskName).toString('hex');
    const trackerFile = join(TRACKER_DIR, `${trackerId}.json`);
    const trackerData = loadJson(trackerFile);
    
    if (trackerData) {
      const progress = `${trackerData.done.length}/${trackerData.steps.length}`;
      const barCount = 20;
      const filled = Math.round((trackerData.done.length / trackerData.steps.length) * barCount);
      const bar = '█'.repeat(filled) + '░'.repeat(barCount - filled);
      
      console.log(`Progress: ${bar} ${progress}`);
      trackerData.steps.forEach((s, i) => {
        const mark = trackerData.done.includes(i) ? '✅' : '⏳';
        console.log(`  ${mark} ${i + 1}. ${s}`);
      });
    } else {
      console.log('No detailed step tracking found for this task.');
    }
    console.log('---');
  });
}

getStatus();
