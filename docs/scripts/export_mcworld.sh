#!/bin/bash
set -eo pipefail

# --- Configuration ---
SERVERS_ROOT="/srv/minecraft/bedrock/servers"
UPLOAD_DIR="/srv/minecraft/upload"

# --- Main Logic ---
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <server_name>"
    echo "Example: $0 mythvale"
    exit 1
fi

SERVER_NAME="$1"

# CRITICAL: Validate server name to prevent directory traversal issues.
if [[ -z "$SERVER_NAME" ]] || ! [[ "$SERVER_NAME" =~ ^[A-Za-z0-9._-]+$ ]]; then
    echo "Error: Invalid server name." >&2
    echo "Name must not be empty and can only contain letters, numbers, dots, underscores, or hyphens." >&2
    exit 1
fi

SERVER_DIR="$SERVERS_ROOT/$SERVER_NAME"
EXPORT_FILE="$UPLOAD_DIR/$SERVER_NAME.mcworld"

if [ ! -d "$SERVER_DIR" ]; then
    echo "Error: Server directory '$SERVER_DIR' not found." >&2
    exit 1
fi

read -p "Please ensure the server '$SERVER_NAME' is fully stopped before exporting. Continue? [y/N] " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
fi

echo "Exporting server '$SERVER_NAME' to '$EXPORT_FILE'..."

# Create a temporary directory to stage files for zipping
TMP_DIR=$(mktemp -d)
trap 'rm -rf "$TMP_DIR"' EXIT

# Find the specific world directory (e.g., .../worlds/MyWorld)
# This script assumes there is exactly one world directory.
WORLD_DIR_PATH=$(find "$SERVER_DIR/worlds" -mindepth 1 -maxdepth 1 -type d)
if [ -z "$WORLD_DIR_PATH" ] || [ "$(echo "$WORLD_DIR_PATH" | wc -l)" -ne 1 ]; then
    echo "Error: Expected to find exactly one world directory in '$SERVER_DIR/worlds', but failed to do so." >&2
    exit 1
fi

echo " -> Staging world files from '$WORLD_DIR_PATH'..."
# Copy contents of the world directory to the root of our staging area
cp -a "$WORLD_DIR_PATH"/. "$TMP_DIR/"

# Copy packs to the root of our staging area if they exist
if [ -d "$SERVER_DIR/behavior_packs" ]; then
    echo " -> Staging behavior packs..."
    cp -a "$SERVER_DIR/behavior_packs" "$TMP_DIR/"
fi
if [ -d "$SERVER_DIR/resource_packs" ]; then
    echo " -> Staging resource packs..."
    cp -a "$SERVER_DIR/resource_packs" "$TMP_DIR/"
fi

# Ensure the upload directory exists
mkdir -p "$UPLOAD_DIR"

# Change into the staging directory to create the archive with relative paths
cd "$TMP_DIR"

echo " -> Zipping staged files..."
zip -qr "$EXPORT_FILE" .
rc=$?
if [ $rc -ne 0 ]; then # A successful zip of contents should always be exit code 0
    echo "Error: zip command failed with exit code $rc" >&2
    exit $rc
fi

echo "✅ Export complete!"
echo " -> Saved to $EXPORT_FILE"
