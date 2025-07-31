'use client';

import { config } from '../../config';
import { useWebSocket } from '../../hooks/useWebSocket';
import { VisualizationHub, ConnectionStatus, EntitiesList } from '../index';

export const Dashboard: React.FC = () => {
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
        <div className="mb-8">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white">
              3D Network Visualization
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Real-time cybersecurity entity mapping
            </p>
          </div>
          <VisualizationHub entities={entities} isConnected={isConnected} />
        </div>
        <EntitiesList
          entities={entities}
          lastUpdate={lastUpdate || undefined}
        />
        <ConnectionStatus isConnected={isConnected} />
      </div>
    </div>
  );
};
