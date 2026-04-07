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

function getStatus(autoMode = false) {
  const states = loadJson(STATE_FILE) || {};
  const activeTasks = Object.values(states);
  
  // Load mode config
  const CONFIG_FILE = join(PROJECT_DIR, 'workflow-config.json');
  const config = loadJson(CONFIG_FILE) || { auto_pilot: true };
  const isAutoPilot = config.auto_pilot !== false;

  if (!autoMode) {
    console.log('=== Multi-Step Workflow Status ===');
    console.log(`Current Mode: ${isAutoPilot ? 'Auto-Pilot' : 'Manual Approval'}\n`);
  }
  
  if (activeTasks.length === 0) {
    if (!autoMode) console.log('No active tasks in state machine.');
    return;
  }
  
  activeTasks.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).forEach(task => {
    if (!autoMode) {
      console.log(`Task: ${task.taskName} [${task.taskId}]`);
      console.log(`State: ${task.state} (Updated: ${task.updatedAt})`);
    }
    
    // Check task tracker for details
    const trackerId = Buffer.from(task.taskName).toString('hex');
    const trackerFile = join(TRACKER_DIR, `${trackerId}.json`);
    const trackerData = loadJson(trackerFile);
    
    if (trackerData) {
      const progress = `${trackerData.done.length}/${trackerData.steps.length}`;
      if (!autoMode) {
        const barCount = 20;
        const filled = Math.round((trackerData.done.length / trackerData.steps.length) * barCount);
        const bar = '█'.repeat(filled) + '░'.repeat(barCount - filled);
        console.log(`Progress: ${bar} ${progress}`);
        trackerData.steps.forEach((s, i) => {
          const mark = trackerData.done.includes(i) ? '✅' : '⏳';
          console.log(`  ${mark} ${i + 1}. ${s}`);
        });
      }

      if (autoMode) {
        // Intelligence for AI
        let nextAction = '';
        const currentStepIdx = trackerData.steps.findIndex((_, i) => !trackerData.done.includes(i));
        
        console.log(`[SUMMARY] Current Progress: ${progress} tasks completed.`);
        
        if (task.state === 'PLANNING') {
          nextAction = `Define steps and run: node scripts/task-tracker.js new "${task.taskName}" "step1|step2|..."`;
        } else if (task.state === 'EXECUTING') {
          if (currentStepIdx !== -1) {
            const nextStep = trackerData.steps[currentStepIdx];
            nextAction = `Execute Step ${currentStepIdx + 1} ("${nextStep}") and then run: node scripts/task-tracker.js done "${task.taskName}" ${currentStepIdx + 1}`;
          }
        } else if (task.state === 'VERIFYING') {
          nextAction = `Verify the final outcome. If OK, run: node scripts/state-machine.js next "${task.taskId}"`;
        } else if (task.state === 'MEMORYING') {
          nextAction = `Record learned patterns to long-term memory, then run: node scripts/state-machine.js next "${task.taskId}"`;
        }
        
        if (nextAction) {
          console.log(`NEXT_ACTION: ${nextAction}`);
          if (isAutoPilot) {
            console.log('GUIDE: Mode is Auto-Pilot. Briefly inform user of progress, then IMMEDIATELY PROCEED to next action.');
          } else {
            console.log('GUIDE: Mode is Manual Approval. Briefly inform user of progress and WAIT for their confirmation before proceeding.');
          }
        }
      }
    } else {
      if (!autoMode) console.log('No detailed step tracking found for this task.');
    }
    if (!autoMode) console.log('---');
  });
}

const isAuto = process.argv.includes('--auto');
getStatus(isAuto);
