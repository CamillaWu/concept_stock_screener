import React from 'react';
import HeatBar from './HeatBar';

interface Stock {
  ticker: string;
  name: string;
  reason?: string;
}

interface StockConcept {
  theme: string;
  description?: string;
  heatScore: number;
  stocks: Stock[];
}

interface TrendingListProps {
  items: StockConcept[];
  onSelectTheme: (theme: StockConcept) => void;
  onSelectStock?: (stock: Stock) => void;
  loading?: boolean;
}

export default function TrendingList({ 
  items, 
  onSelectTheme, 
  onSelectStock,
  loading = false 
}: TrendingListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 15 }).map((_, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded mb-3 w-3/4"></div>
            <div className="h-2 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-lg font-medium mb-2">暫無熱門主題</div>
        <div className="text-sm">請稍後再試或嘗試其他關鍵詞</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={`${item.theme}-${index}`}
          className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
          onClick={() => onSelectTheme(item)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelectTheme(item);
            }
          }}
          tabIndex={0}
          role="button"
          aria-label={`主題：${item.theme}，熱度 ${item.heatScore}`}
        >
          {/* 主題標題 */}
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium text-gray-900 flex-1">{item.theme}</h3>
            <HeatBar 
              score={item.heatScore} 
              size="small" 
              showValue={false}
              className="w-20 flex-shrink-0"
            />
          </div>

          {/* 主題描述 */}
          {item.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {item.description}
            </p>
          )}

          {/* 代表性個股 */}
          {item.stocks && item.stocks.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.stocks.slice(0, 3).map((stock) => (
                <button
                  key={stock.ticker}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectStock?.(stock);
                  }}
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  aria-label={`查看 ${stock.name}(${stock.ticker}) 詳情`}
                >
                  {stock.ticker} {stock.name}
                </button>
              ))}
              {item.stocks.length > 3 && (
                <span className="px-2 py-1 text-xs text-gray-500">
                  +{item.stocks.length - 3}
                </span>
              )}
            </div>
          )}

          {/* 熱度分數 */}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-gray-500">市場熱度</span>
            <span className="text-sm font-medium text-gray-700">
              {item.heatScore}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
