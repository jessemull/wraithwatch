import React from 'react';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  children,
  className = '',
}) => {
  return (
    <div className={`bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-lg ${className}`}>
      <h3 className="text-gray-300 text-sm font-semibold mb-3 uppercase tracking-wide">{title}</h3>
      <div className="h-60">
        {children}
      </div>
    </div>
  );
}; 