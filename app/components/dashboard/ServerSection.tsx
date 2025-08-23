'use client';

import { useState } from 'react';
import { useServersStore } from '@/lib/stores/servers';

interface ServerSectionProps {
  onStartServer: (serverId: string) => Promise<void>;
  onStopServer: (serverId: string) => Promise<void>;
}

export default function ServerSection({ onStartServer, onStopServer }: ServerSectionProps) {
  const { servers } = useServersStore();
  const [showCreateServer, setShowCreateServer] = useState(false);

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
        // Refresh will be handled by parent component
        window.location.reload(); // Temporary - should use proper state management
      } else {
        console.error('Failed to create server');
      }
    } catch (error) {
      console.error('Error creating server:', error);
    }
  };

  return (
    <>
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
                          onClick={() => onStopServer(server.id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg transition-colors"
                        >
                          Stop
                        </button>
                      ) : (
                        <button
                          onClick={() => onStartServer(server.id)}
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
    </>
  );
}
