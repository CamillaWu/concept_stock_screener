const FAVORITES_KEY = 'favStocks:v1';
const MAX_FAVORITES = 100;

export interface FavoriteTheme {
  id: string;
  theme: string;
  addedAt: number;
}

// 獲取收藏列表
export function getFavorites(): FavoriteTheme[] {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (!stored) return [];
    
    const favorites = JSON.parse(stored) as FavoriteTheme[];
    return Array.isArray(favorites) ? favorites : [];
  } catch (error) {
    console.error('Failed to load favorites:', error);
    return [];
  }
}

// 切換收藏狀態
export function toggleFavorite(themeId: string, themeName: string): FavoriteTheme[] {
  try {
    const favorites = getFavorites();
    const existingIndex = favorites.findIndex(fav => fav.id === themeId);
    
    if (existingIndex >= 0) {
      // 移除收藏
      favorites.splice(existingIndex, 1);
    } else {
      // 新增收藏
      if (favorites.length >= MAX_FAVORITES) {
        // 移除最舊的收藏
        favorites.shift();
      }
      
      favorites.push({
        id: themeId,
        theme: themeName,
        addedAt: Date.now(),
      });
    }
    
    // 按新增時間排序（最新的在前）
    favorites.sort((a, b) => b.addedAt - a.addedAt);
    
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return favorites;
  } catch (error) {
    console.error('Failed to toggle favorite:', error);
    return getFavorites();
  }
}

// 檢查是否已收藏
export function isFavorite(themeId: string): boolean {
  const favorites = getFavorites();
  return favorites.some(fav => fav.id === themeId);
}

// 移除收藏
export function removeFavorite(themeId: string): FavoriteTheme[] {
  try {
    const favorites = getFavorites();
    const filtered = favorites.filter(fav => fav.id !== themeId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (error) {
    console.error('Failed to remove favorite:', error);
    return getFavorites();
  }
}

// 清空所有收藏
export function clearFavorites(): void {
  try {
    localStorage.removeItem(FAVORITES_KEY);
  } catch (error) {
    console.error('Failed to clear favorites:', error);
  }
}

// 獲取收藏統計
export function getFavoritesStats() {
  const favorites = getFavorites();
  return {
    count: favorites.length,
    maxCount: MAX_FAVORITES,
    isFull: favorites.length >= MAX_FAVORITES,
  };
}

// 匯出收藏資料（用於備份）
export function exportFavorites(): string {
  try {
    const favorites = getFavorites();
    return JSON.stringify(favorites, null, 2);
  } catch (error) {
    console.error('Failed to export favorites:', error);
    return '[]';
  }
}

// 匯入收藏資料（用於恢復）
export function importFavorites(data: string): boolean {
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
    
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(validFavorites));
    return true;
  } catch (error) {
    console.error('Failed to import favorites:', error);
    return false;
  }
}
