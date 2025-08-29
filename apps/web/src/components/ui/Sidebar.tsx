import React, { useState, useEffect, useCallback } from 'react';
import { TrendingList } from './TrendingList';
import { apiService } from '../../services/api';
import type { StockConcept } from '@concepts-radar/types';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onThemeClick: (theme: StockConcept) => void;
  useRealData: boolean;
  onUseRealDataChange: (useRealData: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  onThemeClick,
  useRealData,
  onUseRealDataChange
}) => {
  const [trendingThemes, setTrendingThemes] = useState<StockConcept[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');

  const fetchTrendingThemes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const themes = await apiService.getTrendingThemes('popular', useRealData);
      setTrendingThemes(themes);
    } catch (err) {
      console.error('載入熱門概念失敗:', err);
      setError('載入失敗');
    } finally {
      setLoading(false);
    }
  }, [useRealData]);

  useEffect(() => {
    fetchTrendingThemes();
  }, [fetchTrendingThemes]);

  // 修復 hydration 錯誤：只在客戶端更新時間
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleString('zh-TW'));
    };
    
    updateTime(); // 立即更新一次
    const interval = setInterval(updateTime, 1000); // 每秒更新一次
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* 標題和切換按鈕 */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!collapsed && (
          <h2 className="text-lg font-semibold text-gray-900">概念股篩選器</h2>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label={collapsed ? '展開側邊欄' : '收合側邊欄'}
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* 搜尋欄（僅在展開時顯示） */}
      {!collapsed && (
        <div className="p-4 border-b border-gray-200">
          <div className="text-sm text-gray-600 mb-2">資料來源</div>
          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={useRealData}
                onChange={(e) => onUseRealDataChange(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span>真實台股資料</span>
            </label>
          </div>
          {useRealData && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
              <div className="flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                台灣證券交易所 + Yahoo Finance
              </div>
            </div>
          )}
          <div className="mt-2 text-xs text-gray-500">
            資料更新時間: {currentTime || '載入中...'}
          </div>
        </div>
      )}

      {/* 熱門主題列表 */}
      <div className="flex-1 overflow-y-auto">
        {!collapsed ? (
          <TrendingList
            themes={trendingThemes}
            onThemeClick={onThemeClick}
            loading={loading}
            error={error}
            onRetry={fetchTrendingThemes}
          />
        ) : (
          <div className="p-2">
            {trendingThemes.slice(0, 3).map((theme) => (
              <div
                key={theme.id}
                onClick={() => onThemeClick(theme)}
                className="mb-2 p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition-colors"
                title={theme.theme}
              >
                <div className="text-xs font-medium text-gray-900 truncate">
                  {theme.theme}
                </div>
                <div className="text-xs text-red-500 font-bold">
                  {theme.heatScore}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
