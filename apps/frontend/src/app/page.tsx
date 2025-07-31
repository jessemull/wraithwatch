'use client';

import { config } from '../config';
import { useWebSocket } from '../hooks/useWebSocket';
import { EnhancedThreeJSVisualization } from '../components';

export default function Home() {
  const { entities, isConnected, lastUpdate } = useWebSocket(
    config.websocket.url
  );
  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-black/20"></div>
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-40 w-1 h-1 bg-blue-300 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/3 w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12 text-center">
          <h1 className="text-5xl text-white mb-4 condensed-text">
            {config.app.name.toUpperCase()}
          </h1>
          <p className="text-xl text-blue-200 font-light">
            {config.app.description}
          </p>
          <p className="text-sm text-gray-400 mt-4">{config.app.tagline}</p>
        </div>
        {/* Three.js Visualization */}
        <div className="mb-8">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white">
              3D Network Visualization
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Real-time cybersecurity entity mapping
            </p>
          </div>
          <EnhancedThreeJSVisualization
            entities={entities}
            isConnected={isConnected}
          />
        </div>

        {/* Entity List */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 shadow-2xl">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white">Entities</h2>
            <p className="text-sm text-gray-400 mt-1">
              {entities.length} total entities
              {lastUpdate && (
                <span className="ml-2 text-blue-400">
                  • Last update: {new Date(lastUpdate).toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
          <div className="divide-y divide-gray-800">
            {entities.map(entity => (
              <div
                key={entity.id}
                className="px-6 py-4 hover:bg-gray-800/50 cursor-pointer transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        entity.type === 'AI_Agent'
                          ? 'bg-blue-500'
                          : entity.type === 'Network_Node'
                            ? 'bg-green-500'
                            : entity.type === 'Threat'
                              ? 'bg-red-500'
                              : entity.type === 'System'
                                ? 'bg-yellow-500'
                                : entity.type === 'User'
                                  ? 'bg-purple-500'
                                  : 'bg-cyan-500'
                      }`}
                    />
                    <div>
                      <h3 className="text-sm font-medium text-white">
                        {entity.name}
                      </h3>
                      <p className="text-xs text-gray-400">{entity.type}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-white">
                      {entity.changesToday} changes today
                    </p>
                    <p className="text-xs text-gray-400">
                      Last seen:{' '}
                      {new Date(entity.lastSeen).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            WebSocket connection:
            <span
              className={`ml-1 ${isConnected ? 'text-green-400' : 'text-red-400'}`}
            >
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
