#!/usr/bin/env node

const { spawn, spawnSync } = require('child_process');
const os = require('os');

/**
 * ENVIRONMENT DETECTOR
 */
const platform = os.platform(); // 'darwin', 'linux', 'win32'

/**
 * COMPLIANCE SECURITY LAYER
 * Explicit whitelist of allowed binary names.
 * (Removed Keystroke Automation bins per new positioning)
 */
const ALLOWED_BINS = [
    'bw', 'copyq', 'brew', 
    'winget', 'apt', 'sudo', 'node'
];

/**
 * PROTECTED COMMAND EXECUTION
 */
function runSafe(cmd, args = [], returnStdout = false) {
    if (!ALLOWED_BINS.includes(cmd)) {
        return { success: false, output: `Forbidden binary: ${cmd}` };
    }

    try {
        const res = spawnSync(cmd, args, {
            stdio: returnStdout ? ['ignore', 'pipe', 'pipe'] : 'ignore',
            encoding: 'utf8',
            shell: false
        });
        if (res.status === 0) {
            return { success: true, output: res.stdout ? res.stdout.trim() : null };
        } else {
            const errOutput = res.stderr ? res.stderr.trim() : `Exit code ${res.status}`;
            return { success: false, output: errOutput };
        }
    } catch (err) {
        return { success: false, output: err.message };
    }
}

/**
 * HARDCODED COMMAND WRAPPERS
 */
const bw = {
    version: () => runSafe('bw', ['--version'], true),
    status: () => runSafe('bw', ['status'], true),
    list: (query) => runSafe('bw', ['list', 'items', '--search', query], true)
};

const copyq = {
    version: () => runSafe('copyq', ['--version'], true),
    remove: (idx) => runSafe('copyq', ['remove', String(idx)])
};

function checkDependencies() {
    const bwCheck = bw.version();
    const copyqCheck = copyq.version();
    
    let bwStatus = 'unknown';
    if (bwCheck.success) {
        const statusCheck = bw.status();
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
        console.error("Usage: main.js <setup|install|search|copy> [args]");
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
        console.log(`\n[ActionRequired] Missing dependencies. Run: node scripts/main.js install`);
    } else if (deps.bwStatus === 'locked' || deps.bwStatus === 'unauthenticated') {
        console.log('\n[ActionRequired] BW is locked or unauthenticated. Please run:');
        console.log('export BW_SESSION=$(bw unlock --raw)');
    } else {
        console.log("\n[Success] Environment is ready!");
    }
}

/**
 * REAL AUTO-INSTALL LOGIC
 */
function handleInstall() {
    console.log(`[Install] Starting autonomous installation for ${platform}...`);
    
    if (platform === 'darwin') {
        runSafe('brew', ['install', 'bitwarden-cli']);
        runSafe('brew', ['install', '--cask', 'copyq']);
    } else if (platform === 'win32') {
        runSafe('winget', ['install', 'Bitwarden.CLI']);
        runSafe('winget', ['install', 'hluk.CopyQ']);
    } else if (platform === 'linux') {
        const checkApt = runSafe('apt', ['--version']);
        if (checkApt.success) {
            runSafe('sudo', ['apt', 'update']);
            runSafe('sudo', ['apt', 'install', '-y', 'bitwarden-cli', 'copyq']);
        } else {
            console.log("[Info] Please install 'bitwarden-cli' and 'copyq' via your package manager.");
            return;
        }
    }
    console.log("[Success] Installation process triggered. Run 'node scripts/main.js setup' to verify.");
}

function handleSearch(query) {
    if (!query) {
        console.error('Missing search query');
        process.exit(1);
    }
    
    const res = bw.list(query);
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
            console.log('[Success] Secure copy complete. Auto-clearing in 30 seconds...');
            const cleaner = spawn('node', [
                '-e', 
                'setTimeout(() => require("child_process").spawnSync("copyq", ["remove", "0"], {shell:false}), 30000)'
            ], {
                detached: true,
                stdio: 'ignore'
            });
            cleaner.unref();
        } else {
            console.error(`[Error] copyq failed with code ${code}`);
        }
    });
}

main();
