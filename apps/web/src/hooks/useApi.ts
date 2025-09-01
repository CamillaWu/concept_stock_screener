import { useState, useEffect, useCallback, useRef } from 'react';

// API 請求狀態
export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  isSuccess: boolean;
  isError: boolean;
}

// API 請求選項
export interface ApiOptions {
  enabled?: boolean;
  cacheTime?: number;
  staleTime?: number;
  retryCount?: number;
  retryDelay?: number;
  timeout?: number;
  headers?: Record<string, string>;
}

// 錯誤類型
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  timestamp: number;
}

// 快取項目
interface CacheItem<T> {
  data: T;
  timestamp: number;
  cacheTime: number;
  staleTime: number;
}

// 快取管理器
class CacheManager {
  private static instance: CacheManager;
  private cache = new Map<string, CacheItem<unknown>>();

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  set<T>(key: string, data: T, cacheTime: number = 5 * 60 * 1000, staleTime: number = 2 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      cacheTime,
      staleTime
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key) as CacheItem<T> | undefined;
    if (!item) return null;

    const now = Date.now();
    const isExpired = (now - item.timestamp) > item.cacheTime;

    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  isStale(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return true;

    const now = Date.now();
    return (now - item.timestamp) > item.staleTime;
  }

  clear(): void {
    this.cache.clear();
  }

  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// 錯誤處理器
class ErrorHandler {
  static createError(error: unknown): ApiError {
    if (error instanceof Error) {
      return {
        message: error.message,
        timestamp: Date.now()
      };
    }
    
    if (typeof error === 'string') {
      return {
        message: error,
        timestamp: Date.now()
      };
    }

    return {
      message: 'An unknown error occurred',
      timestamp: Date.now()
    };
  }

  static isNetworkError(error: unknown): boolean {
    return error instanceof Error && (
      error.name === 'TypeError' || 
      error.message.includes('fetch') ||
      error.message.includes('network')
    );
  }

  static isTimeoutError(error: unknown): boolean {
    return error instanceof Error && error.name === 'AbortError';
  }
}

// 重試機制
async function retryRequest<T>(
  requestFn: () => Promise<T>,
  retryCount: number = 3,
  retryDelay: number = 1000
): Promise<T> {
  let lastError: unknown;

  for (let i = 0; i <= retryCount; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      if (i === retryCount) {
        throw error;
      }

      // 只對網路錯誤進行重試
      if (!ErrorHandler.isNetworkError(error)) {
        throw error;
      }

      // 指數退避
      const delay = retryDelay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

// 主要 API Hook
export function useApi<T>(
  url: string,
  options: ApiOptions = {}
): ApiState<T> & {
  refetch: () => Promise<void>;
  clearCache: () => void;
  mutate: (data: T) => void;
} {
  const {
    enabled = true,
    cacheTime = 5 * 60 * 1000, // 5分鐘
    staleTime = 2 * 60 * 1000, // 2分鐘
    retryCount = 3,
    retryDelay = 1000,
    timeout = 10000,
    headers = {}
  } = options;

  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
    isSuccess: false,
    isError: false
  });

  const cache = CacheManager.getInstance();
  const abortControllerRef = useRef<AbortController | null>(null);
  const cacheKey = `${url}_${JSON.stringify(headers)}`;

  // 檢查快取
  const getCachedData = useCallback((): T | null => {
    return cache.get<T>(cacheKey);
  }, [cacheKey, cache]);

  // 設置快取
  const setCachedData = useCallback((data: T): void => {
    cache.set(cacheKey, data, cacheTime, staleTime);
  }, [cacheKey, cacheTime, staleTime, cache]);

  // 執行請求
  const executeRequest = useCallback(async (): Promise<void> => {
    if (!enabled) return;

    // 取消之前的請求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 創建新的 AbortController
    abortControllerRef.current = new AbortController();

    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      isSuccess: false,
      isError: false
    }));

    try {
      // 檢查快取
      const cachedData = getCachedData();
      if (cachedData && !cache.isStale(cacheKey)) {
        setState({
          data: cachedData,
          loading: false,
          error: null,
          isSuccess: true,
          isError: false
        });
        return;
      }

      // 執行請求
      const data = await retryRequest(
        async () => {
          const timeoutId = setTimeout(() => {
            abortControllerRef.current?.abort();
          }, timeout);

          try {
            const response = await fetch(url, {
              headers: {
                'Content-Type': 'application/json',
                ...headers
              },
              signal: abortControllerRef.current?.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            
            // 檢查 API 回應格式
            if (result && typeof result === 'object' && 'success' in result) {
              if (!result.success) {
                throw new Error(result.error || 'API request failed');
              }
              return result.data || result;
            }

            return result;
          } catch (error) {
            clearTimeout(timeoutId);
            throw error;
          }
        },
        retryCount,
        retryDelay
      );

      // 設置快取
      setCachedData(data);

      setState({
        data,
        loading: false,
        error: null,
        isSuccess: true,
        isError: false
      });

    } catch (error) {
      const apiError = ErrorHandler.createError(error);
      
      setState({
        data: null,
        loading: false,
        error: apiError.message,
        isSuccess: false,
        isError: true
      });
    }
  }, [url, enabled, cacheKey, cacheTime, staleTime, retryCount, retryDelay, timeout, headers, getCachedData, setCachedData]);

  // 重新獲取數據
  const refetch = useCallback(async (): Promise<void> => {
    await executeRequest();
  }, [executeRequest]);

  // 清除快取
  const clearCache = useCallback((): void => {
    cache.clear();
  }, [cache]);

  // 手動更新數據
  const mutate = useCallback((data: T): void => {
    setCachedData(data);
    setState(prev => ({
      ...prev,
      data,
      isSuccess: true,
      isError: false
    }));
  }, [setCachedData]);

  // 初始載入
  useEffect(() => {
    executeRequest();
  }, [executeRequest]);

  // 清理函數
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    ...state,
    refetch,
    clearCache,
    mutate
  };
}

// 導出快取管理器實例
export const cacheManager = CacheManager.getInstance();

// 導出錯誤處理器
export const errorHandler = ErrorHandler;
