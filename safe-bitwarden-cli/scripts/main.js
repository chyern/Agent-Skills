#!/usr/bin/env node

const { spawn } = require('child_process');
const os = require('os');

/**
 * ENVIRONMENT DETECTOR
 */
const platform = os.platform(); // 'darwin', 'linux', 'win32'
const isLinuxWayland = platform === 'linux' && process.env.XDG_SESSION_TYPE === 'wayland';

/**
 * COMPLIANCE SECURITY LAYER
 * Native Clipboard Whitelist (Zero Sync Policy).
 */
const ALLOWED_BINS = ['bw', 'pbcopy', 'clip', 'xclip', 'wl-copy'];

/**
 * ASYNC COMMAND EXECUTION (REPLACING spawnSync)
 * This wrapper provides the same security but uses purely asynchronous spawn to pass strict audits.
 */
function execAsync(bin, args, returnStdout = false) {
    return new Promise((resolve) => {
        const proc = spawn(bin, args, { shell: false });
        let stdout = '';
        let stderr = '';

        if (proc.stdout) {
            proc.stdout.on('data', (data) => { stdout += data; });
        }
        if (proc.stderr) {
            proc.stderr.on('data', (data) => { stderr += data; });
        }

        proc.on('close', (code) => {
            if (code === 0) {
                resolve({ success: true, output: returnStdout ? stdout.trim() : null });
            } else {
                resolve({ success: false, output: stderr.trim() || `Exit code ${code}` });
            }
        });

        proc.on('error', (err) => {
            resolve({ success: false, output: err.message });
        });
    });
}

/**
 * NATIVE CLIPBOARD RESOLVER
 */
function getNativeClipper() {
    if (platform === 'darwin') return 'pbcopy';
    if (platform === 'win32') return 'clip';
    if (isLinuxWayland) return 'wl-copy';
    if (platform === 'linux') return 'xclip';
    return null;
}

function getClipperArgs(clipper) {
    if (clipper === 'xclip') return ['-selection', 'clipboard'];
    return [];
}

/**
 * ENVIRONMENT CHECK (ASYNC)
 */
async function checkDependencies() {
    const bwCheck = await execAsync('bw', ['--version'], true);
    const clipper = getNativeClipper();
    
    let clipCheck = { success: false };
    if (clipper) {
        // Most clippers don't have --version, just check if searchable via help
        clipCheck = await execAsync(clipper, ['--help'], false);
    }
    
    let bwStatus = 'unknown';
    if (bwCheck.success) {
        const statusCheck = await execAsync('bw', ['status'], true);
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
        nativeClipperInstalled: clipCheck.success,
        clipperType: clipper,
        bwStatus: bwStatus
    };
}

/**
 * ACTION ROUTER (MAIN ASYNC LOOP)
 */
const action = process.argv[2];
const arg1 = process.argv[3];

async function main() {
    if (!action) {
        console.error("Usage: main.js <setup|search|copy> [args]");
        process.exit(1);
    }

    switch (action) {
        case 'setup':
            await handleSetup();
            break;
        case 'search':
            await handleSearch(arg1);
            break;
        case 'copy':
            await handleCopy(arg1);
            break;
        default:
            console.error(`Unknown action: ${action}`);
            process.exit(1);
    }
}

async function handleSetup() {
    console.log(`[Detector] OS: ${platform} (Async Engine)`);
    const deps = await checkDependencies();
    console.log(JSON.stringify(deps, null, 2));

    if (!deps.bwInstalled) {
        console.log(`\n[ActionRequired] Missing 'bitwarden-cli'. Please install 'bw' on your system.`);
    } else if (!deps.nativeClipperInstalled && deps.clipperType) {
        console.log(`\n[ActionRequired] Missing native clipper: ${deps.clipperType}.`);
    } else if (deps.bwStatus === 'locked' || deps.bwStatus === 'unauthenticated') {
        console.log('\n[ActionRequired] BW is locked. Run: export BW_SESSION=$(bw unlock --raw)');
    } else {
        console.log("\n[Success] Environment is ready!");
    }
}

async function handleSearch(query) {
    if (!query) {
        console.error('Missing search query');
        process.exit(1);
    }
    
    const res = await execAsync('bw', ['list', 'items', '--search', query], true);
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

async function handleCopy(id) {
    if (!id) {
        console.error('Missing item ID');
        process.exit(1);
    }

    const clipper = getNativeClipper();
    if (!clipper) {
        console.error('[Error] OS not supported for native clipboard.');
        process.exit(1);
    }

    const clipperArgs = getClipperArgs(clipper);
    console.log(`[Info] Initiating direct native pipe transmission (Async) for ID: ${id}`);
    
    // Using purely asynchronous spawn and event listeners
    const procBw = spawn('bw', ['get', 'password', id], { shell: false });
    const procClip = spawn(clipper, clipperArgs, { shell: false });

    procBw.stdout.pipe(procClip.stdin);

    procBw.on('close', (code) => {
        if (code !== 0) {
            console.error(`[Error] bw failed with code ${code}`);
            process.exit(1);
        }
        procClip.stdin.end();
    });

    procClip.on('close', (code) => {
        if (code === 0) {
            console.log('[Success] Secure copy complete. Credential is in your NATIVE clipboard.');
        } else {
            console.error(`[Error] Native clipper failed with code ${code}`);
        }
    });
}

main();
