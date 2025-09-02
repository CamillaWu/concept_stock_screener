import React, { useCallback } from 'react';
import type { StockConcept } from '@concepts-radar/types';
import { Sidebar as UISidebar } from '@concepts-radar/ui';
import { useFavoritesStore } from '../../store';
import { useTrendingThemes } from '../../hooks';

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
  // 使用新的 Hook 替代手動 API 調用
  const { 
    data: trendingThemes = [], 
    loading, 
    error, 
    refetch: fetchTrendingThemes,
    isSuccess 
  } = useTrendingThemes({
    useRealData,
    sortBy: 'popular',
    cacheTime: 5 * 60 * 1000, // 5分鐘快取
    staleTime: 2 * 60 * 1000,  // 2分鐘過期
    retryCount: 3
  });

  // 使用收藏狀態
  const { toggleFavorite, isFavorite } = useFavoritesStore();

  // 自動刷新處理
  const handleRetry = useCallback(() => {
    fetchTrendingThemes();
  }, [fetchTrendingThemes]);

  // 計算最後更新時間（基於快取時間）
  const lastUpdated = isSuccess ? new Date() : null;

  return (
    <UISidebar
      collapsed={collapsed}
      onToggleCollapse={onToggleCollapse}
      trendingThemes={trendingThemes}
      loading={loading}
      error={error}
      onRetry={handleRetry}
      onThemeClick={onThemeClick}
      useRealData={useRealData}
      onUseRealDataChange={onUseRealDataChange}
      lastUpdated={lastUpdated}
      onToggleFavorite={toggleFavorite}
      isFavorite={isFavorite}
    />
  );
};
