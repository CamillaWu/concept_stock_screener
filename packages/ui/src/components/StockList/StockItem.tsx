import React from 'react';
import { Stock } from '@concepts-radar/types';
import { HeatBar } from '../HeatBar';

interface StockItemProps {
  stock: Stock;
  onStockClick?: (stock: Stock) => void;
  compact?: boolean;
  className?: string;
}

export const StockItem: React.FC<StockItemProps> = React.memo(({
  stock,
  onStockClick,
  compact = false,
  className = ''
}) => {
  const handleClick = () => {
    onStockClick?.(stock);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-3 hover:border-gray-300 transition-colors cursor-pointer ${
        compact ? 'p-2' : ''
      } ${className}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`選擇股票：${stock.name} (${stock.ticker})`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-gray-900 truncate">
              {stock.ticker}
            </span>
            {stock.name && (
              <span className="text-sm text-gray-500 truncate">
                {stock.name}
              </span>
            )}
          </div>
          
          {stock.concepts && stock.concepts.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {stock.concepts.slice(0, compact ? 2 : 3).map((concept, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {concept}
                </span>
              ))}
              {stock.concepts.length > (compact ? 2 : 3) && (
                <span className="text-xs text-gray-500">
                  +{stock.concepts.length - (compact ? 2 : 3)}
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className="ml-3 flex-shrink-0">
          <HeatBar
            score={stock.heatScore || 0}
            size="sm"
            showScore={!compact}
          />
        </div>
      </div>
    </div>
  );
});

StockItem.displayName = 'StockItem';
