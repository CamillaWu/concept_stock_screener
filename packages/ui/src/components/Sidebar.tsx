import React, { useEffect, useState, useCallback } from 'react';
import type { StockConcept } from '@concepts-radar/types';
import { TrendingList } from './TrendingList';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  trendingThemes: StockConcept[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onThemeClick: (theme: StockConcept) => void;
  useRealData: boolean;
  onUseRealDataChange: (useRealData: boolean) => void;
  lastUpdated?: Date | null;
  className?: string;
  onToggleFavorite?: (themeId: string, themeName: string) => void;
  isFavorite?: (themeId: string) => boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  trendingThemes,
  loading = false,
  error = null,
  onRetry,
  onThemeClick,
  useRealData,
  onUseRealDataChange,
  lastUpdated,
  className = '',
  onToggleFavorite,
  isFavorite
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  // 僅在客戶端更新時間，避免 SSR hydration 問題
  useEffect(() => {
    const updateTime = () => setCurrentTime(new Date().toLocaleString('zh-TW'));
    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleThemeClick = useCallback((theme: StockConcept) => {
    onThemeClick(theme);
  }, [onThemeClick]);

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return '尚未更新';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return '剛剛';
    if (minutes < 60) return `${minutes} 分鐘前`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} 小時前`;
    return date.toLocaleDateString('zh-TW');
  };

  return (
    <div className={`flex flex-col h-full bg-white border-r border-gray-200 ${className}`}>
      {/* 標題與折疊按鈕 */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">概念股篩選器</h2>
              <p className="text-sm text-gray-600">熱門投資主題</p>
            </div>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-3 rounded-xl hover:bg-white/80 transition-all duration-200 hover:shadow-md"
          aria-label={collapsed ? '展開側邊欄' : '收合側邊欄'}
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* 資料來源切換（僅在展開時顯示） */}
      {!collapsed && (
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">資料來源</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500">即時更新</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={useRealData}
                    onChange={(e) => onUseRealDataChange(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-12 h-6 rounded-full transition-colors ${
                    useRealData ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                      useRealData ? 'translate-x-6' : 'translate-x-1'
                    }`} style={{ marginTop: '4px' }} />
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">真實台股資料</div>
                  <div className="text-xs text-gray-500">台灣證券交易所</div>
                </div>
              </div>
              {useRealData && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  已啟用
                </span>
              )}
            </label>
            
            {useRealData && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">資料來源</span>
                </div>
                <div className="mt-1 text-xs text-green-600">
                  台灣證券交易所 + Yahoo Finance
                </div>
              </div>
            )}
          </div>

          {/* 更新時間 */}
          <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>最後更新</span>
              <span className="font-medium">{formatLastUpdated(lastUpdated || null)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
              <span>當前時間</span>
              <span className="font-medium">{currentTime || '載入中...'}</span>
            </div>
          </div>
        </div>
      )}

      {/* 熱門主題列表 */}
      <div className="flex-1 overflow-y-auto">
        {!collapsed ? (
          <TrendingList
            themes={trendingThemes}
            onThemeClick={handleThemeClick}
            loading={loading}
            error={error}
            onRetry={onRetry}
            onToggleFavorite={onToggleFavorite}
            isFavorite={isFavorite}
          />
        ) : (
          <div className="p-4">
            <div className="space-y-3">
              {trendingThemes.slice(0, 5).map((theme, index) => (
                <div
                  key={theme.id}
                  onClick={() => handleThemeClick(theme)}
                  className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-all duration-200 hover:shadow-sm group"
                  title={theme.theme}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {theme.theme}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {theme.stocks.length} 檔股票
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      <div className="text-sm font-bold text-red-500">
                        {theme.heatScore}
                      </div>
                      <div className="w-8 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                          style={{ width: `${theme.heatScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {trendingThemes.length > 5 && (
              <div className="mt-4 text-center">
                <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  還有 {trendingThemes.length - 5} 個主題
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 底部狀態 */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>系統狀態</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>正常運行</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
