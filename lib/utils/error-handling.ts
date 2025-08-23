/**
 * Error handling utilities
 */

/**
 * Extract error message from unknown error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  
  return 'Unknown error occurred';
}

/**
 * Create standardized error response
 */
export function createErrorResponse(message: string, statusCode: number = 500) {
  return {
    error: message,
    timestamp: new Date().toISOString(),
    statusCode
  };
}

/**
 * Log error with context
 */
export function logError(context: string, error: unknown, additionalInfo?: Record<string, unknown>) {
  const errorMessage = getErrorMessage(error);
  console.error(`[${context}] ${errorMessage}`, {
    error,
    ...additionalInfo,
    timestamp: new Date().toISOString()
  });
}

/**
 * Wrap async function with error handling
 */
export function withErrorHandling<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  context: string
) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      logError(context, error, { args });
      throw error;
    }
  };
}
