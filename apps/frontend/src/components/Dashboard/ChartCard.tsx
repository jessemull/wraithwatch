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
    <div className={`bg-gray-900 border border-gray-700 rounded-lg p-6 ${className}`}>
      <h3 className="text-gray-400 text-sm font-medium mb-4">{title}</h3>
      <div className="h-64">
        {children}
      </div>
    </div>
  );
}; 