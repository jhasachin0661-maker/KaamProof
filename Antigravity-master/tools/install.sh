#!/usr/bin/env bash
# Antigravity Ecosystem Installer (sh)

set -e

DRY_RUN=0
GLOBAL=0
TARGET=""
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

usage() {
    echo "Usage: $0 [target_directory] [--global] [--dry-run]"
    exit 1
}

for arg in "$@"; do
    if [[ "$arg" == "--dry-run" ]]; then
        DRY_RUN=1
    elif [[ "$arg" == "--global" ]]; then
        GLOBAL=1
    elif [[ "$arg" == --* ]]; then
        echo "Unknown option: $arg"
        usage
    else
        TARGET="$arg"
    fi
done

if [[ $GLOBAL -eq 1 ]]; then
    AGENT_DIR="$HOME/.gemini/antigravity"
else
    if [[ -z "$TARGET" ]]; then
        TARGET="."
    fi
    AGENT_DIR="$TARGET/.agent"
fi

echo "Installing Antigravity Ecosystem..."
echo "Target Agent Directory: $AGENT_DIR"
if [[ $DRY_RUN -eq 1 ]]; then
    echo "--- DRY RUN MODE ---"
fi

# 1. Copy skills and workflows
for dir in skills workflows; do
    SRC="$REPO_ROOT/$dir"
    DST="$AGENT_DIR/$dir"
    
    if [[ -d "$SRC" ]]; then
        if [[ $DRY_RUN -eq 1 ]]; then
            echo "[DRY RUN] Would copy $SRC to $DST"
        else
            mkdir -p "$DST"
            cp -r "$SRC/"* "$DST/"
            echo "Copied $dir to $DST"
        fi
    fi
done

# 2. Merge AGENTS_TEMPLATE.md into AGENTS.md
if [[ $GLOBAL -eq 0 ]]; then
    AGENTS_FILE="$TARGET/AGENTS.md"
    TEMPLATE_FILE="$REPO_ROOT/AGENTS_TEMPLATE.md"
    
    if [[ -f "$TEMPLATE_FILE" ]]; then
        if [[ $DRY_RUN -eq 1 ]]; then
            echo "[DRY RUN] Would merge $TEMPLATE_FILE into $AGENTS_FILE"
        else
            mkdir -p "$TARGET"
            if [[ ! -f "$AGENTS_FILE" ]]; then
                touch "$AGENTS_FILE"
            fi
            
            # Check if already merged
            if ! grep -q "<!-- ANTIGRAVITY ECOSYSTEM START -->" "$AGENTS_FILE"; then
                echo -e "\n<!-- ANTIGRAVITY ECOSYSTEM START -->" >> "$AGENTS_FILE"
                cat "$TEMPLATE_FILE" >> "$AGENTS_FILE"
                echo -e "\n<!-- ANTIGRAVITY ECOSYSTEM END -->\n" >> "$AGENTS_FILE"
                echo "Merged AGENTS_TEMPLATE.md into $AGENTS_FILE"
            else
                echo "AGENTS.md already contains ecosystem block. Skipping."
            fi
        fi
    fi

    # 3. Add .agent/context/ to .gitignore
    GITIGNORE="$TARGET/.gitignore"
    if [[ $DRY_RUN -eq 1 ]]; then
        echo "[DRY RUN] Would add .agent/context/ to $GITIGNORE"
    else
        if [[ ! -f "$GITIGNORE" ]]; then
            touch "$GITIGNORE"
        fi
        if ! grep -q "^.agent/context/" "$GITIGNORE"; then
            echo -e "\n.agent/context/" >> "$GITIGNORE"
            echo "Added .agent/context/ to $GITIGNORE"
        else
            echo ".agent/context/ already in $GITIGNORE"
        fi
    fi
fi

echo "Installation complete!"
