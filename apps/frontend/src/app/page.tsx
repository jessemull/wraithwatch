'use client';

import { useWebSocket } from '../hooks/useWebSocket';

export default function Home() {
  const { entities, isConnected, lastUpdate } = useWebSocket(
    process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:3001'
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Wraithwatch</h1>
          <p className="text-gray-600 mt-2">
            Real-time entity monitoring dashboard
          </p>
        </div>

        {/* Entity List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Entities</h2>
            <p className="text-sm text-gray-500 mt-1">
              {entities.length} total entities
              {lastUpdate && (
                <span className="ml-2 text-green-600">
                  • Last update: {new Date(lastUpdate).toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {entities.map(entity => (
              <div
                key={entity.id}
                className="px-6 py-4 hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        entity.type === 'System'
                          ? 'bg-blue-500'
                          : entity.type === 'User'
                            ? 'bg-green-500'
                            : 'bg-purple-500'
                      }`}
                    />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {entity.name}
                      </h3>
                      <p className="text-xs text-gray-500">{entity.type}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-900">
                      {entity.changesToday} changes today
                    </p>
                    <p className="text-xs text-gray-500">
                      Last seen:{' '}
                      {new Date(entity.lastSeen).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            WebSocket connection:
            <span
              className={`ml-1 ${isConnected ? 'text-green-500' : 'text-red-500'}`}
            >
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
