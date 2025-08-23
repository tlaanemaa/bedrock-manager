import { NextRequest, NextResponse } from 'next/server';
import { createServerMount } from '@/lib/filesystem';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const worldName = formData.get('worldName') as string;
    const mcworldFile = formData.get('mcworldFile') as File;

    if (!worldName || !mcworldFile) {
      return NextResponse.json(
        { error: 'World name and file are required' },
        { status: 400 }
      );
    }

    // Validate world name
    if (!/^[A-Za-z0-9._-]+$/.test(worldName)) {
      return NextResponse.json(
        { error: 'Invalid world name. Use only letters, numbers, dots, underscores, or hyphens.' },
        { status: 400 }
      );
    }

    // Create server mount directory
    await createServerMount(worldName);

    // For now, we'll just create the directory structure
    // In the next iteration, we'll implement the actual .mcworld file processing
    // This will involve:
    // 1. Saving the uploaded file to temp directory
    // 2. Extracting the .mcworld (it's a zip file)
    // 3. Restructuring files according to the import script logic
    // 4. Moving files to the server mount directory

    return NextResponse.json({ 
      success: true, 
      message: `World '${worldName}' created successfully`,
      note: 'File processing will be implemented in the next iteration'
    });
  } catch (error) {
    console.error('Failed to import world:', error);
    return NextResponse.json(
      { error: 'Failed to import world' },
      { status: 500 }
    );
  }
}
