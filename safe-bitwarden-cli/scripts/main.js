#!/usr/bin/env node

const { spawn, spawnSync } = require('child_process');
const os = require('os');

/**
 * ENVIRONMENT DETECTOR
 */
const platform = os.platform(); // 'darwin', 'linux', 'win32'

/**
 * COMPLIANCE SECURITY LAYER
 * Explicit hardcoded commands to satisfy static analysis.
 */

function execBw(args, returnStdout = false) {
    try {
        const res = spawnSync('bw', args, {
            stdio: returnStdout ? ['ignore', 'pipe', 'pipe'] : 'ignore',
            encoding: 'utf8',
            shell: false
        });
        return { 
            success: res.status === 0, 
            output: res.status === 0 ? (res.stdout ? res.stdout.trim() : null) : (res.stderr ? res.stderr.trim() : `Exit code ${res.status}`)
        };
    } catch (err) {
        return { success: false, output: err.message };
    }
}

function execCopyQ(args, returnStdout = false) {
    try {
        const res = spawnSync('copyq', args, {
            stdio: returnStdout ? ['ignore', 'pipe', 'pipe'] : 'ignore',
            encoding: 'utf8',
            shell: false
        });
        return { 
            success: res.status === 0, 
            output: res.status === 0 ? (res.stdout ? res.stdout.trim() : null) : (res.stderr ? res.stderr.trim() : `Exit code ${res.status}`)
        };
    } catch (err) {
        return { success: false, output: err.message };
    }
}

function checkDependencies() {
    const bwCheck = execBw(['--version'], true);
    const copyqCheck = execCopyQ(['--version'], true);
    
    let bwStatus = 'unknown';
    if (bwCheck.success) {
        const statusCheck = execBw(['status'], true);
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
        console.error("Usage: main.js <setup|search|copy> [args]");
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
        console.log(`\n[ActionRequired] Missing dependencies. Please install 'bitwarden-cli' and 'copyq' on your system.`);
    } else if (deps.bwStatus === 'locked' || deps.bwStatus === 'unauthenticated') {
        console.log('\n[ActionRequired] BW is locked or unauthenticated. Please run:');
        console.log('export BW_SESSION=$(bw unlock --raw)');
    } else {
        console.log("\n[Success] Environment is ready!");
    }
}

function handleSearch(query) {
    if (!query) {
        console.error('Missing search query');
        process.exit(1);
    }
    
    const res = execBw(['list', 'items', '--search', query], true);
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
 * (TTL auto-clear removed per User request and Registry Audit feedback)
 */
function handleCopy(id) {
    if (!id) {
        console.error('Missing item ID');
        process.exit(1);
    }

    console.log(`[Info] Initiating direct pipe transmission for ID: ${id}`);
    
    const procBw = spawn('bw', ['get', 'password', id], { shell: false });
    const procCopyq = spawn('copyq', ['copy', '-'], { shell: false });

    procBw.stdout.pipe(procCopyq.stdin);

    procBw.on('close', (code) => {
        if (code !== 0) {
            console.error(`[Error] bw failed with code ${code}`);
            process.exit(1);
        }
        procCopyq.stdin.end();
    });

    procCopyq.on('close', (code) => {
        if (code === 0) {
            console.log('[Success] Secure copy complete. Credential is now in your clipboard.');
        } else {
            console.error(`[Error] copyq failed with code ${code}`);
        }
    });
}

main();
