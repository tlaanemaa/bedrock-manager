import Docker from 'dockerode';
import { DOCKER, SERVER } from './constants';

const docker = new Docker();

export interface ContainerInfo {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'starting' | 'stopping';
  image: string;
  ports: string[];
  mounts: string[];
  created: Date;
}

export interface ServerStatus {
  id: string;
  name: string;
  status: 'running' | 'stopped';
  port: number;
  world?: string;
  containerId: string;
}

/**
 * Get all running Minecraft containers
 */
export async function getMinecraftContainers(): Promise<ContainerInfo[]> {
  try {
    const containers = await docker.listContainers({ all: true });
    
    return containers
      .filter(container => 
        container.Image?.includes(DOCKER.IMAGE) ||
        container.Names?.some(name => name.includes(DOCKER.CONTAINER_PREFIX))
      )
      .map(container => ({
        id: container.Id,
        name: container.Names?.[0]?.replace(`/${DOCKER.CONTAINER_PREFIX}`, '') || 'unknown',
        status: getContainerStatus(container.State),
        image: container.Image || 'unknown',
        ports: container.Ports?.map(p => `${p.PrivatePort}:${p.PublicPort}`) || [],
        mounts: container.Mounts?.map(m => m.Source) || [],
        created: new Date(container.Created * 1000)
      }));
  } catch (error) {
    console.error('Failed to get Docker containers:', error);
    throw new Error('Failed to connect to Docker daemon');
  }
}

/**
 * Get container status
 */
function getContainerStatus(state: string): 'running' | 'stopped' | 'starting' | 'stopping' {
  switch (state) {
    case 'running': return 'running';
    case 'created':
    case 'restarting': return 'starting';
    case 'exited':
    case 'dead': return 'stopped';
    default: return 'stopped';
  }
}

/**
 * Start a container
 */
export async function startContainer(containerId: string): Promise<void> {
  try {
    const container = docker.getContainer(containerId);
    await container.start();
  } catch (error) {
    console.error('Failed to start container:', error);
    throw new Error('Failed to start container');
  }
}

/**
 * Stop a container
 */
export async function stopContainer(containerId: string): Promise<void> {
  try {
    const container = docker.getContainer(containerId);
    await container.stop();
  } catch (error) {
    console.error('Failed to stop container:', error);
    throw new Error('Failed to stop container');
  }
}

/**
 * Create a new Minecraft server container
 */
export async function createServerContainer(
  name: string, 
  port: number, 
  worldPath?: string
): Promise<string> {
  try {
    const containerName = `${DOCKER.CONTAINER_PREFIX}${name}`;
    
    const createOptions = {
      Image: DOCKER.IMAGE,
      name: containerName,
      Env: [
        SERVER.EULA,
        `SERVER_NAME=${name}`,
        `GAMEMODE=${SERVER.DEFAULT_GAMEMODE}`,
        `DIFFICULTY=${SERVER.DEFAULT_DIFFICULTY}`,
        `MAX_PLAYERS=${SERVER.DEFAULT_MAX_PLAYERS}`
      ],
      ExposedPorts: { [`${DOCKER.DEFAULT_PORT}/udp`]: {} },
      HostConfig: {
        PortBindings: {
          [`${DOCKER.DEFAULT_PORT}/udp`]: [{ HostPort: port.toString() }]
        },
        RestartPolicy: { Name: DOCKER.RESTART_POLICY }
      }
    } as Docker.ContainerCreateOptions;

    // Mount world if provided
    if (worldPath) {
      (createOptions.HostConfig as Docker.HostConfig).Binds = [`${worldPath}:/data`];
      (createOptions.Env as string[]).push(`LEVEL_NAME=${name}`);
    }

    const container = await docker.createContainer(createOptions);
    await container.start();
    
    return container.id;
  } catch (error) {
    console.error('Failed to create container:', error);
    throw new Error('Failed to create server container');
  }
}

/**
 * Get available ports (simple port conflict detection)
 */
export async function getAvailablePorts(): Promise<number[]> {
  const containers = await getMinecraftContainers();
  const usedPorts = new Set<number>();
  
  containers.forEach(container => {
    container.ports.forEach(portMapping => {
      const publicPort = parseInt(portMapping.split(':')[1]);
      if (!isNaN(publicPort)) {
        usedPorts.add(publicPort);
      }
    });
  });

      const availablePorts: number[] = [];
    for (let port = DOCKER.PORT_RANGE.START; port < DOCKER.PORT_RANGE.END; port++) {
      if (!usedPorts.has(port)) {
        availablePorts.push(port);
      }
    }

  return availablePorts;
}
