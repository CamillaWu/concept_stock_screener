import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 收藏主題類型
export interface FavoriteTheme {
  id: string;
  theme: string;
  addedAt: number;
}

// 收藏狀態類型
export interface FavoritesState {
  // 收藏列表
  favorites: FavoriteTheme[];
  
  // 最大收藏數量
  maxFavorites: number;
  
  // 載入狀態
  loading: boolean;
  
  // 錯誤狀態
  error: string | null;
}

// 收藏操作類型
export interface FavoritesActions {
  // 切換收藏狀態
  toggleFavorite: (themeId: string, themeName: string) => void;
  
  // 移除收藏
  removeFavorite: (themeId: string) => void;
  
  // 清空所有收藏
  clearFavorites: () => void;
  
  // 檢查是否已收藏
  isFavorite: (themeId: string) => boolean;
  
  // 獲取收藏統計
  getFavoritesStats: () => {
    count: number;
    maxCount: number;
    isFull: boolean;
  };
  
  // 匯出收藏資料
  exportFavorites: () => string;
  
  // 匯入收藏資料
  importFavorites: (data: string) => boolean;
  
  // 設置載入狀態
  setLoading: (loading: boolean) => void;
  
  // 設置錯誤狀態
  setError: (error: string | null) => void;
  
  // 清除錯誤
  clearError: () => void;
}

// 初始狀態
const initialState: FavoritesState = {
  favorites: [],
  maxFavorites: 100,
  loading: false,
  error: null,
};

// 創建收藏狀態 store
export const useFavoritesStore = create<FavoritesState & FavoritesActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      toggleFavorite: (themeId, themeName) => {
        const { favorites, maxFavorites } = get();
        const existingIndex = favorites.findIndex(fav => fav.id === themeId);
        
        let newFavorites: FavoriteTheme[];
        
        if (existingIndex >= 0) {
          // 移除收藏
          newFavorites = favorites.filter(fav => fav.id !== themeId);
        } else {
          // 新增收藏
          if (favorites.length >= maxFavorites) {
            // 移除最舊的收藏
            newFavorites = [...favorites.slice(1), {
              id: themeId,
              theme: themeName,
              addedAt: Date.now(),
            }];
          } else {
            newFavorites = [...favorites, {
              id: themeId,
              theme: themeName,
              addedAt: Date.now(),
            }];
          }
          
          // 按新增時間排序（最新的在前）
          newFavorites.sort((a, b) => b.addedAt - a.addedAt);
        }
        
        set({ favorites: newFavorites });
      },
      
      removeFavorite: (themeId) => {
        const { favorites } = get();
        const newFavorites = favorites.filter(fav => fav.id !== themeId);
        set({ favorites: newFavorites });
      },
      
      clearFavorites: () => {
        set({ favorites: [] });
      },
      
      isFavorite: (themeId) => {
        const { favorites } = get();
        return favorites.some(fav => fav.id === themeId);
      },
      
      getFavoritesStats: () => {
        const { favorites, maxFavorites } = get();
        return {
          count: favorites.length,
          maxCount: maxFavorites,
          isFull: favorites.length >= maxFavorites,
        };
      },
      
      exportFavorites: () => {
        const { favorites } = get();
        return JSON.stringify(favorites, null, 2);
      },
      
      importFavorites: (data) => {
        try {
          const favorites = JSON.parse(data) as FavoriteTheme[];
          if (!Array.isArray(favorites)) {
            throw new Error('Invalid data format');
          }
          
          // 驗證資料格式
          const validFavorites = favorites.filter(fav => 
            fav.id && 
            fav.theme && 
            typeof fav.addedAt === 'number'
          );
          
          set({ favorites: validFavorites });
          return true;
        } catch (error) {
          console.error('Failed to import favorites:', error);
          return false;
        }
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
    }),
    {
      name: 'favorites-store',
      // 持久化收藏資料
      partialize: (state) => ({
        favorites: state.favorites,
      }),
    }
  )
);
