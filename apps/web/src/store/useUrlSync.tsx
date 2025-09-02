import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSearchStore } from './searchStore';
import { useAppStore } from './appStore';

// URL 同步 Hook
function useUrlSyncInternal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const {
    query,
    mode,
    sort,
    filters,
    setQuery,
    setMode,
    setSort,
    setFilters,
  } = useSearchStore();
  
  const { searchMode, setSearchMode } = useAppStore();

  // 從 URL 讀取狀態並同步到 store
  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';
    const urlMode = (searchParams.get('mode') || 'theme') as 'theme' | 'stock';
    const urlSort = searchParams.get('sort') || 'popular';
    const urlFilters = searchParams.get('filters')?.split(',').filter(Boolean) || [];

    // 同步到搜尋 store
    if (urlQuery !== query) setQuery(urlQuery);
    if (urlMode !== mode) setMode(urlMode);
    if (urlSort !== sort) setSort(urlSort);
    if (JSON.stringify(urlFilters) !== JSON.stringify(filters)) setFilters(urlFilters);

    // 同步到應用 store
    if (urlMode !== searchMode) setSearchMode(urlMode);
  }, [searchParams, query, mode, sort, filters, searchMode, setQuery, setMode, setSort, setFilters, setSearchMode]);

  // 從 store 同步狀態到 URL
  useEffect(() => {
    const params = new URLSearchParams();

    if (query) params.set('q', query);
    if (mode) params.set('mode', mode);
    if (sort) params.set('sort', sort);
    if (filters.length > 0) {
      params.set('filters', filters.join(','));
    }

    const newUrl = params.toString() ? `?${params.toString()}` : '';
    const currentUrl = window.location.search;
    
    if (newUrl !== currentUrl) {
      router.replace(newUrl, { scroll: false });
    }
  }, [query, mode, sort, filters, router]);

  // 清除 URL 狀態
  const clearUrlState = () => {
    router.replace('', { scroll: false });
  };

  return {
    clearUrlState,
  };
}

// Suspense 包圍的 URL 同步組件
export function UrlSyncProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UrlSyncInner />
      {children}
    </Suspense>
  );
}

function UrlSyncInner() {
  useUrlSyncInternal();
  return null;
}

// 導出 Hook 供組件使用
export function useUrlSync() {
  return useUrlSyncInternal();
}
