# Minecraft Bedrock Server Management

## Overview

This repository contains scripts to manage Minecraft Bedrock servers using Docker. The core idea is to simplify the process of converting a `.mcworld` file into a runnable server directory, and vice-versa.

Server data is stored locally in `/srv/minecraft/bedrock/servers/` and is intended to be mounted into an `itzg/minecraft-bedrock-server` Docker container.

## Directory Structure
```
/srv/minecraft/
├── bedrock/
│   └── servers/           # Root for all server data directories
│       └── mythvale/      # Example server directory
├── upload/                # Location for .mcworld files
├── import_mcworld.sh      # Script to create a server from a .mcworld file
└── export_mcworld.sh      # Script to package a server into a .mcworld file
```

## Usage

These two scripts are designed to be complementary operations: one unpacks a world archive into a server directory, and the other packages a server directory back into a world archive.

### Importing a World (`import_mcworld.sh`)

This script unpacks a `.mcworld` file and creates a new, ready-to-use server data directory.

> **Note:** The script preserves the existing `world_behavior_packs.json` and `world_resource_packs.json` files from your `.mcworld` archive. These files are required for the server to recognize and load your custom behavior and resource packs.

**Steps:**

1.  Place your `.mcworld` file in the `upload/` directory (or any other accessible location).
2.  Run the import script with a new server name and the path to your file.

    ```bash
    ./import_mcworld.sh <new_server_name> <path_to_mcworld_file>
    ```

    **Example:**
    ```bash
    ./import_mcworld.sh mythvale-v2 upload/Mythvale.mcworld
    ```
3.  The script will create a new directory at `bedrock/servers/mythvale-v2`.
4.  It will also output the `docker run` command you need to start the new server. You can adapt these parameters for use in Portainer, Docker Compose, or another management tool.

    > **Safety Check:** The script will fail if a server directory with the same name already exists, preventing you from accidentally overwriting server data.

### Exporting a World (`export_mcworld.sh`)

This script packages an existing server data directory into a single `.mcworld` file, placing it in the `upload/` directory. This is useful for backups or for sharing the world.

**Steps:**

1.  **IMPORTANT:** Stop the Docker container for the server you wish to export. Exporting a running server can lead to a corrupt world file.
2.  Run the export script with the name of the server directory.

    ```bash
    ./export_mcworld.sh <server_name>
    ```

    **Example:**
    ```bash
    ./export_mcworld.sh mythvale
    ```
3.  The script will create a new archive at `upload/mythvale.mcworld`.

## Running the Server with Docker

After using `import_mcworld.sh` to create a server directory, you can start the server with Docker. The command below serves as a template; you must replace the placeholder values (`<...>`) with the correct names for your server.

After a successful import, the script will print the exact `SERVER_NAME` and `LEVEL_NAME` parameters for you to use in the command template below.

**Command Template:**
```bash
docker run -d \\
  --name "minecraft-<server_name>" \\
  -p 19132:19132/udp \\
  -v "/srv/minecraft/bedrock/servers/<server_name>:/data" \\
  -e EULA=TRUE \\
  -e SERVER_NAME="<server_name>" \\
  -e LEVEL_NAME="<level_name>" \\
  itzg/minecraft-bedrock-server
```

### Command Breakdown

-   `docker run -d`: Runs the container in detached mode (in the background).
-   `--name "minecraft-<server_name>"`: Assigns a unique, memorable name to your container. Replace `<server_name>` with the name you chose during import (e.g., `mythvale-v2`).
-   `-p 19132:19132/udp`: Maps the standard Bedrock Server port from the container to your host machine, making it accessible on your network.
-   `-v "/srv/minecraft/bedrock/servers/<server_name>:/data"`: **This is the most critical part.** It mounts your server's data directory (which you created with the import script) into the container.
-   `-e EULA=TRUE`: You must accept the Minecraft End User License Agreement.
-   `-e SERVER_NAME="<server_name>"`: Sets the name that appears in the in-game server list.
-   `-e LEVEL_NAME="<level_name>"`: Tells the server which world folder to load. This **must** match the name found in the `levelname.txt` file.
-   `itzg/minecraft-bedrock-server`: The excellent, widely-used Docker image that runs the server.

## Managing Server Containers

The scripts in this repository only handle file management. The actual running of the server is handled by Docker.

-   **To start or stop** a server, use standard Docker commands or a management UI like Portainer.
-   **To view logs** or access the server console, use `docker logs <container_name>` or the equivalent in your management UI.

## Server Configuration

-   The server's `server.properties`, `permissions.json`, and `allowlist.json` files are stored within its data directory (e.g., `bedrock/servers/<server_name>/`).
-   Because the directory is mounted into the container as a volume, any changes you make to these files will persist across container restarts.
