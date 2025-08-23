import { VALIDATION } from '../constants';

/**
 * Validation utilities
 */

/**
 * Validate server name
 */
export function validateServerName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Server name is required' };
  }
  
  if (!VALIDATION.SERVER_NAME_REGEX.test(name)) {
    return { valid: false, error: 'Server name can only contain letters, numbers, dots, underscores, and hyphens' };
  }
  
  if (name.length > 50) {
    return { valid: false, error: 'Server name must be 50 characters or less' };
  }
  
  return { valid: true };
}

/**
 * Validate port number
 */
export function validatePort(port: number): { valid: boolean; error?: string } {
  if (!port || isNaN(port)) {
    return { valid: false, error: 'Port must be a valid number' };
  }
  
  if (port < 1024 || port > 65535) {
    return { valid: false, error: 'Port must be between 1024 and 65535' };
  }
  
  return { valid: true };
}

/**
 * Validate Minecraft server port
 */
export function validateMinecraftPort(port: number): { valid: boolean; error?: string } {
  const baseValidation = validatePort(port);
  if (!baseValidation.valid) return baseValidation;
  
  if (port < 19132 || port > 19200) {
    return { valid: false, error: 'Minecraft server port should be between 19132 and 19200' };
  }
  
  return { valid: true };
}

/**
 * Validate world name
 */
export function validateWorldName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'World name is required' };
  }
  
  if (!VALIDATION.SERVER_NAME_REGEX.test(name)) {
    return { valid: false, error: 'World name can only contain letters, numbers, dots, underscores, and hyphens' };
  }
  
  if (name.length > 50) {
    return { valid: false, error: 'World name must be 50 characters or less' };
  }
  
  return { valid: true };
}
