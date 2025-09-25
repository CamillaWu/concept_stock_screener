#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

if ! command -v pnpm >/dev/null 2>&1; then
    if command -v corepack >/dev/null 2>&1; then
        echo "pnpm not found, attempting to enable via corepack"
        corepack enable pnpm >/dev/null 2>&1 || true
    fi
fi

if ! command -v pnpm >/dev/null 2>&1; then
    echo "pnpm is not available on PATH. Install pnpm or run 'corepack enable pnpm'."
    exit 0
fi

NPMRC_PATH="${PROJECT_ROOT}/.npmrc"
if [ -f "$NPMRC_PATH" ]; then
    if grep -q 'node-linker=hoisted' "$NPMRC_PATH"; then
        echo "node-linker=hoisted already present in $NPMRC_PATH"
    else
        echo 'node-linker=hoisted' >> "$NPMRC_PATH"
        echo "Added node-linker=hoisted to $NPMRC_PATH"
    fi
else
    echo 'node-linker=hoisted' > "$NPMRC_PATH"
    echo "Created $NPMRC_PATH with node-linker=hoisted"
fi

pnpm config set node-linker hoisted --global >/dev/null 2>&1 || echo "Warning: failed to set global pnpm node-linker"
