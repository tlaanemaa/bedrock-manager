// Server related types
export interface ContainerInfo {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'starting' | 'stopping';
  image: string;
  ports: string[];
  mounts: string[];
  created: Date;
}

export interface ServerStatus {
  id: string;
  name: string;
  status: 'running' | 'stopped';
  port: number;
  world?: string;
  containerId: string;
}

// World related types
export interface WorldInfo {
  id: string;
  name: string;
  path: string;
  serverMount: string;
  addons: string[];
  size: number;
  lastModified: Date;
}

export interface AddonInfo {
  name: string;
  type: 'behavior' | 'resource';
  path: string;
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ErrorResponse {
  error: string;
}

// Store state types
export interface ServersState {
  servers: ServerStatus[];
  loading: boolean;
  error: string | null;
}

export interface WorldsState {
  worlds: WorldInfo[];
  loading: boolean;
  error: string | null;
}
