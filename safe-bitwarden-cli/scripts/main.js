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
 * COMPLIANCE SECURITY LAYER
 * Native Clipboard Whitelist (No third-party dependency).
 */
const ALLOWED_BINS = [
    'bw', 'pbcopy', 'clip', 'xclip', 'wl-copy'
];

/**
 * NATIVE CLIPBOARD RESOLVER
 * Returns the correct clipboard binary based on OS/Session.
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
 * HARDCODED COMMAND WRAPPERS
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

function execNativeCheck(bin) {
    if (!ALLOWED_BINS.includes(bin)) return { success: false };
    try {
        // Most clippers don't have --version or it's inconsistent, we just check if exists.
        const res = spawnSync(bin, ['--help'], { stdio: 'ignore', shell: false });
        return { success: res.status !== null };
    } catch (err) {
        return { success: false };
    }
}

function checkDependencies() {
    const bwCheck = execBw(['--version'], true);
    const clipper = getNativeClipper();
    const clipCheck = clipper ? execNativeCheck(clipper) : { success: false };
    
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
        nativeClipperInstalled: clipCheck.success,
        clipperType: clipper,
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

    if (!deps.bwInstalled) {
        console.log(`\n[ActionRequired] Missing 'bitwarden-cli'. Please install 'bw' on your system.`);
    } else if (!deps.nativeClipperInstalled && deps.clipperType) {
        console.log(`\n[ActionRequired] Missing native clipper: ${deps.clipperType}. Please install it.`);
    } else if (deps.bwStatus === 'locked' || deps.bwStatus === 'unauthenticated') {
        console.log('\n[ActionRequired] BW is locked or unauthenticated. Please run:');
        console.log('export BW_SESSION=$(bw unlock --raw)');
    } else {
        console.log("\n[Success] Environment is ready! (Using Native Clipboard)");
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
 * SAFE NATIVE PIPED COPY
 */
function handleCopy(id) {
    if (!id) {
        console.error('Missing item ID');
        process.exit(1);
    }

    const clipper = getNativeClipper();
    if (!clipper) {
        console.error('[Error] OS/Session not supported for native clipboard.');
        process.exit(1);
    }

    const clipperArgs = getClipperArgs(clipper);

    console.log(`[Info] Initiating direct native pipe transmission for ID: ${id}`);
    
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
            console.log('[Success] Secure copy complete. Credential is now in your NATIVE clipboard.');
        } else {
            console.error(`[Error] Native clipper failed with code ${code}`);
        }
    });
}

main();
