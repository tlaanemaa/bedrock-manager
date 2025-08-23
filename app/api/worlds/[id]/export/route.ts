import { NextRequest, NextResponse } from 'next/server';
import { getAllWorlds } from '@/lib/filesystem';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Get the world information
    const worlds = await getAllWorlds();
    const world = worlds.find(w => w.id === id);
    
    if (!world) {
      return NextResponse.json(
        { error: 'World not found' },
        { status: 404 }
      );
    }

    // For now, we'll return a placeholder response
    // In the next iteration, we'll implement the actual .mcworld file creation
    // This will involve:
    // 1. Reading the world directory
    // 2. Creating a temporary zip file
    // 3. Structuring it according to .mcworld format
    // 4. Streaming the file back to the client

    return NextResponse.json({ 
      message: 'Export functionality will be implemented in the next iteration',
      world: world.name
    });
  } catch (error) {
    console.error('Failed to export world:', error);
    return NextResponse.json(
      { error: 'Failed to export world' },
      { status: 500 }
    );
  }
}
