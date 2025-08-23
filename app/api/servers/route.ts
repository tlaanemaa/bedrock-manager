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
        port: parseInt(container.ports[0]?.split(':')[1] || '19132'),
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
      { error: 'Failed to get servers' },
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
      { error: 'Failed to create server' },
      { status: 500 }
    );
  }
}
