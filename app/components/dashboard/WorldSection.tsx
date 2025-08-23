'use client';

import { useState } from 'react';
import { useWorldsStore } from '@/lib/stores/worlds';

interface WorldSectionProps {
  onExportWorld: (worldId: string, worldName: string) => Promise<void>;
  exportingWorld: string | null;
}

export default function WorldSection({ onExportWorld, exportingWorld }: WorldSectionProps) {
  const { worlds } = useWorldsStore();
  const [showImportWorld, setShowImportWorld] = useState(false);
  const [importingWorld, setImportingWorld] = useState(false);

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
        // Refresh will be handled by parent component
        window.location.reload(); // Temporary - should use proper state management
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

  return (
    <>
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
                        onClick={() => onExportWorld(world.id, world.name)}
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
    </>
  );
}
