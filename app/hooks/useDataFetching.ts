import { useState, useCallback } from 'react';
import { useServersStore } from '@/lib/stores/servers';
import { useWorldsStore } from '@/lib/stores/worlds';

export function useDataFetching() {
  const { setServers, setError: setServersError } = useServersStore();
  const { setWorlds, setError: setWorldsError } = useWorldsStore();
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Fetch servers and worlds in parallel
      const [serversResponse, worldsResponse] = await Promise.all([
        fetch('/api/servers'),
        fetch('/api/worlds')
      ]);

      if (serversResponse.ok) {
        const serversData = await serversResponse.json();
        setServers(serversData);
      } else {
        setServersError('Failed to fetch servers');
      }

      if (worldsResponse.ok) {
        const worldsData = await worldsResponse.json();
        setWorlds(worldsData);
      } else {
        setWorldsError('Failed to fetch worlds');
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setServersError('Failed to connect to server');
      setWorldsError('Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  }, [setServers, setServersError, setWorlds, setWorldsError]);

  return { fetchData, isLoading };
}
