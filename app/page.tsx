'use client';

import { useEffect, useState } from 'react';
import { useServersStore } from '@/lib/stores/servers';
import { useWorldsStore } from '@/lib/stores/worlds';

export default function Dashboard() {
  const { servers, error: serversError, setServers, setError: setServersError } = useServersStore();
  const { worlds, error: worldsError, setWorlds, setError: setWorldsError } = useWorldsStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateServer, setShowCreateServer] = useState(false);
  const [showImportWorld, setShowImportWorld] = useState(false);
  const [importingWorld, setImportingWorld] = useState(false);
  const [exportingWorld, setExportingWorld] = useState<string | null>(null);

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

  const handleStartServer = async (serverId: string) => {
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
  };

  const handleStopServer = async (serverId: string) => {
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
  };

  const handleCreateServer = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const serverName = formData.get('serverName') as string;
    const port = parseInt(formData.get('port') as string);

    try {
      const response = await fetch('/api/servers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: serverName, port })
      });

      if (response.ok) {
        setShowCreateServer(false);
        // Refresh data to show new server
        setTimeout(fetchData, 2000); // Wait a bit for container to start
      } else {
        console.error('Failed to create server');
      }
    } catch (error) {
      console.error('Error creating server:', error);
    }
  };

  const handleImportWorld = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const worldName = formData.get('worldName') as string;
    const mcworldFile = (formData.get('mcworldFile') as File);

    if (!mcworldFile) {
      console.error('No file selected');
      return;
    }

    setImportingWorld(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('worldName', worldName);
      uploadFormData.append('mcworldFile', mcworldFile);

      const response = await fetch('/api/worlds/import', {
        method: 'POST',
        body: uploadFormData
      });

      if (response.ok) {
        setShowImportWorld(false);
        // Refresh data to show new world
        setTimeout(fetchData, 2000); // Wait a bit for import to complete
      } else {
        const errorData = await response.json();
        console.error('Failed to import world:', errorData.error);
        alert(`Failed to import world: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error importing world:', error);
      alert('Error importing world. Please try again.');
    } finally {
      setImportingWorld(false);
    }
  };

  const handleExportWorld = async (worldId: string, worldName: string) => {
    setExportingWorld(worldId);
    try {
      const response = await fetch(`/api/worlds/${worldId}/export`);
      if (response.ok) {
        // Create a download link for the exported file
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${worldName}.mcworld`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const errorData = await response.json();
        console.error('Failed to export world:', errorData.error);
        alert(`Failed to export world: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error exporting world:', error);
      alert('Error exporting world. Please try again.');
    } finally {
      setExportingWorld(null);
    }
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
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <svg className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                  <h2 className="text-lg font-medium text-white">Servers</h2>
                </div>
                <button
                  onClick={() => setShowCreateServer(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-lg transition-colors flex items-center space-x-2"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Create Server</span>
                </button>
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
                          
                          {/* Server Control Buttons */}
                          {server.status === 'running' ? (
                            <button
                              onClick={() => handleStopServer(server.id)}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg transition-colors"
                            >
                              Stop
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartServer(server.id)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-lg transition-colors"
                            >
                              Start
                            </button>
                          )}
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
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h2 className="text-lg font-medium text-white">Worlds</h2>
                </div>
                <button
                  onClick={() => setShowImportWorld(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center space-x-2"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  <span>Import World</span>
                </button>
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
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleExportWorld(world.id, world.name)}
                            disabled={exportingWorld === world.id}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {exportingWorld === world.id ? (
                              <div className="flex items-center space-x-1">
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                <span>Exporting...</span>
                              </div>
                            ) : (
                              <>
                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>Export</span>
                              </>
                            )}
                          </button>
                          
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
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Server Modal */}
      {showCreateServer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Create New Server</h3>
              <button
                onClick={() => setShowCreateServer(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateServer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Server Name</label>
                <input
                  type="text"
                  name="serverName"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter server name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Port</label>
                <input
                  type="number"
                  name="port"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="19132"
                  min="19132"
                  max="19200"
                  required
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateServer(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                >
                  Create Server
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import World Modal */}
      {showImportWorld && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Import World</h3>
              <button
                onClick={() => setShowImportWorld(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleImportWorld} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">World Name</label>
                <input
                  type="text"
                  name="worldName"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter world name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Upload .mcworld File</label>
                <input
                  type="file"
                  name="mcworldFile"
                  accept=".mcworld"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Select a .mcworld file to import</p>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowImportWorld(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={importingWorld}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {importingWorld ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Importing...</span>
                    </div>
                  ) : (
                    'Import World'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
