import React from 'react';
import { HeatBar } from '../index';
import type { StockConcept, Stock } from '@concepts-radar/types';

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

  const getHeatColor = (score: number) => {
    if (score >= 80) return 'from-red-500 to-orange-500';
    if (score >= 60) return 'from-orange-500 to-yellow-500';
    if (score >= 40) return 'from-yellow-500 to-green-500';
    return 'from-green-500 to-blue-500';
  };

  const getHeatText = (score: number) => {
    if (score >= 80) return '極熱';
    if (score >= 60) return '熱門';
    if (score >= 40) return '溫和';
    return '冷門';
  };

  return (
    <div
      className={`card card-interactive group ${className}`}
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
      <div className="p-6">
        {/* 標題和熱度 */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-xl leading-tight mb-2 group-hover:text-blue-600 transition-colors">
              {theme.theme}
            </h3>
            <div className="flex items-center gap-2">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getHeatColor(theme.heatScore)} text-white`}>
                <div className="w-2 h-2 bg-white rounded-full mr-2 opacity-80"></div>
                {getHeatText(theme.heatScore)}
              </div>
              <span className="text-sm text-gray-500">
                熱度 {theme.heatScore}
              </span>
            </div>
          </div>
          <div className="flex-shrink-0">
            <HeatBar score={theme.heatScore} size="medium" />
          </div>
        </div>

        {/* 描述 */}
        {theme.description && !compact && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {theme.description}
          </p>
        )}

        {/* 統計資訊 */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{theme.stocks.length}</div>
            <div className="text-xs text-gray-500">相關股票</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {theme.stocks.reduce((sum, stock) => sum + (stock.heatScore || 0), 0).toFixed(0)}
            </div>
            <div className="text-xs text-gray-500">總熱度</div>
          </div>
        </div>

        {/* 相關股票 */}
        {theme.stocks.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-700">
                相關股票
              </h4>
              <span className="text-xs text-gray-500">
                {theme.stocks.length} 檔
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {theme.stocks.slice(0, compact ? 2 : 4).map((stock) => (
                <button
                  key={stock.ticker}
                  onClick={(e) => handleStockClick(e, stock)}
                  className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group/stock"
                  aria-label={`查看 ${stock.name} (${stock.ticker}) 詳情`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                      {stock.ticker.slice(0, 2)}
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900 text-sm">{stock.ticker}</div>
                      <div className="text-xs text-gray-500">{stock.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        熱度 {stock.heatScore || 0}
                      </div>
                      <div className="text-xs text-gray-500">
                        {(stock.heatScore || 0) >= 70 ? '🔥' : (stock.heatScore || 0) >= 50 ? '⚡' : '📈'}
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover/stock:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
              {theme.stocks.length > (compact ? 2 : 4) && (
                <div className="text-center py-2">
                  <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    還有 {theme.stocks.length - (compact ? 2 : 4)} 檔股票
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 操作按鈕 */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <button
              onClick={handleCardClick}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              查看詳情
            </button>
            <div className="flex items-center gap-2">
              <button
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="收藏主題"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
              <button
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="分享主題"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
