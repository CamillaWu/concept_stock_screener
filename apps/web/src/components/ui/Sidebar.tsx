import React, { useState, useEffect, useCallback } from 'react';
import type { StockConcept } from '@concepts-radar/types';
import { apiService } from '../../services/api';
import { Sidebar as UISidebar } from '@concepts-radar/ui';

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
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchTrendingThemes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const themes = await apiService.getTrendingThemes('popular', useRealData);
      setTrendingThemes(themes);
      setLastUpdated(new Date());
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

  // 自動刷新（每5分鐘）
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        fetchTrendingThemes();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchTrendingThemes, loading]);

  return (
    <UISidebar
      collapsed={collapsed}
      onToggleCollapse={onToggleCollapse}
      trendingThemes={trendingThemes}
      loading={loading}
      error={error}
      onRetry={fetchTrendingThemes}
      onThemeClick={onThemeClick}
      useRealData={useRealData}
      onUseRealDataChange={onUseRealDataChange}
      lastUpdated={lastUpdated}
    />
  );
};
