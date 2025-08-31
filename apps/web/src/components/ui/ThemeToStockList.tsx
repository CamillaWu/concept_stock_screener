import React from 'react';
import type { StockConcept, Stock } from '@concepts-radar/types';

interface ThemeToStockListProps {
  theme: StockConcept;
  onSelectStock?: (stock: Stock) => void;
  maxStocks?: number;
}

const ThemeToStockList: React.FC<ThemeToStockListProps> = ({
  theme,
  onSelectStock,
  maxStocks = 10
}) => {
  const displayStocks = theme.stocks?.slice(0, maxStocks) || [];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* 主題標題 */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900">{theme.theme}</h3>
        {theme.description && (
          <p className="text-sm text-gray-600 mt-2">{theme.description}</p>
        )}
      </div>

      {/* 股票列表 */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">
          相關個股 ({displayStocks.length})
        </h4>
        {displayStocks.length > 0 ? (
          <div className="space-y-2">
            {displayStocks.map((stock) => (
              <div
                key={stock.ticker}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => onSelectStock?.(stock)}
                role="button"
                tabIndex={0}
                aria-label={`選擇股票：${stock.name} (${stock.ticker})`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectStock?.(stock);
                  }
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{stock.name}</span>
                    <span className="text-sm text-gray-500">{stock.ticker}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {stock.exchange}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📊</div>
            <p>暫無相關個股資料</p>
          </div>
        )}
      </div>

      {/* 顯示更多提示 */}
      {theme.stocks && theme.stocks.length > maxStocks && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            還有 {theme.stocks.length - maxStocks} 檔個股...
          </p>
        </div>
      )}
    </div>
  );
};

export default ThemeToStockList;
