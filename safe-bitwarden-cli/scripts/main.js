#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const os = require('os');
const fs = require('fs');

/**
 * ENVIRONMENT DETECTOR
 */
const platform = os.platform(); // 'darwin', 'linux', 'win32'
const isLinuxX11 = platform === 'linux' && process.env.XDG_SESSION_TYPE === 'x11';
const isLinuxWayland = platform === 'linux' && process.env.XDG_SESSION_TYPE === 'wayland';

function runCmd(cmd, returnStdout = false) {
    try {
        const stdout = execSync(cmd, { stdio: returnStdout ? 'pipe' : 'ignore', encoding: 'utf8' });
        return { success: true, output: stdout ? stdout.trim() : null };
    } catch (err) {
        return { success: false, output: err.message };
    }
}

function checkDependencies() {
    const bwCheck = runCmd('bw --version', true);
    const copyqCheck = runCmd('copyq --version', true);
    
    let bwStatus = 'unknown';
    if (bwCheck.success) {
        // Quick unlock check: bw status
        const statusCheck = runCmd('bw status', true);
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
        console.error("Usage: main.js <setup|search|copy|paste> [args]");
        process.exit(1);
    }

    switch (action) {
        case 'setup':
            handleSetup();
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
        let installHints = [];
        if (platform === 'darwin') {
            installHints.push("brew install bitwarden-cli");
            installHints.push("brew install --cask copyq");
        } else if (platform === 'win32') {
            installHints.push("winget install Bitwarden.CLI");
            installHints.push("winget install hluk.CopyQ");
        } else if (platform === 'linux') {
            installHints.push("sudo apt install bitwarden-cli copyq # Or use pacman, dnf.");
        }
        
        console.log(`\n[ActionRequired] Missing dependencies. Please run:\n${installHints.join('\n')}`);
    } else {
        if (deps.bwStatus === 'locked' || deps.bwStatus === 'unauthenticated') {
            console.log('\n[ActionRequired] BW is locked or unauthenticated. Please run:');
            console.log('export BW_SESSION=$(bw unlock --raw)');
        } else {
            console.log("\n[Success] Environment is ready!");
        }
    }
}

function handleSearch(query) {
    if (!query) {
        console.error('Missing search query');
        process.exit(1);
    }
    
    // Explicitly ask for json to parse it safely
    const res = runCmd(`bw list items --search "${query}"`, true);
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

function handleCopy(id) {
    if (!id) {
        console.error('Missing item ID');
        process.exit(1);
    }

    // AI Password Blindness Implemented: piped directly.
    console.log(`[Info] Initiating direct pipe transmission for ID: ${id}`);
    
    // We use spawn with shell to enable piping between the two commands without reading stdout here
    const child = spawn(`bw get password ${id} | copyq copy -`, { shell: true, stdio: 'ignore' });
    
    child.on('close', (code) => {
        if (code === 0) {
            console.log('[Success] Secure copy complete. Auto-clearing in 30 seconds...');
            // Background cleanup script, detaches so AI doesn't hang
            const cleaner = spawn('node', ['-e', 'setTimeout(() => require("child_process").execSync("copyq remove 0"), 30000)'], {
                detached: true,
                stdio: 'ignore'
            });
            cleaner.unref();

        } else {
            console.error('[Error] Secure copy failed. Session might be locked.');
        }
    });
}

function handlePaste() {
    console.log(`[Info] Simulating Paste on ${platform}...`);
    
    let cmd = '';
    if (platform === 'darwin') {
        cmd = `osascript -e 'tell application "System Events" to keystroke "v" using command down'`;
    } else if (isLinuxX11) {
        cmd = `xdotool key ctrl+v`;
    } else if (isLinuxWayland) {
        cmd = `wtype -k v`;
    } else if (platform === 'win32') {
        cmd = `powershell -c "$wshell = New-Object -ComObject WScript.Shell; $wshell.SendKeys('^v')"`;
    } else {
        console.error('[Error] Platform not supported for auto-paste.');
        process.exit(1);
    }

    if (cmd) {
        const res = runCmd(cmd);
        if (res.success) {
            console.log('[Success] Keystroke injection successful.');
        } else {
            console.error('[Error] Paste failed. Ensure window is focused and permissions are granted.', res.output);
        }
    }
}

main();
