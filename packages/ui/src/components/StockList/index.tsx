import React, { useState, useCallback, useMemo } from 'react';
import { Stock } from '@concepts-radar/types';
import { StockItem } from './StockItem';
import { StockFilters } from './StockFilters';
import { StockPagination } from './StockPagination';
import { StockListErrorBoundary } from './ErrorBoundary';

interface StockListProps {
  stocks: Stock[];
  onStockClick?: (stock: Stock) => void;
  className?: string;
  compact?: boolean;
  showFilters?: boolean;
  showPagination?: boolean;
  itemsPerPage?: number;
}

interface FilterState {
  favorites?: boolean;
  anomalies?: boolean;
  sentimentPositive?: boolean;
  sentimentNegative?: boolean;
}

export const StockList: React.FC<StockListProps> = React.memo(({
  stocks,
  onStockClick,
  className = '',
  compact = false,
  showFilters = false,
  showPagination = false,
  itemsPerPage = 10
}) => {
  // 狀態管理
  const [filters, setFilters] = useState<FilterState>({});
  const [currentPage, setCurrentPage] = useState(1);

  // 篩選邏輯
  const filteredStocks = useMemo(() => {
    let result = stocks;

    // 應用篩選條件
    if (filters.favorites) {
      // 這裡需要整合收藏功能
      // result = result.filter(stock => isFavorite(stock.ticker));
    }

    if (filters.anomalies) {
      // 篩選異常股票（價格或成交量異常）
      result = result.filter(stock => {
        // 這裡需要整合異常檢測邏輯
        return false; // 暫時返回 false
      });
    }

    if (filters.sentimentPositive) {
      // 篩選正面情緒股票
      // 需要整合情緒分析數據
    }

    if (filters.sentimentNegative) {
      // 篩選負面情緒股票
      // 需要整合情緒分析數據
    }

    return result;
  }, [stocks, filters]);

  // 分頁邏輯
  const paginatedStocks = useMemo(() => {
    if (!showPagination) return filteredStocks;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredStocks.slice(startIndex, endIndex);
  }, [filteredStocks, currentPage, itemsPerPage, showPagination]);

  const totalPages = useMemo(() => {
    if (!showPagination) return 1;
    return Math.ceil(filteredStocks.length / itemsPerPage);
  }, [filteredStocks.length, itemsPerPage, showPagination]);

  // 事件處理
  const handleFilterChange = useCallback((filter: string, value: boolean) => {
    setFilters(prev => ({
      ...prev,
      [filter]: value
    }));
    setCurrentPage(1); // 重置到第一頁
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleStockClick = useCallback((stock: Stock) => {
    onStockClick?.(stock);
  }, [onStockClick]);

  // 空狀態處理
  if (stocks.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        沒有相關股票
      </div>
    );
  }

  // 篩選後無結果
  if (filteredStocks.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        <div className="text-4xl mb-2">🔍</div>
        <p>沒有符合篩選條件的股票</p>
        <button
          onClick={() => setFilters({})}
          className="mt-2 text-blue-600 hover:text-blue-800 underline"
        >
          清除篩選條件
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 篩選器 */}
      {showFilters && (
        <StockFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      )}

      {/* 股票列表 */}
      <div className="space-y-2">
        {paginatedStocks.map((stock) => (
          <StockItem
            key={stock.ticker}
            stock={stock}
            onStockClick={handleStockClick}
            compact={compact}
          />
        ))}
      </div>

      {/* 分頁器 */}
      {showPagination && totalPages > 1 && (
        <StockPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* 結果統計 */}
      {showFilters && (
        <div className="text-sm text-gray-500 text-center">
          顯示 {paginatedStocks.length} / {filteredStocks.length} 檔股票
          {filters.favorites || filters.anomalies || filters.sentimentPositive || filters.sentimentNegative ? (
            <span className="ml-2">
              (已套用篩選條件)
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
});

StockList.displayName = 'StockList';

// 導出 ErrorBoundary
export { StockListErrorBoundary };
