import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-black border-b border-white">
      <div className="flex items-center py-4 px-4">
        <div className="flex items-center">
          <img
            src="/skull.png"
            alt="Wraithwatch"
            className="w-8 h-8"
          />
          <h1 className="text-white text-3xl font-light uppercase pl-4">
            Wraithwatch Command Center
          </h1>
        </div>
      </div>
    </header>
  );
}; 