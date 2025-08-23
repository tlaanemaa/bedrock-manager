import { NextRequest, NextResponse } from 'next/server';
import { getMinecraftContainers } from '@/lib/docker';
import { getServerMounts } from '@/lib/filesystem';

export async function GET() {
  try {
    // Get running containers
    const containers = await getMinecraftContainers();
    
    // Get server mount directories
    const serverMounts = await getServerMounts();
    
    // Combine container info with server mount info
    const servers = containers.map(container => {
      const world = serverMounts.find(mount => 
        container.mounts.some(mountPath => mountPath.includes(mount))
      );
      
      return {
        id: container.id,
        name: container.name,
        status: container.status,
        port: (() => {
          const portString = container.ports[0];
          if (!portString) return 0;
          const parts = portString.split(':');
          const publicPort = parts[1];
          return publicPort ? parseInt(publicPort, 10) : 0;
        })(),
        world: world || undefined,
        containerId: container.id
      };
    });
    
    // Add server mounts that don't have running containers
    for (const mount of serverMounts) {
      const hasContainer = servers.some(server => server.world === mount);
      if (!hasContainer) {
        servers.push({
          id: `mount-${mount}`,
          name: mount,
          status: 'stopped' as const,
          port: 0,
          world: mount,
          containerId: ''
        });
      }
    }
    
    return NextResponse.json(servers);
  } catch (error) {
    console.error('Failed to get servers:', error);
    return NextResponse.json(
      { error: `Failed to get servers: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, port, worldPath } = await request.json();
    
    if (!name || !port) {
      return NextResponse.json(
        { error: 'Name and port are required' },
        { status: 400 }
      );
    }

    // Validate port range
    if (port < 19132 || port > 19200) {
      return NextResponse.json(
        { error: 'Port must be between 19132 and 19200' },
        { status: 400 }
      );
    }

    // Check if port is already in use
    const { getAvailablePorts } = await import('@/lib/docker');
    const availablePorts = await getAvailablePorts();
    if (!availablePorts.includes(port)) {
      return NextResponse.json(
        { error: `Port ${port} is already in use. Available ports: ${availablePorts.slice(0, 5).join(', ')}${availablePorts.length > 5 ? '...' : ''}` },
        { status: 400 }
      );
    }
    
    // Import the createServerContainer function
    const { createServerContainer } = await import('@/lib/docker');
    
    const containerId = await createServerContainer(name, port, worldPath);
    
    return NextResponse.json({ 
      success: true, 
      containerId,
      message: `Server ${name} created successfully`
    });
  } catch (error) {
    console.error('Failed to create server:', error);
    return NextResponse.json(
      { error: `Failed to create server: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
