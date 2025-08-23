import { useCallback } from 'react';

export function useServerActions(fetchData: () => Promise<void>) {
  const handleStartServer = useCallback(async (serverId: string) => {
    try {
      const response = await fetch(`/api/servers/${serverId}/start`, { method: 'POST' });
      if (response.ok) {
        // Refresh data to show updated status
        setTimeout(fetchData, 1000); // Wait a bit for container to start
      } else {
        console.error('Failed to start server');
      }
    } catch (error) {
      console.error('Error starting server:', error);
    }
  }, [fetchData]);

  const handleStopServer = useCallback(async (serverId: string) => {
    try {
      const response = await fetch(`/api/servers/${serverId}/stop`, { method: 'POST' });
      if (response.ok) {
        // Refresh data to show updated status
        setTimeout(fetchData, 1000); // Wait a bit for container to stop
      } else {
        console.error('Failed to stop server');
      }
    } catch (error) {
      console.error('Error stopping server:', error);
    }
  }, [fetchData]);

  return { handleStartServer, handleStopServer };
}
