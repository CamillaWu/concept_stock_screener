// 統一狀態管理入口
export { useAppStore } from './appStore';
export { useFavoritesStore } from './favoritesStore';
export { useSearchStore } from './searchStore';
export { useUIStore } from './uiStore';

// 類型定義
export type { AppState, AppActions } from './appStore';
export type { FavoritesState, FavoritesActions } from './favoritesStore';
export type { SearchState, SearchActions } from './searchStore';
export type { UIState, UIActions } from './uiStore';
