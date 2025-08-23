'use client';

import { useEffect } from 'react';
import { useServersStore } from '@/lib/stores/servers';
import { useWorldsStore } from '@/lib/stores/worlds';
import { useDataFetching } from './hooks/useDataFetching';
import { useServerActions } from './hooks/useServerActions';
import { useWorldActions } from './hooks/useWorldActions';
import LoadingScreen from './components/ui/LoadingScreen';
import Header from './components/ui/Header';
import ErrorDisplay from './components/ui/ErrorDisplay';
import ServerSection from './components/dashboard/ServerSection';
import WorldSection from './components/dashboard/WorldSection';

export default function Dashboard() {
  const { error: serversError } = useServersStore();
  const { error: worldsError } = useWorldsStore();
  const { fetchData, isLoading } = useDataFetching();
  const { handleStartServer, handleStopServer } = useServerActions(fetchData);
  const { handleExportWorld, exportingWorld } = useWorldActions();

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Header onRefresh={fetchData} />
        <ErrorDisplay serversError={serversError} worldsError={worldsError} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ServerSection 
            onStartServer={handleStartServer}
            onStopServer={handleStopServer}
          />
          <WorldSection 
            onExportWorld={handleExportWorld}
            exportingWorld={exportingWorld}
          />
        </div>
      </div>
    </div>
  );
}