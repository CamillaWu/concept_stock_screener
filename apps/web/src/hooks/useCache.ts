import { useCallback, useEffect, useState, useMemo } from 'react';
import { cacheManager } from './useApi';

// 快取統計資訊
export interface CacheStats {
  size: number;
  keys: string[];
  totalSize: number;
  hitRate: number;
  missRate: number;
}

// 快取項目資訊
export interface CacheItemInfo {
  key: string;
  timestamp: number;
  cacheTime: number;
  staleTime: number;
  isExpired: boolean;
  isStale: boolean;
  age: number;
}

// 快取管理 Hook
export function useCache() {
  const [stats, setStats] = useState<CacheStats>({
    size: 0,
    keys: [],
    totalSize: 0,
    hitRate: 0,
    missRate: 0
  });

  const [items, setItems] = useState<CacheItemInfo[]>([]);

  // 更新統計資訊
  const updateStats = useCallback(() => {
    const cacheStats = cacheManager.getStats();
    setStats({
      size: cacheStats.size,
      keys: cacheStats.keys,
      totalSize: cacheStats.size,
      hitRate: 0, // 需要實作命中率追蹤
      missRate: 0  // 需要實作未命中率追蹤
    });
  }, []);

  // 更新快取項目資訊
  const updateItems = useCallback(() => {
    const cacheStats = cacheManager.getStats();
    const itemsInfo: CacheItemInfo[] = cacheStats.keys.map(key => {
      // 這裡需要實作獲取快取項目詳細資訊的方法
      return {
        key,
        timestamp: Date.now(),
        cacheTime: 5 * 60 * 1000,
        staleTime: 2 * 60 * 1000,
        isExpired: false,
        isStale: false,
        age: 0
      };
    });
    setItems(itemsInfo);
  }, []);

  // 清除所有快取
  const clearAll = useCallback(() => {
    cacheManager.clear();
    updateStats();
    updateItems();
  }, [updateStats, updateItems]);

  // 清除特定快取項目
  const clearItem = useCallback((key: string) => {
    // 需要實作清除特定項目的方法
    console.log('Clearing item:', key);
    updateStats();
    updateItems();
  }, [updateStats, updateItems]);

  // 清除過期項目
  const clearExpired = useCallback(() => {
    // 需要實作清除過期項目的方法
    updateStats();
    updateItems();
  }, [updateStats, updateItems]);

  // 清除過期項目
  const clearStale = useCallback(() => {
    // 需要實作清除過期項目的方法
    updateStats();
    updateItems();
  }, [updateStats, updateItems]);

  // 預熱快取
  const preloadCache = useCallback(async (urls: string[]) => {
    const promises = urls.map(async (url) => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          console.log('Preloaded data for:', url, data);
          // 這裡需要實作預熱快取的方法
        }
      } catch (error) {
        console.warn(`Failed to preload cache for ${url}:`, error);
      }
    });

    await Promise.allSettled(promises);
    updateStats();
    updateItems();
  }, [updateStats, updateItems]);

  // 匯出快取
  const exportCache = useCallback(() => {
    const cacheStats = cacheManager.getStats();
    const exportData = {
      timestamp: Date.now(),
      stats: cacheStats,
      items: items
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cache-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [items]);

  // 匯入快取
  const importCache = useCallback(async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // 這裡需要實作匯入快取的方法
      console.log('Importing cache:', data);
      
      updateStats();
      updateItems();
    } catch (error) {
      console.error('Failed to import cache:', error);
      throw error;
    }
  }, [updateStats, updateItems]);

  // 監聽快取變化
  useEffect(() => {
    updateStats();
    updateItems();

    // 定期更新統計資訊
    const interval = setInterval(() => {
      updateStats();
      updateItems();
    }, 5000); // 每5秒更新一次

    return () => clearInterval(interval);
  }, [updateStats, updateItems]);

  return {
    stats,
    items,
    clearAll,
    clearItem,
    clearExpired,
    clearStale,
    preloadCache,
    exportCache,
    importCache,
    refresh: updateStats
  };
}

// 快取監控 Hook
export function useCacheMonitor() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [monitorStats, setMonitorStats] = useState<{
    requests: number;
    hits: number;
    misses: number;
    errors: number;
    averageResponseTime: number;
  }>({
    requests: 0,
    hits: 0,
    misses: 0,
    errors: 0,
    averageResponseTime: 0
  });

  // 開始監控
  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
    setMonitorStats({
      requests: 0,
      hits: 0,
      misses: 0,
      errors: 0,
      averageResponseTime: 0
    });
  }, []);

  // 停止監控
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
  }, []);

  // 重置監控統計
  const resetStats = useCallback(() => {
    setMonitorStats({
      requests: 0,
      hits: 0,
      misses: 0,
      errors: 0,
      averageResponseTime: 0
    });
  }, []);

  return {
    isMonitoring,
    monitorStats,
    startMonitoring,
    stopMonitoring,
    resetStats
  };
}

// 快取策略 Hook
export function useCacheStrategy() {
  const [strategy, setStrategy] = useState<'aggressive' | 'balanced' | 'conservative'>('balanced');

  // 快取策略配置
  const strategies = useMemo(() => ({
    aggressive: {
      defaultCacheTime: 30 * 60 * 1000, // 30分鐘
      defaultStaleTime: 15 * 60 * 1000, // 15分鐘
      retryCount: 3,
      preloadEnabled: true
    },
    balanced: {
      defaultCacheTime: 10 * 60 * 1000, // 10分鐘
      defaultStaleTime: 5 * 60 * 1000,  // 5分鐘
      retryCount: 2,
      preloadEnabled: false
    },
    conservative: {
      defaultCacheTime: 2 * 60 * 1000,  // 2分鐘
      defaultStaleTime: 1 * 60 * 1000,  // 1分鐘
      retryCount: 1,
      preloadEnabled: false
    }
  }), []);

  // 獲取當前策略配置
  const getCurrentStrategy = useCallback(() => {
    return strategies[strategy];
  }, [strategy, strategies]);

  // 切換策略
  const switchStrategy = useCallback((newStrategy: 'aggressive' | 'balanced' | 'conservative') => {
    setStrategy(newStrategy);
  }, []);

  return {
    strategy,
    strategies,
    getCurrentStrategy,
    switchStrategy
  };
}

// 快取優化 Hook
export function useCacheOptimization() {
  const [optimizationEnabled, setOptimizationEnabled] = useState(false);
  const [optimizationStats, setOptimizationStats] = useState<{
    spaceSaved: number;
    performanceImprovement: number;
    recommendations: string[];
  }>({
    spaceSaved: 0,
    performanceImprovement: 0,
    recommendations: []
  });

  // 啟用優化
  const enableOptimization = useCallback(() => {
    setOptimizationEnabled(true);
  }, []);

  // 停用優化
  const disableOptimization = useCallback(() => {
    setOptimizationEnabled(false);
  }, []);

  // 執行優化
  const runOptimization = useCallback(() => {
    // 這裡需要實作快取優化邏輯
    const recommendations = [
      '清除過期快取項目',
      '合併相似快取項目',
      '壓縮快取數據',
      '調整快取策略'
    ];

    setOptimizationStats({
      spaceSaved: Math.random() * 100,
      performanceImprovement: Math.random() * 50,
      recommendations
    });
  }, []);

  return {
    optimizationEnabled,
    optimizationStats,
    enableOptimization,
    disableOptimization,
    runOptimization
  };
}
