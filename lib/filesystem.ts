import { promises as fs } from 'fs';
import path from 'path';
import { PATHS } from './constants';
import { WorldInfo, AddonInfo } from './types';

/**
 * Get all server mount directories
 */
export async function getServerMounts(): Promise<string[]> {
  try {
    const entries = await fs.readdir(PATHS.SERVERS_ROOT, { withFileTypes: true });
    return entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);
  } catch (error) {
    console.error('Failed to read servers directory:', error);
    return [];
  }
}

/**
 * Get world information from a server mount
 */
export async function getWorldFromServerMount(serverMount: string): Promise<WorldInfo | null> {
  try {
    const serverPath = path.join(PATHS.SERVERS_ROOT, serverMount);
    const worldsPath = path.join(serverPath, 'worlds');
    
    // Check if worlds directory exists
    try {
      await fs.access(worldsPath);
    } catch {
      return null; // No worlds directory
    }

    const worldEntries = await fs.readdir(worldsPath, { withFileTypes: true });
    const worldDirs = worldEntries.filter(entry => entry.isDirectory());
    
    if (worldDirs.length === 0) {
      return null; // No world directories
    }

    // For now, assume one world per server mount
    const worldDir = worldDirs[0];
    const worldPath = path.join(worldsPath, worldDir.name);
    
    const stats = await fs.stat(worldPath);
    const addons = await getAddonsFromWorld(worldPath);
    
    return {
      id: `${serverMount}-${worldDir.name}`,
      name: worldDir.name,
      path: worldPath,
      serverMount,
      addons: addons.map(a => a.name),
      size: stats.size,
      lastModified: stats.mtime
    };
  } catch (error) {
    console.error(`Failed to get world from server mount ${serverMount}:`, error);
    return null;
  }
}

/**
 * Get all worlds across all server mounts
 */
export async function getAllWorlds(): Promise<WorldInfo[]> {
  const serverMounts = await getServerMounts();
  const worlds: WorldInfo[] = [];
  
  for (const mount of serverMounts) {
    const world = await getWorldFromServerMount(mount);
    if (world) {
      worlds.push(world);
    }
  }
  
  return worlds;
}

/**
 * Get addons from a world directory
 */
export async function getAddonsFromWorld(worldPath: string): Promise<AddonInfo[]> {
  const addons: AddonInfo[] = [];
  
  try {
    // Check behavior packs
    const behaviorPacksPath = path.join(worldPath, 'behavior_packs');
    try {
      const behaviorEntries = await fs.readdir(behaviorPacksPath, { withFileTypes: true });
      behaviorEntries
        .filter(entry => entry.isDirectory())
        .forEach(entry => {
          addons.push({
            name: entry.name,
            type: 'behavior',
            path: path.join(behaviorPacksPath, entry.name)
          });
        });
    } catch {
      // No behavior packs directory
    }

    // Check resource packs
    const resourcePacksPath = path.join(worldPath, 'resource_packs');
    try {
      const resourceEntries = await fs.readdir(resourcePacksPath, { withFileTypes: true });
      resourceEntries
        .filter(entry => entry.isDirectory())
        .forEach(entry => {
          addons.push({
            name: entry.name,
            type: 'resource',
            path: path.join(resourcePacksPath, entry.name)
          });
        });
    } catch {
      // No resource packs directory
    }
  } catch (error) {
    console.error('Failed to get addons from world:', error);
  }
  
  return addons;
}

/**
 * Create a new server mount directory
 */
export async function createServerMount(name: string): Promise<void> {
  try {
    const serverPath = path.join(PATHS.SERVERS_ROOT, name);
    await fs.mkdir(serverPath, { recursive: true });
    
    // Create basic directory structure
    await fs.mkdir(path.join(serverPath, 'worlds'), { recursive: true });
    await fs.mkdir(path.join(serverPath, 'behavior_packs'), { recursive: true });
    await fs.mkdir(path.join(serverPath, 'resource_packs'), { recursive: true });
  } catch (error) {
    console.error('Failed to create server mount:', error);
    throw new Error(`Failed to create server mount directory: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Delete a server mount directory
 */
export async function deleteServerMount(name: string): Promise<void> {
  try {
    const serverPath = path.join(PATHS.SERVERS_ROOT, name);
    await fs.rm(serverPath, { recursive: true, force: true });
  } catch (error) {
    console.error('Failed to delete server mount:', error);
    throw new Error(`Failed to delete server mount directory: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check if a server mount exists
 */
export async function serverMountExists(name: string): Promise<boolean> {
  try {
    const serverPath = path.join(PATHS.SERVERS_ROOT, name);
    await fs.access(serverPath);
    return true;
  } catch {
    return false;
  }
}
