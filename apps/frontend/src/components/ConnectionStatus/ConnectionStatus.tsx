'use client';

interface ConnectionStatusProps {
  isConnected: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isConnected,
}) => {
  return (
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
  );
};
