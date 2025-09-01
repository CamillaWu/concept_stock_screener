import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// UI 狀態類型
export interface UIState {
  // 側邊欄狀態
  sidebarCollapsed: boolean;
  
  // 快捷鍵提示顯示
  showShortcuts: boolean;
  
  // 主題切換
  theme: 'light' | 'dark' | 'auto';
  
  // 語言設定
  language: 'zh-TW' | 'en-US';
  
  // 動畫效果
  animationsEnabled: boolean;
  
  // 響應式斷點
  breakpoint: 'mobile' | 'tablet' | 'desktop';
  
  // 載入狀態
  loading: boolean;
  
  // 錯誤狀態
  error: string | null;
}

// UI 操作類型
export interface UIActions {
  // 切換側邊欄狀態
  toggleSidebar: () => void;
  
  // 設置側邊欄狀態
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // 切換快捷鍵提示
  toggleShortcuts: () => void;
  
  // 設置快捷鍵提示顯示
  setShowShortcuts: (show: boolean) => void;
  
  // 設置主題
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  
  // 設置語言
  setLanguage: (language: 'zh-TW' | 'en-US') => void;
  
  // 切換動畫效果
  toggleAnimations: () => void;
  
  // 設置動畫效果
  setAnimationsEnabled: (enabled: boolean) => void;
  
  // 設置響應式斷點
  setBreakpoint: (breakpoint: 'mobile' | 'tablet' | 'desktop') => void;
  
  // 設置載入狀態
  setLoading: (loading: boolean) => void;
  
  // 設置錯誤狀態
  setError: (error: string | null) => void;
  
  // 清除錯誤
  clearError: () => void;
  
  // 重置 UI 狀態
  reset: () => void;
}

// 初始狀態
const initialState: UIState = {
  sidebarCollapsed: false,
  showShortcuts: false,
  theme: 'light',
  language: 'zh-TW',
  animationsEnabled: true,
  breakpoint: 'desktop',
  loading: false,
  error: null,
};

// 創建 UI 狀態 store
export const useUIStore = create<UIState & UIActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      toggleSidebar: () => {
        const { sidebarCollapsed } = get();
        set({ sidebarCollapsed: !sidebarCollapsed });
      },
      
      setSidebarCollapsed: (collapsed) => {
        set({ sidebarCollapsed: collapsed });
      },
      
      toggleShortcuts: () => {
        const { showShortcuts } = get();
        set({ showShortcuts: !showShortcuts });
      },
      
      setShowShortcuts: (show) => {
        set({ showShortcuts: show });
      },
      
      setTheme: (theme) => {
        set({ theme });
        // 應用主題到 DOM
        if (typeof window !== 'undefined') {
          document.documentElement.setAttribute('data-theme', theme);
        }
      },
      
      setLanguage: (language) => {
        set({ language });
      },
      
      toggleAnimations: () => {
        const { animationsEnabled } = get();
        set({ animationsEnabled: !animationsEnabled });
      },
      
      setAnimationsEnabled: (enabled) => {
        set({ animationsEnabled: enabled });
      },
      
      setBreakpoint: (breakpoint) => {
        set({ breakpoint });
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
      name: 'ui-store',
      // 持久化 UI 設定
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
        language: state.language,
        animationsEnabled: state.animationsEnabled,
      }),
    }
  )
);
