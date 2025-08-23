import { create } from 'zustand';
import { ServerStatus } from '../docker';

interface ServersState {
  servers: ServerStatus[];
  loading: boolean;
  error: string | null;
  
  // Actions
  setServers: (servers: ServerStatus[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addServer: (server: ServerStatus) => void;
  updateServer: (id: string, updates: Partial<ServerStatus>) => void;
  removeServer: (id: string) => void;
  clearError: () => void;
}

export const useServersStore = create<ServersState>((set) => ({
  servers: [],
  loading: false,
  error: null,

  setServers: (servers) => set({ servers }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  addServer: (server) => set((state) => ({
    servers: [...state.servers, server]
  })),
  
  updateServer: (id, updates) => set((state) => ({
    servers: state.servers.map(server =>
      server.id === id ? { ...server, ...updates } : server
    )
  })),
  
  removeServer: (id) => set((state) => ({
    servers: state.servers.filter(server => server.id !== id)
  })),
  
  clearError: () => set({ error: null })
}));
