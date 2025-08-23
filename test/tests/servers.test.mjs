/**
 * Server Management Tests
 * 
 * Hit the API, check the response
 */

describe('Server Management', () => {
  const baseUrl = 'http://localhost:3000';

  describe('GET /api/servers', () => {
    it('should list all servers', async () => {
      const response = await fetch(`${baseUrl}/api/servers`);
      expect(response.ok).toBe(true);
      
      const servers = await response.json();
      expect(Array.isArray(servers)).toBe(true);
    });

    it('should return valid server data structure', async () => {
      const response = await fetch(`${baseUrl}/api/servers`);
      const servers = await response.json();
      
      servers.forEach((server) => {
        expect(server).toHaveProperty('id');
        expect(server).toHaveProperty('name');
        expect(typeof server.id).toBe('string');
        expect(typeof server.name).toBe('string');
      });
    });

    it('should include server status information', async () => {
      const response = await fetch(`${baseUrl}/api/servers`);
      const servers = await response.json();
      
      if (servers.length > 0) {
        const server = servers[0];
        expect(server).toHaveProperty('status');
        expect(typeof server.status).toBe('string');
      }
    });
  });

  describe('Server Operations', () => {
    let testServer;

    beforeAll(async () => {
      // Get a test server for operations
      const response = await fetch(`${baseUrl}/api/servers`);
      const servers = await response.json();
      
      if (servers.length > 0) {
        testServer = servers[0];
      }
    });

    it('should be able to start a server', async () => {
      if (!testServer) {
        console.log('No test server available, skipping start test');
        return;
      }

      // Only test start if server is not running
      if (testServer.status !== 'running') {
        const startResponse = await fetch(`${baseUrl}/api/servers/${testServer.id}/start`, {
          method: 'POST'
        });
        
        expect(startResponse.ok).toBe(true);
      }
    });

    it('should be able to stop a server', async () => {
      if (!testServer) {
        console.log('No test server available, skipping stop test');
        return;
      }

      const stopResponse = await fetch(`${baseUrl}/api/servers/${testServer.id}/stop`, {
        method: 'POST'
      });
      
      expect(stopResponse.ok).toBe(true);
    });
  });
});
