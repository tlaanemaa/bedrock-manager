# Bedrock Manager UI Specification

## Overview
A simple web interface for managing your Minecraft Bedrock servers. Create servers, import worlds, manage addons, and control everything from one place. Perfect for running multiple servers with different worlds and configurations.

## Core Principles
- **Simple & Reliable**: Easy to use, always shows current state
- **Localhost Only**: Run it on your own machine, no security concerns
- **Iterative**: Start with basics, add features as you need them

## System Architecture

### Directory Structure
```
/srv/minecraft/bedrock/
servers/
├── server1/
│   ├── worlds/
│   │   └── WorldName/
│   ├── behavior_packs/
│   ├── resource_packs/
│   ├── world_behavior_packs.json
│   └── world_resource_packs.json
├── server2/
└── ...
```

### Container Setup
- Management UI runs in container with `/srv/minecraft/bedrock` mounted
- Each Minecraft server runs as `itzg/minecraft-bedrock-server` with:
  - Server mount directory mounted as `/data` volume (contains world + server state + configs)
  - Or temporary volume if no server mount attached

## Core Features

### 1. Server Management
- **List Servers**: Query Docker for all running containers + scan server mount directories
- **Server Status**: Query Docker for container status
- **Create Server**: Start new Docker container (with or without server mount)
- **Stop Server**: Stop Docker container
- **Attach Server Mount**: Stop server, restart with server mount directory mounted
- **Detach Server Mount**: Stop server, restart with temporary volume
- **Port Management**: Automatic port assignment, detect conflicts, allow manual override

### 2. World Management
- **List Worlds**: Scan server mount directories for world data
- **World Status**: Show which worlds are part of running servers
- **Import .mcworld**: Upload, extract to temp, create new server mount, move files
- **Export .mcworld**: Package world data from server mount for download
- **Create World**: Create new empty server mount with world structure
- **World Validation**: Check for required files (levelname.txt, world_behavior_packs.json, etc.)

### 3. Addon Management
- **List Addons**: Scan world directories for behavior/resource packs
- **Upload .mcaddon**: Extract to temp, add to world, clean up temp
- **Remove Addon**: Remove from world directory

## Technical Implementation

### Architecture
- **Frontend**: Next.js 15 with React 19 and Tailwind CSS
- **Backend**: Next.js API routes with direct file system and Docker API access
- **Frontend State**: Zustand stores for UI state and caching
- **Backend State**: No database, derive all state from system
- **File Operations**: Node.js built-in modules with temp directory usage
- **Docker Integration**: dockerode for direct Docker API access

### Backend API (Next.js)
```typescript
// All endpoints compute state on each request
GET    /api/servers              # Query Docker + scan server mount directories
POST   /api/servers              # Create new server container
POST   /api/servers/:id/stop     # Stop server container
POST   /api/servers/:id/attach   # Restart server with server mount
POST   /api/servers/:id/detach   # Restart server with temp volume

GET    /api/worlds               # Scan server mounts for world data
POST   /api/worlds               # Create new server mount
POST   /api/worlds/import        # Import .mcworld to new server mount
GET    /api/worlds/:id/export    # Export world data from server mount
DELETE /api/worlds/:id           # Delete server mount

GET    /api/addons               # Scan addon directories
POST   /api/addons/upload        # Upload .mcaddon
DELETE /api/addons/:id           # Remove addon
```

### State Derivation Functions
```typescript
// Server status from Docker API
async function getServerStatus(containerId: string): Promise<'running' | 'stopped'>

// World list from file system
async function getWorlds(): Promise<World[]>

// Addon list from world directories
async function getAddons(worldPath: string): Promise<Addon[]>
```

### Data Models (Computed)
```typescript
interface Server {
  id: string;
  name: string;
  status: 'running' | 'stopped';
  mount?: string;        // Currently mounted server mount directory (if any)
  port: number;
  containerId: string;
}

interface World {
  id: string;
  name: string;
  path: string;          // Path within server mount directory
  serverMount: string;   // Which server mount this world belongs to
  addons: string[];
  size: number;
  lastModified: Date;
}

interface Addon {
  name: string;
  type: 'behavior' | 'resource';
  path: string;
}
```

## Implementation Phases

### Phase 1: Basic Infrastructure
- File system scanning functions
- Docker querying functions via dockerode
- Basic server listing and control
- Port management and conflict detection

### Phase 2: World Management
- .mcworld import/export
- World browser interface

### Phase 3: Addon Management
- .mcaddon upload/extract
- Addon management interface

### Phase 4: Polish
- Better error handling
- UI improvements
- Any missing features discovered

## Key Implementation Details

### File Operations
- Use Node.js built-in modules (fs, path, zlib)
- Use system temp directory (`/tmp`) for uploads and extractions
- Direct file system manipulation with proper cleanup
- No shell script execution

### Docker Integration
- Use `dockerode` for direct Docker API access
- Basic container operations (start, stop, inspect, list)
- No complex monitoring

### Error Handling
- Graceful degradation when Docker/files unavailable
- Clear error messages for common issues
- Validation of file paths and server names
- Proper cleanup of temporary files
- Port conflict resolution
- World file validation and repair suggestions
- Docker connection error handling
