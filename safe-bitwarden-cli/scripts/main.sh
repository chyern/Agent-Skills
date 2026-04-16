#!/bin/bash

# Safe Bitwarden CLI - Pure Shell Edition (v1.5.0)
# A secure, transparent bridge using native kernel piping.

set -e

PLATFORM=$(uname -s | tr '[:upper:]' '[:lower:]')

# --- CLIPPER RESOLUTION ---
get_clipper() {
    if [[ "$PLATFORM" == "darwin" ]]; then
        echo "pbcopy"
    elif [[ "$PLATFORM" == "linux" ]]; then
        if command -v wl-copy >/dev/null 2>&1; then
            echo "wl-copy"
        elif command -v xclip >/dev/null 2>&1; then
            echo "xclip -selection clipboard"
        else
            return 1
        fi
    elif [[ "$PLATFORM" == *"mingw"* || "$PLATFORM" == *"cygwin"* || "$PLATFORM" == *"msys"* ]]; then
        echo "clip"
    elif command -v clip.exe >/dev/null 2>&1; then
        echo "clip.exe"
    else
        return 1
    fi
}

# --- DEPENDENCY CHECK ---
handle_setup() {
    echo "{\"platform\": \"$PLATFORM\"}"
    
    BW_PATH=$(command -v bw || true)
    CLIPPER_CMD=$(get_clipper || true)
    PYTHON_PATH=$(command -v python3 || true)

    echo "{"
    echo "  \"bwInstalled\": $([ -n "$BW_PATH" ] && echo "true" || echo "false"),"
    echo "  \"clipperDetected\": $([ -n "$CLIPPER_CMD" ] && echo "true" || echo "false"),"
    echo "  \"clipperType\": \"$CLIPPER_CMD\","
    echo "  \"pythonInstalled\": $([ -n "$PYTHON_PATH" ] && echo "true" || echo "false")"
    echo "}"

    if [[ -z "$BW_PATH" ]]; then
        echo -e "\n[ActionRequired] Please install bitwarden-cli (bw)."
    fi
    if [[ -z "$CLIPPER_CMD" ]]; then
        echo -e "\n[ActionRequired] No native clipper found (pbcopy/xclip/wl-copy/clip)."
    fi
}

# --- SEARCH LOGIC (MEMORY SAFE VIA PYTHON) ---
handle_search() {
    QUERY="$1"
    if [[ -z "$QUERY" ]]; then
        echo "Error: Missing query" >&2
        exit 1
    fi

    # Retrieve data and parse using Python3 (pre-installed on macOS/Linux)
    # This ensures only non-sensitive metadata hits the output.
    bw list items --search "$QUERY" | python3 -c '
import sys, json
try:
    data = json.load(sys.stdin)
    results = []
    for item in data:
        results.append({
            "id": item.get("id"),
            "name": item.get("name"),
            "username": item.get("login", {}).get("username", "N/A")
        })
    print(json.dumps(results, indent=2))
except Exception as e:
    print(json.dumps({"error": str(e)}))
'
}

# --- SECURE COPY (KERNAL PIPE) ---
handle_copy() {
    ID="$1"
    if [[ -z "$ID" ]]; then
        echo "Error: Missing ID" >&2
        exit 1
    fi

    CLIPPER_CMD=$(get_clipper)
    if [[ -z "$CLIPPER_CMD" ]]; then
        echo "Error: No clipper found" >&2
        exit 1
    fi

    echo "[Info] Piped transmission initiated..."
    
    # CRITICAL SECURITY STEP: Pure pipe between BW and Clipper.
    # The shell never stores the password in a variable.
    # Use eval to handle compound clipper commands like 'xclip -selection clipboard'
    bw get password "$ID" | eval "$CLIPPER_CMD"

    if [[ $? -eq 0 ]]; then
        echo "[Success] Secure copy complete. Credential is in your NATIVE clipboard."
    else
        echo "[Error] Secure copy failed."
        exit 1
    fi
}

# --- ROUTER ---
ACTION="$1"
PARAM="$2"

case "$ACTION" in
    setup)
        handle_setup
        ;;
    search)
        handle_search "$PARAM"
        ;;
    copy)
        handle_copy "$PARAM"
        ;;
    *)
        echo "Usage: $0 {setup|search|copy} [param]"
        exit 1
        ;;
esac
