import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { getAllWorlds } from '@/lib/filesystem';
import { PATHS } from '@/lib/constants';
import archiver from 'archiver';

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

    // Create temporary directory for export
    const tempDir = path.join(PATHS.UPLOAD_TEMP, `export-${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });

    try {
      // Get the world directory path
      const worldDirPath = path.join(PATHS.SERVERS_ROOT, world.serverMount, 'worlds', world.name);
      
      // Check if world directory exists
      if (!await fs.access(worldDirPath).then(() => true).catch(() => false)) {
        throw new Error('World directory not found');
      }

      // Copy world files to temp directory (excluding packs)
      const worldFiles = await fs.readdir(worldDirPath);
      for (const file of worldFiles) {
        const sourcePath = path.join(worldDirPath, file);
        const destPath = path.join(tempDir, file);
        
        if ((await fs.stat(sourcePath)).isDirectory()) {
          await fs.cp(sourcePath, destPath, { recursive: true });
        } else {
          await fs.copyFile(sourcePath, destPath);
        }
      }

      // Copy behavior packs if they exist
      const behaviorPacksPath = path.join(PATHS.SERVERS_ROOT, world.serverMount, 'behavior_packs');
      if (await fs.access(behaviorPacksPath).then(() => true).catch(() => false)) {
        await fs.cp(behaviorPacksPath, path.join(tempDir, 'behavior_packs'), { recursive: true });
      }

      // Copy resource packs if they exist
      const resourcePacksPath = path.join(PATHS.SERVERS_ROOT, world.serverMount, 'resource_packs');
      if (await fs.access(resourcePacksPath).then(() => true).catch(() => false)) {
        await fs.cp(resourcePacksPath, path.join(tempDir, 'resource_packs'), { recursive: true });
      }

      // Create the .mcworld file (zip archive)
      const archive = archiver('zip', { zlib: { level: 9 } });
      const outputPath = path.join(tempDir, `${world.name}.mcworld`);
      const output = fs.createWriteStream(outputPath);
      
      archive.pipe(output);
      
      // Add all files from temp directory to the archive
      archive.directory(tempDir, false);
      
      // Wait for archive to finish
      await new Promise((resolve, reject) => {
        output.on('close', resolve);
        archive.on('error', reject);
        archive.finalize();
      });

      // Read the generated file and send it as response
      const fileBuffer = await fs.readFile(outputPath);
      
      // Clean up temp files
      await fs.rm(tempDir, { recursive: true, force: true });

      // Return the file as a download
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename="${world.name}.mcworld"`,
          'Content-Length': fileBuffer.length.toString()
        }
      });
    } catch (processingError) {
      // Clean up temp files on error
      try {
        await fs.rm(tempDir, { recursive: true, force: true });
      } catch (cleanupError) {
        console.error('Failed to cleanup temp files:', cleanupError);
      }
      throw processingError;
    }
  } catch (error) {
    console.error('Failed to export world:', error);
    return NextResponse.json(
      { error: 'Failed to export world' },
      { status: 500 }
    );
  }
}
