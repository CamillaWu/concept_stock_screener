import React from 'react';
import type { StockConcept } from '@concepts-radar/types';
import { ThemeCard } from './ThemeCard';

interface TrendingListProps {
  themes: StockConcept[];
  onThemeClick?: (theme: StockConcept) => void;
  className?: string;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export const TrendingList: React.FC<TrendingListProps> = ({
  themes,
  onThemeClick,
  className = '',
  loading = false,
  error = null,
  onRetry
}) => {
  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
            <div className="flex items-start justify-between mb-3">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        <div className="mb-4">載入失敗</div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            重試
          </button>
        )}
      </div>
    );
  }

  if (themes.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        目前沒有熱門概念
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {themes.map((theme) => (
        <ThemeCard
          key={theme.id}
          theme={theme}
          onSelect={() => onThemeClick?.(theme)}
        />
      ))}
    </div>
  );
};
