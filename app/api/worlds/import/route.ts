import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { createServerMount } from '@/lib/filesystem';
import { PATHS } from '@/lib/constants';

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

    // Create temporary directories for processing
    const tempDir = path.join(PATHS.UPLOAD_TEMP, `mcworld-${Date.now()}`);
    const extractDir = path.join(tempDir, 'extracted');
    
    try {
      // Create temp directories
      await fs.mkdir(tempDir, { recursive: true });
      await fs.mkdir(extractDir, { recursive: true });

      // Save uploaded file to temp directory
      const tempFilePath = path.join(tempDir, 'world.mcworld');
      const fileBuffer = Buffer.from(await mcworldFile.arrayBuffer());
      await fs.writeFile(tempFilePath, fileBuffer);

      // Extract the .mcworld file (it's a zip file)
      const { default: extract } = await import('extract-zip');
      await extract(tempFilePath, { dir: extractDir });

      // Validate that this is a valid .mcworld file
      const levelnamePath = path.join(extractDir, 'levelname.txt');
      if (!await fs.access(levelnamePath).then(() => true).catch(() => false)) {
        throw new Error('Invalid .mcworld file: levelname.txt not found');
      }

      // Read the actual level name from the file
      const actualLevelName = (await fs.readFile(levelnamePath, 'utf8')).trim();
      
      // Create the world directory structure
      const serverPath = path.join(PATHS.SERVERS_ROOT, worldName);
      const worldsPath = path.join(serverPath, 'worlds');
      const worldDirPath = path.join(worldsPath, actualLevelName);
      
      await fs.mkdir(worldDirPath, { recursive: true });

      // Move world files to the world directory
      const worldFiles = await fs.readdir(extractDir);
      for (const file of worldFiles) {
        if (file !== 'behavior_packs' && file !== 'resource_packs') {
          const sourcePath = path.join(extractDir, file);
          const destPath = path.join(worldDirPath, file);
          
          if ((await fs.stat(sourcePath)).isDirectory()) {
            await fs.cp(sourcePath, destPath, { recursive: true });
          } else {
            await fs.copyFile(sourcePath, destPath);
          }
        }
      }

      // Move pack manifests to the world directory (required by itzg container)
      const worldBehaviorPacksPath = path.join(extractDir, 'world_behavior_packs.json');
      const worldResourcePacksPath = path.join(extractDir, 'world_resource_packs.json');
      
      if (await fs.access(worldBehaviorPacksPath).then(() => true).catch(() => false)) {
        await fs.copyFile(worldBehaviorPacksPath, path.join(worldDirPath, 'world_behavior_packs.json'));
      }
      
      if (await fs.access(worldResourcePacksPath).then(() => true).catch(() => false)) {
        await fs.copyFile(worldResourcePacksPath, path.join(worldDirPath, 'world_resource_packs.json'));
      }

      // Move packs to the server directory
      const behaviorPacksPath = path.join(extractDir, 'behavior_packs');
      const resourcePacksPath = path.join(extractDir, 'resource_packs');
      
      if (await fs.access(behaviorPacksPath).then(() => true).catch(() => false)) {
        await fs.cp(behaviorPacksPath, path.join(serverPath, 'behavior_packs'), { recursive: true });
      }
      
      if (await fs.access(resourcePacksPath).then(() => true).catch(() => false)) {
        await fs.cp(resourcePacksPath, path.join(serverPath, 'resource_packs'), { recursive: true });
      }

      // Clean up temp files
      await fs.rm(tempDir, { recursive: true, force: true });

      return NextResponse.json({ 
        success: true, 
        message: `World '${worldName}' imported successfully`,
        levelName: actualLevelName
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
    console.error('Failed to import world:', error);
    return NextResponse.json(
      { error: `Failed to import world: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
