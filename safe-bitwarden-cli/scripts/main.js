#!/usr/bin/env node

const { spawn, spawnSync } = require('child_process');
const os = require('os');

/**
 * ENVIRONMENT DETECTOR
 */
const platform = os.platform(); // 'darwin', 'linux', 'win32'
const isLinuxX11 = platform === 'linux' && process.env.XDG_SESSION_TYPE === 'x11';
const isLinuxWayland = platform === 'linux' && process.env.XDG_SESSION_TYPE === 'wayland';

/**
 * SAFE COMMAND EXECUTION (No Shell)
 * Prevents shell injection by using argument arrays.
 */
function runSafe(cmd, args = [], returnStdout = false) {
    try {
        const res = spawnSync(cmd, args, {
            stdio: returnStdout ? ['ignore', 'pipe', 'pipe'] : 'ignore',
            encoding: 'utf8'
        });
        if (res.status === 0) {
            return { success: true, output: res.stdout ? res.stdout.trim() : null };
        } else {
            return { success: false, output: res.stderr ? res.stderr.trim() : `Exit code ${res.status}` };
        }
    } catch (err) {
        return { success: false, output: err.message };
    }
}

function checkDependencies() {
    const bwCheck = runSafe('bw', ['--version'], true);
    const copyqCheck = runSafe('copyq', ['--version'], true);
    
    let bwStatus = 'unknown';
    if (bwCheck.success) {
        const statusCheck = runSafe('bw', ['status'], true);
        if (statusCheck.success && statusCheck.output.includes('"status":"unlocked"')) {
            bwStatus = 'unlocked';
        } else if (statusCheck.success && statusCheck.output.includes('"status":"locked"')) {
            bwStatus = 'locked';
        } else {
            bwStatus = 'unauthenticated';
        }
    }

    return {
        bwInstalled: bwCheck.success,
        copyqInstalled: copyqCheck.success,
        bwStatus: bwStatus
    };
}

/**
 * ACTION ROUTER
 */
const action = process.argv[2];
const arg1 = process.argv[3]; // query or id

async function main() {
    if (!action) {
        console.error("Usage: main.js <setup|install|search|copy|paste> [args]");
        process.exit(1);
    }

    switch (action) {
        case 'setup':
            handleSetup();
            break;
        case 'install':
            handleInstall();
            break;
        case 'search':
            handleSearch(arg1);
            break;
        case 'copy':
            handleCopy(arg1);
            break;
        case 'paste':
            handlePaste();
            break;
        default:
            console.error(`Unknown action: ${action}`);
            process.exit(1);
    }
}

function handleSetup() {
    console.log(`[Detector] OS: ${platform}`);
    const deps = checkDependencies();
    console.log(JSON.stringify(deps, null, 2));

    if (!deps.bwInstalled || !deps.copyqInstalled) {
        console.log(`\n[ActionRequired] Missing dependencies. Run: node main.js install`);
    } else if (deps.bwStatus === 'locked' || deps.bwStatus === 'unauthenticated') {
        console.log('\n[ActionRequired] BW is locked or unauthenticated. Please run:');
        console.log('export BW_SESSION=$(bw unlock --raw)');
    } else {
        console.log("\n[Success] Environment is ready!");
    }
}

/**
 * REAL AUTO-INSTALL LOGIC
 * Executed after user confirmation in the conversational flow.
 */
function handleInstall() {
    console.log(`[Install] Starting autonomous installation for ${platform}...`);
    
    let commands = [];
    if (platform === 'darwin') {
        commands.push(['brew', ['install', 'bitwarden-cli']]);
        commands.push(['brew', ['install', '--cask', 'copyq']]);
    } else if (platform === 'win32') {
        commands.push(['winget', ['install', 'Bitwarden.CLI']]);
        commands.push(['winget', ['install', 'hluk.CopyQ']]);
    } else if (platform === 'linux') {
        // Try to detect distributor
        const checkApt = runSafe('apt', ['--version']);
        if (checkApt.success) {
            commands.push(['sudo', ['apt', 'update']]);
            commands.push(['sudo', ['apt', 'install', '-y', 'bitwarden-cli', 'copyq']]);
        } else {
            console.log("[Info] Please install 'bitwarden-cli' and 'copyq' using your package manager.");
            return;
        }
    }

    for (const [cmd, args] of commands) {
        console.log(`> Running: ${cmd} ${args.join(' ')}`);
        const res = runSafe(cmd, args);
        if (!res.success) {
            console.error(`[Error] Failed to run ${cmd}: ${res.output}`);
            process.exit(1);
        }
    }
    console.log("[Success] Installation complete. Run 'node main.js setup' to verify.");
}

function handleSearch(query) {
    if (!query) {
        console.error('Missing search query');
        process.exit(1);
    }
    
    // SAFE: Pass query as an argument, no shell interpolation.
    const res = runSafe('bw', ['list', 'items', '--search', query], true);
    if (!res.success) {
        console.error('[Error] Failed to search. Please ensure bw is unlocked.', res.output);
        process.exit(1);
    }

    try {
        const items = JSON.parse(res.output);
        const results = items.map(idx => ({
            id: idx.id,
            name: idx.name,
            username: idx.login ? idx.login.username : 'N/A'
        }));
        console.log(JSON.stringify(results, null, 2));
    } catch (e) {
        console.error('[Error] Could not parse bw output.');
    }
}

/**
 * SAFE PIPED COPY
 * Pipes bw output directly to copyq without shell interpolation.
 */
function handleCopy(id) {
    if (!id) {
        console.error('Missing item ID');
        process.exit(1);
    }

    console.log(`[Info] Initiating direct pipe transmission for ID: ${id}`);
    
    const bw = spawn('bw', ['get', 'password', id]);
    const copyq = spawn('copyq', ['copy', '-']);

    bw.stdout.pipe(copyq.stdin);

    bw.on('close', (code) => {
        if (code !== 0) {
            console.error(`[Error] bw failed with code ${code}`);
            process.exit(1);
        }
        copyq.stdin.end();
    });

    copyq.on('close', (code) => {
        if (code === 0) {
            console.log('[Success] Secure copy complete. Auto-clearing in 30 seconds...');
            // Background cleanup using safe arguments
            const cleaner = spawn('node', ['-e', 'setTimeout(() => require("child_process").spawnSync("copyq", ["remove", "0"]), 30000)'], {
                detached: true,
                stdio: 'ignore'
            });
            cleaner.unref();
        } else {
            console.error(`[Error] copyq failed with code ${code}`);
        }
    });
}

function handlePaste() {
    console.log(`[Info] Simulating Paste on ${platform}...`);
    
    let res;
    if (platform === 'darwin') {
        res = runSafe('osascript', ['-e', 'tell application "System Events" to keystroke "v" using command down']);
    } else if (isLinuxX11) {
        res = runSafe('xdotool', ['key', 'ctrl+v']);
    } else if (isLinuxWayland) {
        res = runSafe('wtype', ['-k', 'v']);
    } else if (platform === 'win32') {
        res = runSafe('powershell', ['-c', "$wshell = New-Object -ComObject WScript.Shell; $wshell.SendKeys('^v')"]);
    } else {
        console.error('[Error] Platform not supported for auto-paste.');
        process.exit(1);
    }

    if (res && res.success) {
        console.log('[Success] Keystroke injection successful.');
    } else {
        console.error('[Error] Paste failed. Ensure local permissions are granted.', res ? res.output : '');
    }
}

main();
