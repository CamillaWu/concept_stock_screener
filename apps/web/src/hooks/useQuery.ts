import { useEffect, useRef, useState, useCallback } from 'react';
import { ApiError, ErrorHandler } from '../services/api';

interface UseQueryOptions<T> {
  ttl?: number; // 快取時間（毫秒）
  retryCount?: number; // 重試次數
  retryDelay?: number; // 重試延遲（毫秒）
  debounceMs?: number; // 防抖時間（毫秒）
  enabled?: boolean; // 是否啟用查詢
}

interface UseQueryResult<T> {
  data: T | undefined;
  error: ApiError | null;
  loading: boolean;
  refetch: () => void;
}

// 全域快取
const globalCache = new Map<string, { data: any; timestamp: number }>();

export function useQuery<T>(
  key: string,
  queryFn: () => Promise<T>,
  options: UseQueryOptions<T> = {}
): UseQueryResult<T> {
  const {
    ttl = 60000, // 預設 60 秒
    retryCount = 1,
    retryDelay = 800,
    debounceMs = 300,
    enabled = true,
  } = options;

  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(false);
  
  const debounceRef = useRef<NodeJS.Timeout>();
  const retryCountRef = useRef(0);
  const abortControllerRef = useRef<AbortController>();

  // 檢查快取是否有效
  const getCachedData = useCallback((): T | undefined => {
    const cached = globalCache.get(key);
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data;
    }
    return undefined;
  }, [key, ttl]);

  // 執行查詢
  const executeQuery = useCallback(async (isRetry = false): Promise<void> => {
    if (!enabled) return;

    // 如果不是重試，先檢查快取
    if (!isRetry) {
      const cachedData = getCachedData();
      if (cachedData) {
        setData(cachedData);
        setError(null);
        return;
      }
    }

    // 取消之前的請求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const result = await queryFn();
      
      // 儲存到快取
      globalCache.set(key, {
        data: result,
        timestamp: Date.now(),
      });

      setData(result);
      setError(null);
      retryCountRef.current = 0;
    } catch (err) {
      const apiError = err as ApiError;
      
      // 如果是可重試的錯誤且未超過重試次數
      if (ErrorHandler.isRetryable(apiError) && retryCountRef.current < retryCount) {
        retryCountRef.current++;
        setTimeout(() => {
          executeQuery(true);
        }, retryDelay);
        return;
      }

      setError(apiError);
      setData(undefined);
      retryCountRef.current = 0;
    } finally {
      setLoading(false);
    }
  }, [key, queryFn, enabled, ttl, retryCount, retryDelay, getCachedData]);

  // 防抖查詢
  const debouncedQuery = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      executeQuery();
    }, debounceMs);
  }, [executeQuery, debounceMs]);

  // 手動重新查詢
  const refetch = useCallback(() => {
    retryCountRef.current = 0;
    executeQuery();
  }, [executeQuery]);

  // 初始化查詢
  useEffect(() => {
    if (enabled) {
      debouncedQuery();
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [enabled, debouncedQuery]);

  // 清理快取的工具函數
  const clearCache = useCallback(() => {
    globalCache.delete(key);
  }, [key]);

  // 暴露清理快取方法
  (refetch as any).clearCache = clearCache;

  return {
    data,
    error,
    loading,
    refetch,
  };
}

// 快取管理工具
export const CacheManager = {
  // 清理所有快取
  clearAll() {
    globalCache.clear();
  },

  // 清理過期的快取
  clearExpired() {
    const now = Date.now();
    for (const [key, value] of globalCache.entries()) {
      if (now - value.timestamp > 60000) { // 預設 60 秒過期
        globalCache.delete(key);
      }
    }
  },

  // 獲取快取統計
  getStats() {
    return {
      size: globalCache.size,
      keys: Array.from(globalCache.keys()),
    };
  },
};
