import React from 'react';

interface WelcomeSectionProps {
  userName?: string;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  userName = 'Nik',
}) => {
  return (
    <div className="mb-10 min-h-[120px] sm:min-h-[100px]">
      <div className="flex flex-col items-center sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-xl font-semibold text-white">
            Welcome back, {userName}!
          </h1>
          <div className="flex flex-col items-center space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4 mt-4 sm:mt-2 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span>Suspicious login - 2m ago</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <span>Network activity - 15m ago</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center sm:justify-end space-x-4">
          <div className="text-center">
            <div className="text-sm text-gray-400">Status</div>
            <div className="text-green-400 font-medium">Secure</div>
          </div>
          <div className="w-px h-8 bg-gray-600"></div>
          <div className="text-center">
            <div className="text-sm text-gray-400">Dashboard</div>
            <div className="text-green-400 font-medium">Connected</div>
          </div>
        </div>
      </div>
    </div>
  );
};
