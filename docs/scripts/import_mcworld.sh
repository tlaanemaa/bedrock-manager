#!/bin/bash
set -eo pipefail

# --- Configuration ---
SERVERS_ROOT="/srv/minecraft/bedrock/servers"

# --- Main Logic ---
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <server_name> <path_to_mcworld_file>"
    echo "Example: $0 mythvale upload/Mythvale.mcworld"
    exit 1
fi

SERVER_NAME="$1"
MCWORLD_FILE="$2"

# CRITICAL: Validate server name to prevent directory traversal or accidental deletion.
if [[ -z "$SERVER_NAME" ]] || ! [[ "$SERVER_NAME" =~ ^[A-Za-z0-9._-]+$ ]]; then
    echo "Error: Invalid server name." >&2
    echo "Name must not be empty and can only contain letters, numbers, dots, underscores, or hyphens." >&2
    exit 1
fi

SERVER_DIR="$SERVERS_ROOT/$SERVER_NAME"

if [ ! -f "$MCWORLD_FILE" ]; then
    echo "Error: Input file not found: $MCWORLD_FILE" >&2
    exit 1
fi

if [ -d "$SERVER_DIR" ]; then
    echo "Error: Server directory '$SERVER_DIR' already exists." >&2
    echo "Please remove it manually before importing a new world." >&2
    exit 1
fi

echo "Importing '$MCWORLD_FILE' to server '$SERVER_NAME'..."

# 1. Unpack to a temporary directory
TMP_DIR=$(mktemp -d)
trap 'rm -rf "$TMP_DIR"' EXIT
unzip -q "$MCWORLD_FILE" -d "$TMP_DIR"

# 2. Prepare the final server directory
mkdir -p "$SERVER_DIR"

# 3. Restructure files for the itzg container
echo " -> Reorganizing files for server..."
if [ ! -f "$TMP_DIR/levelname.txt" ]; then
    echo "Error: 'levelname.txt' not found in the .mcworld file. This format is not supported." >&2
    exit 1
fi

LEVEL_NAME=$(cat "$TMP_DIR/levelname.txt")
LEVEL_NAME_DIR=$(echo "$LEVEL_NAME" | sed 's/[^a-zA-Z0-9_-]//g')

if [[ -z "$LEVEL_NAME_DIR" ]]; then
    echo "Error: The level name '$LEVEL_NAME' resulted in an empty directory name after sanitization." >&2
    echo "Please edit 'levelname.txt' in the .mcworld archive to have valid characters (letters, numbers, underscore, hyphen)." >&2
    exit 1
fi

mkdir -p "$SERVER_DIR/worlds/$LEVEL_NAME_DIR"

# Move world files into the nested world directory
find "$TMP_DIR" -maxdepth 1 -mindepth 1 \
    -not -name "behavior_packs" \
    -not -name "resource_packs" \
    -exec mv -t "$SERVER_DIR/worlds/$LEVEL_NAME_DIR/" {} +

# CRITICAL: The itzg/docker-minecraft-bedrock-server expects the pack manifests
# in the world folder, but the vanilla game exports them outside the world folder.
# We must move them into the world folder for the server to find them.
if [ -f "$TMP_DIR/world_behavior_packs.json" ]; then
    mv "$TMP_DIR/world_behavior_packs.json" "$SERVER_DIR/worlds/$LEVEL_NAME_DIR/"
fi
if [ -f "$TMP_DIR/world_resource_packs.json" ]; then
    mv "$TMP_DIR/world_resource_packs.json" "$SERVER_DIR/worlds/$LEVEL_NAME_DIR/"
fi

# Move packs to the top-level server directory
if [ -d "$TMP_DIR/behavior_packs" ]; then mv "$TMP_DIR/behavior_packs" "$SERVER_DIR/"; fi
if [ -d "$TMP_DIR/resource_packs" ]; then mv "$TMP_DIR/resource_packs" "$SERVER_DIR/"; fi

# 4. Validate that the required pack manifest files are present.
echo " -> Validating pack manifest files..."
WORLD_PATH="$SERVER_DIR/worlds/$LEVEL_NAME_DIR"
BEHAVIOR_PACKS_FILE="$WORLD_PATH/world_behavior_packs.json"
RESOURCE_PACKS_FILE="$WORLD_PATH/world_resource_packs.json"

if [ ! -f "$BEHAVIOR_PACKS_FILE" ]; then
    echo "Error: Behavior pack manifest 'world_behavior_packs.json' not found in the world's root." >&2
    echo "The .mcworld file may be corrupt or was not exported correctly." >&2
    exit 1
fi

if [ ! -f "$RESOURCE_PACKS_FILE" ]; then
    echo "Error: Resource pack manifest 'world_resource_packs.json' not found in the world's root." >&2
    echo "The .mcworld file may be corrupt or was not exported correctly." >&2
    exit 1
fi


echo ""
echo "✅ Import complete!"
echo "The server '$SERVER_NAME' is ready in directory '$SERVER_DIR'."
echo ""
echo "--- To start your server, run the following command ---"
echo "docker run -d \\
  --name \"minecraft-${SERVER_NAME}\" \\
  -p 19132:19132/udp \\
  -v \"${SERVERS_ROOT}/${SERVER_NAME}:/data\" \\
  -e EULA=TRUE \\
  -e SERVER_NAME=\"${SERVER_NAME}\" \\
  -e LEVEL_NAME=\"${LEVEL_NAME}\" \\
  itzg/minecraft-bedrock-server"
