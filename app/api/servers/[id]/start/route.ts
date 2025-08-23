import { NextRequest, NextResponse } from 'next/server';
import { startContainer } from '@/lib/docker';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // For now, we'll assume the id is the container ID
    // In a real implementation, you might want to look up the server by name
    await startContainer(id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Server started successfully' 
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    return NextResponse.json(
      { error: 'Failed to start server' },
      { status: 500 }
    );
  }
}
