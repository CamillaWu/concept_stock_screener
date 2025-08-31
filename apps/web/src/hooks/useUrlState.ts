import { useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export interface UrlState {
  mode?: 'theme' | 'stock';
  query?: string;
  sort?: string;
  filters?: string[];
}

export function useUrlState() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 讀取 URL 狀態
  const getUrlState = useCallback((): UrlState => {
    const mode = searchParams.get('mode') as 'theme' | 'stock' | null;
    const query = searchParams.get('q');
    const sort = searchParams.get('sort');
    const filters = searchParams.get('filters')?.split(',').filter(Boolean) || [];

    return {
      mode: mode || undefined,
      query: query || undefined,
      sort: sort || undefined,
      filters: filters.length > 0 ? filters : undefined
    };
  }, [searchParams]);

  // 更新 URL 狀態
  const updateUrlState = useCallback((updates: Partial<UrlState>) => {
    const currentState = getUrlState();
    const newState = { ...currentState, ...updates };

    const params = new URLSearchParams();

    if (newState.mode) params.set('mode', newState.mode);
    if (newState.query) params.set('q', newState.query);
    if (newState.sort) params.set('sort', newState.sort);
    if (newState.filters && newState.filters.length > 0) {
      params.set('filters', newState.filters.join(','));
    }

    const newUrl = params.toString() ? `?${params.toString()}` : '';
    
    // 使用 replace 避免在瀏覽器歷史中創建新條目
    router.replace(newUrl, { scroll: false });
  }, [router, getUrlState]);

  // 清除 URL 狀態
  const clearUrlState = useCallback(() => {
    router.replace('', { scroll: false });
  }, [router]);

  // 設置搜尋模式
  const setSearchMode = useCallback((mode: 'theme' | 'stock') => {
    updateUrlState({ mode });
  }, [updateUrlState]);

  // 設置搜尋查詢
  const setSearchQuery = useCallback((query: string) => {
    updateUrlState({ query });
  }, [updateUrlState]);

  // 設置排序
  const setSort = useCallback((sort: string) => {
    updateUrlState({ sort });
  }, [updateUrlState]);

  // 設置篩選器
  const setFilters = useCallback((filters: string[]) => {
    updateUrlState({ filters });
  }, [updateUrlState]);

  // 切換篩選器
  const toggleFilter = useCallback((filter: string) => {
    const currentState = getUrlState();
    const currentFilters = currentState.filters || [];
    
    const newFilters = currentFilters.includes(filter)
      ? currentFilters.filter(f => f !== filter)
      : [...currentFilters, filter];
    
    updateUrlState({ filters: newFilters });
  }, [getUrlState, updateUrlState]);

  // 清除篩選器
  const clearFilters = useCallback(() => {
    updateUrlState({ filters: undefined });
  }, [updateUrlState]);

  return {
    urlState: getUrlState(),
    updateUrlState,
    clearUrlState,
    setSearchMode,
    setSearchQuery,
    setSort,
    setFilters,
    toggleFilter,
    clearFilters
  };
}

// 本地儲存 Hook
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return defaultValue;
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  const setStoredValue = useCallback((newValue: T | ((val: T) => T)) => {
    try {
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
      setValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, value]);

  return [value, setStoredValue] as const;
}

// 會話儲存 Hook
export function useSessionStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return defaultValue;
    
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  const setStoredValue = useCallback((newValue: T | ((val: T) => T)) => {
    try {
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
      setValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error);
    }
  }, [key, value]);

  return [value, setStoredValue] as const;
}
