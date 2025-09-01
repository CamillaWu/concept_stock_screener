import React, { useState, useMemo } from 'react';
import { StockConcept } from '@concepts-radar/types';
import { ThemeCard } from './ThemeCard';

interface TrendingListProps {
  themes: StockConcept[];
  onThemeClick?: (theme: StockConcept) => void;
  onStockClick?: (stock: any) => void;
  className?: string;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

type SortOption = 'heat' | 'stocks' | 'name';

export const TrendingList: React.FC<TrendingListProps> = ({
  themes,
  onThemeClick,
  onStockClick,
  className = '',
  loading = false,
  error = null,
  onRetry
}) => {
  const [sortBy, setSortBy] = useState<SortOption>('heat');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedThemes = useMemo(() => {
    const sorted = [...themes].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'heat':
          comparison = (a.heatScore || 0) - (b.heatScore || 0);
          break;
        case 'stocks':
          comparison = a.stocks.length - b.stocks.length;
          break;
        case 'name':
          comparison = a.theme.localeCompare(b.theme);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return sorted;
  }, [themes, sortBy, sortOrder]);

  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortOrder('desc');
    }
  };

  if (loading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="mb-4">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-2">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-10 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 text-center ${className}`}>
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">載入失敗</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              重新載入
            </button>
          )}
        </div>
      </div>
    );
  }

  if (themes.length === 0) {
    return (
      <div className={`p-6 text-center ${className}`}>
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">目前沒有熱門概念</h3>
        <p className="text-gray-500">請稍後再試或嘗試搜尋其他主題</p>
      </div>
    );
  }

  return (
    <div className={`p-6 ${className}`}>
      {/* 排序控制 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">熱門概念</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>排序方式：</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              {[
                { key: 'heat' as SortOption, label: '熱度' },
                { key: 'stocks' as SortOption, label: '股票數' },
                { key: 'name' as SortOption, label: '名稱' }
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => handleSort(option.key)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    sortBy === option.key
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {option.label}
                    {sortBy === option.key && (
                      <svg className={`w-3 h-3 transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* 統計資訊 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{themes.length}</div>
            <div className="text-sm text-blue-700">總概念數</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {themes.reduce((sum, theme) => sum + theme.stocks.length, 0)}
            </div>
            <div className="text-sm text-green-700">總股票數</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {Math.round(themes.reduce((sum, theme) => sum + (theme.heatScore || 0), 0) / themes.length)}
            </div>
            <div className="text-sm text-orange-700">平均熱度</div>
          </div>
        </div>
      </div>

      {/* 主題列表 */}
      <div className="space-y-6">
        {sortedThemes.map((theme, index) => (
          <div key={theme.id} className="relative">
            {/* 排名標籤 */}
            {index < 3 && (
              <div className="absolute -top-2 -left-2 z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                  index === 0 ? 'bg-yellow-500' : 
                  index === 1 ? 'bg-gray-400' : 
                  'bg-orange-500'
                }`}>
                  {index + 1}
                </div>
              </div>
            )}
            
            <ThemeCard
              theme={theme}
              onSelect={() => onThemeClick?.(theme)}
              compact={false}
            />
          </div>
        ))}
      </div>

      {/* 底部提示 */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          共 {themes.length} 個熱門概念 • 每 5 分鐘自動更新
        </p>
      </div>
    </div>
  );
};
