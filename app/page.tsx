'use client';

import { useEffect, useState } from 'react';
import { useServersStore } from '@/lib/stores/servers';
import { useWorldsStore } from '@/lib/stores/worlds';

export default function Dashboard() {
  const { servers, error: serversError, setServers, setError: setServersError } = useServersStore();
  const { worlds, error: worldsError, setWorlds, setError: setWorldsError } = useWorldsStore();
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchData = async () => {
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
  };

  const handleRefresh = () => {
    fetchData();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bedrock Manager</h1>
          <p className="mt-2 text-gray-600">Manage your Minecraft Bedrock servers and worlds</p>
        </div>

        {/* Error Display */}
        {(serversError || worldsError) && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  {serversError && <p>{serversError}</p>}
                  {worldsError && <p>{worldsError}</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Refresh Button */}
        <div className="mb-6">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Servers Section */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Servers</h2>
              <p className="text-sm text-gray-500">{servers.length} server(s)</p>
            </div>
            <div className="p-6">
              {servers.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No servers found</p>
              ) : (
                <div className="space-y-4">
                  {servers.map((server) => (
                    <div key={server.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{server.name}</h3>
                          <p className="text-sm text-gray-500">
                            Port: {server.port || 'N/A'} • World: {server.world || 'None'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            server.status === 'running' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {server.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Worlds Section */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Worlds</h2>
              <p className="text-sm text-gray-500">{worlds.length} world(s)</p>
            </div>
            <div className="p-6">
              {worlds.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No worlds found</p>
              ) : (
                <div className="space-y-4">
                  {worlds.map((world) => (
                    <div key={world.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{world.name}</h3>
                          <p className="text-sm text-gray-500">
                            Server: {world.serverMount} • Addons: {world.addons.length}
                          </p>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(world.lastModified).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
