/**
 * Health Check Tests
 * 
 * Hit the API, check the response
 */

describe('Health API', () => {
  const baseUrl = 'http://localhost:3000';

  it('should return healthy status', async () => {
    const response = await fetch(`${baseUrl}/api/health`);
    expect(response.ok).toBe(true);
    
    const data = await response.json();
    expect(data.status).toBe('healthy');
    expect(data.version).toBeDefined();
  });

  it('should respond quickly', async () => {
    const startTime = Date.now();
    const response = await fetch(`${baseUrl}/api/health`);
    const responseTime = Date.now() - startTime;
    
    expect(response.ok).toBe(true);
    expect(responseTime).toBeLessThan(3000);
  });
});
