import React from 'react';
import { SearchBar } from './SearchBar';
import { TrendingList } from './TrendingList';
import { StockConcept, SearchMode } from '../../types';

interface SidebarProps {
  trendingThemes: StockConcept[];
  onSearch: (query: string, mode?: SearchMode) => void;
  onThemeClick: (theme: StockConcept) => void;
  onStockClick: (stock: any) => void;
  loading?: boolean;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  trendingThemes,
  onSearch,
  onThemeClick,
  onStockClick,
  loading = false,
  className = ''
}) => {
  return (
    <div className={`w-80 bg-gray-50 border-r border-gray-200 flex flex-col ${className}`}>
      {/* 搜尋區域 */}
      <div className="p-4 border-b border-gray-200">
        <SearchBar
          mode="theme"
          onSearch={onSearch}
          onModeChange={() => {}}
          className="w-full"
        />
      </div>

      {/* 熱門概念列表 */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            熱門概念
          </h2>
          <TrendingList
            themes={trendingThemes}
            onThemeClick={onThemeClick}
            onStockClick={onStockClick}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};
