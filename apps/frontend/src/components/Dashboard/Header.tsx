import React from 'react';
import { User } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 shadow-lg">
      <div className="flex items-center justify-between py-4 px-6">
        <div className="flex items-center">
          <img src="/skull.png" alt="Wraithwatch" className="w-8 h-8" />
          <h1 className="text-white text-2xl font-semibold uppercase pl-4 tracking-wide">
            Wraithwatch Command Center
          </h1>
        </div>
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer">
            <User className="w-5 h-5 text-gray-300" />
          </div>
        </div>
      </div>
    </header>
  );
};
