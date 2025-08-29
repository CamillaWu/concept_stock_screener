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
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  trendingThemes,
  onSearch,
  onThemeClick,
  onStockClick,
  loading = false,
  collapsed = false,
  onToggleCollapse,
  className = ''
}) => {
  return (
    <div className={`bg-white border-r border-gray-200 flex flex-col shadow-lg ${className} ${
      collapsed ? 'w-16' : 'w-80'
    } transition-all duration-300 ease-in-out`}>
      
      {/* 收合按鈕 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <h1 className="text-xl font-bold text-gray-900">概念股篩選</h1>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label={collapsed ? '展開側邊欄' : '收合側邊欄'}
        >
          <svg 
            className={`w-5 h-5 text-gray-600 transition-transform ${collapsed ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* 搜尋區域 */}
      {!collapsed && (
        <div className="p-4 border-b border-gray-200">
          <SearchBar
            mode="theme"
            onSearch={onSearch}
            onModeChange={() => {}}
            className="w-full"
          />
        </div>
      )}

      {/* 熱門概念列表 */}
      <div className="flex-1 overflow-y-auto">
        {collapsed ? (
          // 收合狀態顯示圖示
          <div className="p-2">
            <div className="text-center text-gray-500 text-xs mb-2">熱門</div>
            <div className="space-y-2">
              {trendingThemes.slice(0, 5).map((theme, index) => (
                <button
                  key={theme.id || index}
                  onClick={() => onThemeClick(theme)}
                  className="w-full p-2 rounded-lg hover:bg-blue-50 transition-colors group"
                  title={theme.theme}
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full mx-auto mb-1"></div>
                  <div className="text-xs text-gray-600 truncate">{theme.heatScore}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          // 展開狀態顯示完整列表
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
              熱門概念
            </h2>
            <TrendingList
              themes={trendingThemes}
              onThemeClick={onThemeClick}
              onStockClick={onStockClick}
              loading={loading}
            />
          </div>
        )}
      </div>

      {/* 底部狀態 */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-500 text-center">
            資料更新時間: {new Date().toLocaleTimeString('zh-TW')}
          </div>
        </div>
      )}
    </div>
  );
};
