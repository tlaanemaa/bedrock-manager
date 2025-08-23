interface ErrorDisplayProps {
  serversError?: string | null;
  worldsError?: string | null;
}

export default function ErrorDisplay({ serversError, worldsError }: ErrorDisplayProps) {
  if (!serversError && !worldsError) {
    return null;
  }

  return (
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
  );
}
