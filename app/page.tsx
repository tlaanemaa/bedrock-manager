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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-lg h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading servers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-600 rounded-lg shadow-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-gray-900 rounded-sm"></div>
            </div>
            <h1 className="text-3xl font-bold text-white">Bedrock Manager</h1>
          </div>
          <p className="text-gray-400">Manage your Minecraft Bedrock servers and worlds with style</p>
        </div>

        {/* Error Display */}
        {(serversError || worldsError) && (
          <div className="mb-6 bg-red-900/50 border border-red-700 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-200">Connection Error</h3>
                <div className="mt-2 text-sm text-red-300">
                  {serversError && <p>{serversError}</p>}
                  {worldsError && <p>{worldsError}</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Refresh Button */}
        <div className="mb-8">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-lg transform transition-transform hover:scale-105"
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Servers Section */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <svg className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
                <h2 className="text-lg font-medium text-white">Servers</h2>
              </div>
              <p className="text-sm text-gray-400 mt-1">{servers.length} server(s) available</p>
            </div>
            <div className="p-6">
              {servers.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                    <svg className="h-8 w-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                    </svg>
                  </div>
                  <p className="text-gray-400">No servers running</p>
                  <p className="text-gray-500 text-sm mt-1">Create your first server to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {servers.map((server) => (
                    <div key={server.id} className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 hover:bg-gray-700/70 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            server.status === 'running' ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50' : 'bg-gray-500'
                          }`}></div>
                          <div>
                            <h3 className="text-sm font-medium text-white">{server.name}</h3>
                            <p className="text-sm text-gray-400">
                              Port: {server.port || 'N/A'} • World: {server.world || 'None'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            server.status === 'running' 
                              ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700' 
                              : 'bg-gray-600/50 text-gray-300 border border-gray-500'
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
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-lg font-medium text-white">Worlds</h2>
              </div>
              <p className="text-sm text-gray-400 mt-1">{worlds.length} world(s) available</p>
            </div>
            <div className="p-6">
              {worlds.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                    <svg className="h-8 w-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-400">No worlds found</p>
                  <p className="text-gray-500 text-sm mt-1">Import a .mcworld file to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {worlds.map((world) => (
                    <div key={world.id} className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 hover:bg-gray-700/70 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                            <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                              <div className="bg-white/80 rounded-sm"></div>
                              <div className="bg-white/60 rounded-sm"></div>
                              <div className="bg-white/60 rounded-sm"></div>
                              <div className="bg-white/40 rounded-sm"></div>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-white">{world.name}</h3>
                            <p className="text-sm text-gray-400">
                              Server: {world.serverMount} • {world.addons.length} addon(s)
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-400">
                            {new Date(world.lastModified).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {(world.size / 1024 / 1024).toFixed(1)} MB
                          </div>
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
