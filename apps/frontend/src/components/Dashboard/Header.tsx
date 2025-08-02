import React from 'react';
import { User } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 shadow-lg">
      <div className="flex items-center justify-between py-4 px-4 sm:px-6">
        <div className="flex items-center min-w-0">
          <img
            src="/skull.png"
            alt="Wraithwatch"
            className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0"
          />
          <h1 className="text-white text-lg sm:text-xl md:text-2xl font-semibold uppercase pl-2 sm:pl-4 tracking-wide truncate">
            <span className="hidden sm:inline">Wraithwatch Command Center</span>
            <span className="sm:hidden">Wraithwatch</span>
          </h1>
        </div>
        <div className="flex items-center flex-shrink-0">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer">
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
          </div>
        </div>
      </div>
    </header>
  );
};
