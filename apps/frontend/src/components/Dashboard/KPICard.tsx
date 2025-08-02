import React from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: {
    value: string | number;
    isPositive: boolean;
  };
  comparison?: string;
  icon?: React.ReactNode;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  comparison,
  icon,
}) => {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-gray-300 text-sm font-semibold uppercase tracking-wide">
          {title}
        </h4>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <div className="flex items-baseline space-x-2">
        <span className="text-2xl font-bold text-white">{value}</span>
        {change && (
          <div
            className={`flex items-center text-xs font-medium ${
              change.isPositive ? 'text-green-400' : 'text-red-400'
            }`}
          >
            <span className="mr-1">{change.isPositive ? '↗' : '↘'}</span>
            <span>{change.value}</span>
          </div>
        )}
      </div>
      {comparison && <p className="text-gray-500 text-xs mt-2">{comparison}</p>}
    </div>
  );
};
