import { NextRequest, NextResponse } from 'next/server';
import { stopContainer } from '@/lib/docker';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // For now, we'll assume the id is the container ID
    // In a real implementation, you might want to look up the server by name
    await stopContainer(id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Server stopped successfully' 
    });
  } catch (error) {
    console.error('Failed to stop server:', error);
    return NextResponse.json(
      { error: `Failed to stop server: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
