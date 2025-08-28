import React from 'react';
import { HeatBar } from './HeatBar';
import type { StockConcept, Stock } from '@concepts-radar/types';

interface ThemeCardProps {
  theme: StockConcept;
  onSelect?: (theme: StockConcept) => void;
  onClick?: (theme: StockConcept) => void;
  onSelectStock?: (stock: Stock) => void;
  className?: string;
  compact?: boolean;
}

export const ThemeCard: React.FC<ThemeCardProps> = ({
  theme,
  onSelect,
  onClick,
  onSelectStock,
  className = '',
  compact = false
}) => {
  const handleCardClick = () => {
    onSelect?.(theme);
    if (onClick) {
      onClick(theme);
    }
  };

  const handleStockClick = (e: React.MouseEvent, stock: Stock) => {
    e.stopPropagation();
    onSelectStock?.(stock);
  };

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 cursor-pointer ${className}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-label={`主題：${theme.theme}，熱度：${theme.heatScore}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      <div className="p-4">
        {/* 標題和熱度 */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight">
            {theme.theme}
          </h3>
          <HeatBar score={theme.heatScore} size="small" />
        </div>

        {/* 描述 */}
        {theme.description && !compact && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {theme.description}
          </p>
        )}

        {/* 相關股票 */}
        {theme.stocks.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">
              相關股票 ({theme.stocks.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {theme.stocks.slice(0, compact ? 2 : 3).map((stock) => (
                <button
                  key={stock.ticker}
                  onClick={(e) => handleStockClick(e, stock)}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md hover:bg-blue-100 transition-colors"
                  aria-label={`查看 ${stock.name} (${stock.ticker}) 詳情`}
                >
                  <span className="font-medium">{stock.ticker}</span>
                  <span className="text-blue-600">{stock.name}</span>
                </button>
              ))}
              {theme.stocks.length > (compact ? 2 : 3) && (
                <span className="text-xs text-gray-500 px-2 py-1">
                  +{theme.stocks.length - (compact ? 2 : 3)} 檔
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
