import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StockConcept, StockAnalysisResult } from '@concepts-radar/types';

// 應用狀態類型
export interface AppState {
  // 選中的主題和股票
  selectedTheme: StockConcept | null;
  selectedStock: StockAnalysisResult | null;
  
  // 搜尋模式
  searchMode: 'theme' | 'stock';
  
  // 資料來源
  useRealData: boolean;
  
  // 載入狀態
  loading: boolean;
  
  // 錯誤狀態
  error: string | null;
}

// 應用操作類型
export interface AppActions {
  // 設置選中的主題
  setSelectedTheme: (theme: StockConcept | null) => void;
  
  // 設置選中的股票
  setSelectedStock: (stock: StockAnalysisResult | null) => void;
  
  // 設置搜尋模式
  setSearchMode: (mode: 'theme' | 'stock') => void;
  
  // 切換資料來源
  setUseRealData: (useReal: boolean) => void;
  
  // 設置載入狀態
  setLoading: (loading: boolean) => void;
  
  // 設置錯誤狀態
  setError: (error: string | null) => void;
  
  // 清除錯誤
  clearError: () => void;
  
  // 重置狀態
  reset: () => void;
}

// 初始狀態
const initialState: AppState = {
  selectedTheme: null,
  selectedStock: null,
  searchMode: 'theme',
  useRealData: false,
  loading: false,
  error: null,
};

// 創建應用狀態 store
export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setSelectedTheme: (theme) => {
        set({ selectedTheme: theme, selectedStock: null });
      },
      
      setSelectedStock: (stock) => {
        set({ selectedStock: stock, selectedTheme: null });
      },
      
      setSearchMode: (mode) => {
        set({ searchMode: mode });
      },
      
      setUseRealData: (useReal) => {
        set({ useRealData: useReal });
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
        set(initialState);
      },
    }),
    {
      name: 'app-store',
      // 只持久化部分狀態
      partialize: (state) => ({
        searchMode: state.searchMode,
        useRealData: state.useRealData,
      }),
    }
  )
);
