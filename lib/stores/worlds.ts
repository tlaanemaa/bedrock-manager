import { create } from 'zustand';
import { WorldInfo } from '../types';

interface WorldsState {
  worlds: WorldInfo[];
  loading: boolean;
  error: string | null;
  
  // Actions
  setWorlds: (worlds: WorldInfo[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addWorld: (world: WorldInfo) => void;
  updateWorld: (id: string, updates: Partial<WorldInfo>) => void;
  removeWorld: (id: string) => void;
  clearError: () => void;
}

export const useWorldsStore = create<WorldsState>((set) => ({
  worlds: [],
  loading: false,
  error: null,

  setWorlds: (worlds) => set({ worlds }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  addWorld: (world) => set((state) => ({
    worlds: [...state.worlds, world]
  })),
  
  updateWorld: (id, updates) => set((state) => ({
    worlds: state.worlds.map(world =>
      world.id === id ? { ...world, ...updates } : world
    )
  })),
  
  removeWorld: (id) => set((state) => ({
    worlds: state.worlds.filter(world => world.id !== id)
  })),
  
  clearError: () => set({ error: null })
}));
