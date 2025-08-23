import { NextRequest, NextResponse } from 'next/server';
import { getAllWorlds, createServerMount } from '@/lib/filesystem';

export async function GET() {
  try {
    const worlds = await getAllWorlds();
    return NextResponse.json(worlds);
  } catch (error) {
    console.error('Failed to get worlds:', error);
    return NextResponse.json(
      { error: 'Failed to get worlds' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }
    
    await createServerMount(name);
    
    return NextResponse.json({ 
      success: true, 
      message: `World ${name} created successfully`
    });
  } catch (error) {
    console.error('Failed to create world:', error);
    return NextResponse.json(
      { error: 'Failed to create world' },
      { status: 500 }
    );
  }
}
