import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 搜尋狀態類型
export interface SearchState {
  // 搜尋查詢
  query: string;
  
  // 搜尋模式
  mode: 'theme' | 'stock';
  
  // 排序方式
  sort: string;
  
  // 篩選器
  filters: string[];
  
  // 搜尋歷史
  searchHistory: string[];
  
  // 最大歷史記錄數
  maxHistory: number;
  
  // 載入狀態
  loading: boolean;
  
  // 錯誤狀態
  error: string | null;
}

// 搜尋操作類型
export interface SearchActions {
  // 設置搜尋查詢
  setQuery: (query: string) => void;
  
  // 設置搜尋模式
  setMode: (mode: 'theme' | 'stock') => void;
  
  // 設置排序方式
  setSort: (sort: string) => void;
  
  // 設置篩選器
  setFilters: (filters: string[]) => void;
  
  // 切換篩選器
  toggleFilter: (filter: string) => void;
  
  // 清除篩選器
  clearFilters: () => void;
  
  // 添加搜尋歷史
  addToHistory: (query: string) => void;
  
  // 清除搜尋歷史
  clearHistory: () => void;
  
  // 移除特定歷史記錄
  removeFromHistory: (query: string) => void;
  
  // 設置載入狀態
  setLoading: (loading: boolean) => void;
  
  // 設置錯誤狀態
  setError: (error: string | null) => void;
  
  // 清除錯誤
  clearError: () => void;
  
  // 重置搜尋狀態
  reset: () => void;
}

// 初始狀態
const initialState: SearchState = {
  query: '',
  mode: 'theme',
  sort: 'popular',
  filters: [],
  searchHistory: [],
  maxHistory: 20,
  loading: false,
  error: null,
};

// 創建搜尋狀態 store
export const useSearchStore = create<SearchState & SearchActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setQuery: (query) => {
        set({ query });
      },
      
      setMode: (mode) => {
        set({ mode });
      },
      
      setSort: (sort) => {
        set({ sort });
      },
      
      setFilters: (filters) => {
        set({ filters });
      },
      
      toggleFilter: (filter) => {
        const { filters } = get();
        const newFilters = filters.includes(filter)
          ? filters.filter(f => f !== filter)
          : [...filters, filter];
        set({ filters: newFilters });
      },
      
      clearFilters: () => {
        set({ filters: [] });
      },
      
      addToHistory: (query) => {
        const { searchHistory, maxHistory } = get();
        const trimmedQuery = query.trim();
        
        if (!trimmedQuery) return;
        
        // 移除重複的查詢
        const filteredHistory = searchHistory.filter(h => h !== trimmedQuery);
        
        // 添加到開頭
        const newHistory = [trimmedQuery, ...filteredHistory];
        
        // 限制歷史記錄數量
        if (newHistory.length > maxHistory) {
          newHistory.splice(maxHistory);
        }
        
        set({ searchHistory: newHistory });
      },
      
      clearHistory: () => {
        set({ searchHistory: [] });
      },
      
      removeFromHistory: (query) => {
        const { searchHistory } = get();
        const newHistory = searchHistory.filter(h => h !== query);
        set({ searchHistory: newHistory });
      },
      
      setLoading: (loading) => {
        set({ loading });
      },
      
      setError: (error) => {
        set({ error });
      },
      
      clearError: () => {
        set({ error: null });
      },
      
      reset: () => {
        set({
          query: '',
          sort: 'popular',
          filters: [],
          loading: false,
          error: null,
        });
      },
    }),
    {
      name: 'search-store',
      // 持久化搜尋相關狀態
      partialize: (state) => ({
        mode: state.mode,
        sort: state.sort,
        filters: state.filters,
        searchHistory: state.searchHistory,
      }),
    }
  )
);
