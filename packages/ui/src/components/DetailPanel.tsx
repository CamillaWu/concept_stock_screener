import React from 'react';
import { StockConcept, Stock } from '@concepts-radar/types';
import { ThemeCard } from './ThemeCard';
import { StockList } from './StockList';
import { LoadingSkeleton } from './LoadingSkeleton';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';

interface DetailPanelProps {
  selectedTheme?: StockConcept;
  relatedStocks?: Stock[];
  loading?: boolean;
  error?: string;
  onStockClick?: (stock: Stock) => void;
  onRetry?: () => void;
  className?: string;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({
  selectedTheme,
  relatedStocks = [],
  loading = false,
  error,
  onStockClick,
  onRetry,
  className = ''
}) => {
  if (loading) {
    return (
      <div className={`flex-1 bg-white ${className}`}>
        <div className="p-6">
          <LoadingSkeleton type="card" className="mb-6" />
          <LoadingSkeleton type="list" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex-1 bg-white ${className}`}>
        <ErrorState
          message={error}
          onRetry={onRetry}
          className="h-full"
        />
      </div>
    );
  }

  if (!selectedTheme) {
    return (
      <div className={`flex-1 bg-white ${className}`}>
        <EmptyState
          title="選擇一個概念"
          message="從左側選擇一個熱門概念來查看詳細資訊"
          icon={
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          }
          className="h-full"
        />
      </div>
    );
  }

  return (
    <div className={`flex-1 bg-white overflow-y-auto ${className}`}>
      <div className="p-6">
        {/* 概念詳細資訊 */}
        <div className="mb-6">
          <ThemeCard
            theme={selectedTheme}
            onSelect={() => {}}
            compact={false}
          />
        </div>

        {/* 相關股票列表 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            相關股票 ({relatedStocks.length})
          </h3>
          <StockList
            stocks={relatedStocks}
            onStockClick={onStockClick}
          />
        </div>
      </div>
    </div>
  );
};
