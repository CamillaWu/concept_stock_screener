import React from 'react';
import { HeatBar } from './HeatBar';
import AnomalyAlert from './AnomalyAlert';
import SentimentAnalysis from './SentimentAnalysis';
import type { StockConcept, Stock } from '../../types';

interface ThemeCardProps {
  theme: StockConcept;
  onSelect?: (theme: StockConcept) => void;
  onClick?: (theme: StockConcept) => void;
  onSelectStock?: (stock: Stock) => void;
  className?: string;
  compact?: boolean;
  showAnomaly?: boolean;
  showSentiment?: boolean;
}

export const ThemeCard: React.FC<ThemeCardProps> = ({
  theme,
  onSelect,
  onClick,
  onSelectStock,
  className = '',
  compact = false,
  showAnomaly = false,
  showSentiment = false
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

  // 模擬異常數據
  const mockAnomalyEvents = showAnomaly ? [
    {
      type: 'price_up' as const,
      value: 8.5,
      threshold: 5,
      timestamp: '2024-01-15 14:30',
      description: 'AI 概念股集體上漲',
      affectedStocks: ['2330', '2317', '2454']
    }
  ] : [];

  // 模擬情緒數據
  const mockSentimentData = showSentiment ? {
    score: 0.7,
    trend: 'up' as const,
    sources: {
      news: 65,
      social: 35
    },
    recentTrend: [0.3, 0.5, 0.4, 0.6, 0.7, 0.8, 0.7]
  } : undefined;

  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] ${className}`}
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
      <div className="p-5">
        {/* 標題和熱度 */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">
              {theme.theme}
            </h3>
            {theme.description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {theme.description}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
              <div className="text-2xl font-bold text-red-500">{theme.heatScore}</div>
              <div className="text-xs text-gray-500">熱度分數</div>
            </div>
            <HeatBar score={theme.heatScore} size="small" />
          </div>
        </div>

        {/* 異常警示 */}
        {showAnomaly && mockAnomalyEvents.length > 0 && (
          <div className="mb-4">
            <AnomalyAlert events={mockAnomalyEvents} />
          </div>
        )}

        {/* 情緒分析 */}
        {showSentiment && mockSentimentData && (
          <div className="mb-4">
            <SentimentAnalysis data={mockSentimentData} />
          </div>
        )}

        {/* 相關股票 */}
        {theme.stocks && theme.stocks.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-700">
                相關股票 ({theme.stocks.length})
              </h4>
              <div className="text-xs text-gray-500">
                點擊查看詳情
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {theme.stocks.slice(0, compact ? 3 : 5).map((stock, index) => (
                <button
                  key={`${stock.ticker}-${index}`}
                  onClick={(e) => handleStockClick(e, stock)}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {stock.ticker}
                      </span>
                      <span className="text-sm text-gray-600">
                        {stock.name}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {stock.reason && (
                      <span className="text-xs text-gray-500 max-w-32 truncate">
                        {stock.reason}
                      </span>
                    )}
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
            {theme.stocks.length > (compact ? 3 : 5) && (
              <div className="text-center">
                <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                  查看更多 ({theme.stocks.length - (compact ? 3 : 5)})
                </button>
              </div>
            )}
          </div>
        )}

        {/* 底部標籤 */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>更新時間: {new Date().toLocaleTimeString('zh-TW')}</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>即時資料</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
