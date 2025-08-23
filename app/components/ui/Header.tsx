interface HeaderProps {
  onRefresh: () => void;
}

export default function Header({ onRefresh }: HeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-600 rounded-lg shadow-lg flex items-center justify-center">
          <div className="w-4 h-4 bg-gray-900 rounded-sm"></div>
        </div>
        <h1 className="text-3xl font-bold text-white">Bedrock Manager</h1>
      </div>
      <p className="text-gray-400">Manage your Minecraft Bedrock servers and worlds with style</p>
      
      {/* Refresh Button */}
      <div className="mt-6">
        <button
          onClick={onRefresh}
          className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-lg transform transition-transform hover:scale-105"
        >
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
    </div>
  );
}
