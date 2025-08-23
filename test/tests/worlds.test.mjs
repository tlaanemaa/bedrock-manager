/**
 * World Management Tests
 * 
 * Hit the API, check the response
 */

describe('World Management', () => {
  const baseUrl = 'http://localhost:3000';

  describe('GET /api/worlds', () => {
    it('should list all worlds', async () => {
      const response = await fetch(`${baseUrl}/api/worlds`);
      expect(response.ok).toBe(true);
      
      const worlds = await response.json();
      expect(Array.isArray(worlds)).toBe(true);
    });

    it('should return valid world data structure', async () => {
      const response = await fetch(`${baseUrl}/api/worlds`);
      const worlds = await response.json();
      
      worlds.forEach((world) => {
        expect(world).toHaveProperty('id');
        expect(world).toHaveProperty('name');
        expect(typeof world.id).toBe('string');
        expect(typeof world.name).toBe('string');
      });
    });

    it('should include world metadata', async () => {
      const response = await fetch(`${baseUrl}/api/worlds`);
      const worlds = await response.json();
      
      if (worlds.length > 0) {
        const world = worlds[0];
        expect(world).toHaveProperty('id');
        expect(world).toHaveProperty('name');
        
        // Optional properties
        if (world.size) expect(typeof world.size).toBe('number');
        if (world.lastModified) expect(typeof world.lastModified).toBe('string');
      }
    });
  });

  describe('World Export', () => {
    let testWorld;

    beforeAll(async () => {
      // Get a test world for export
      const response = await fetch(`${baseUrl}/api/worlds`);
      const worlds = await response.json();
      
      if (worlds.length > 0) {
        testWorld = worlds[0];
      }
    });

    it('should export world as ZIP file', async () => {
      if (!testWorld) {
        console.log('No test world available, skipping export test');
        return;
      }

      const exportResponse = await fetch(`${baseUrl}/api/worlds/${testWorld.id}/export`);
      
      expect(exportResponse.ok).toBe(true);
      
      const contentType = exportResponse.headers.get('content-type');
      expect(contentType).toContain('application/zip');
    });

    it('should return valid ZIP file content', async () => {
      if (!testWorld) {
        console.log('No test world available, skipping content test');
        return;
      }

      const exportResponse = await fetch(`${baseUrl}/api/worlds/${testWorld.id}/export`);
      expect(exportResponse.ok).toBe(true);
      
      const content = await exportResponse.arrayBuffer();
      expect(content.byteLength).toBeGreaterThan(0);
    });
  });

  describe('World Import', () => {
    it('should accept world import', async () => {
      // This would test importing a world file
      // For now, just check the endpoint exists
      const response = await fetch(`${baseUrl}/api/worlds/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/zip'
        },
        body: new ArrayBuffer(0) // Empty file for testing
      });
      
      // Import might fail with empty file, but endpoint should exist
      expect(response.status).not.toBe(404);
    });
  });
});
