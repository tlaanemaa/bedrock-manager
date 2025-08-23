// File system paths
export const PATHS = {
  SERVERS_ROOT: process.env.TEST_MODE === 'true' 
    ? '/app/test/test-data/servers' 
    : '/srv/minecraft/bedrock/servers',
  UPLOAD_TEMP: process.env.TEST_MODE === 'true' 
    ? '/app/test/test-data/temp' 
    : '/tmp'
} as const;

// Docker configuration
export const DOCKER = {
  IMAGE: 'itzg/minecraft-bedrock-server',
  CONTAINER_PREFIX: 'minecraft-',
  DEFAULT_PORT: 19132,
  PORT_RANGE: {
    START: 19132,
    END: 19200
  },
  RESTART_POLICY: 'unless-stopped'
} as const;

// Server configuration
export const SERVER = {
  DEFAULT_GAMEMODE: 'survival',
  DEFAULT_DIFFICULTY: 'normal',
  DEFAULT_MAX_PLAYERS: 20,
  EULA: 'TRUE'
} as const;

// File validation
export const VALIDATION = {
  SERVER_NAME_REGEX: /^[A-Za-z0-9._-]+$/,
  REQUIRED_WORLD_FILES: [
    'levelname.txt',
    'world_behavior_packs.json',
    'world_resource_packs.json'
  ]
} as const;

// UI configuration
export const UI = {
  REFRESH_INTERVAL: 5000, // 5 seconds
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  SUPPORTED_FILE_TYPES: {
    MCWORLD: '.mcworld',
    MCADDON: '.mcaddon'
  }
} as const;
