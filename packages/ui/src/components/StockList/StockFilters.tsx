import React from 'react';
import { Stock } from '@concepts-radar/types';

interface StockFiltersProps {
  filters: {
    favorites?: boolean;
    anomalies?: boolean;
    sentimentPositive?: boolean;
    sentimentNegative?: boolean;
  };
  onFilterChange: (filter: string, value: boolean) => void;
  className?: string;
}

export const StockFilters: React.FC<StockFiltersProps> = React.memo(({
  filters,
  onFilterChange,
  className = ''
}) => {
  const filterOptions = [
    { key: 'favorites', label: '收藏', icon: '⭐' },
    { key: 'anomalies', label: '異常', icon: '⚠️' },
    { key: 'sentimentPositive', label: '正面', icon: '📈' },
    { key: 'sentimentNegative', label: '負面', icon: '📉' }
  ];

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {filterOptions.map(({ key, label, icon }) => (
        <button
          key={key}
          onClick={() => onFilterChange(key, !filters[key as keyof typeof filters])}
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filters[key as keyof typeof filters]
              ? 'bg-blue-100 text-blue-800 border border-blue-200'
              : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
          }`}
        >
          <span>{icon}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
});

StockFilters.displayName = 'StockFilters';
