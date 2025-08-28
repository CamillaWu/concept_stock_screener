// URL 狀態管理工具

export interface UrlState {
  mode: 'theme' | 'stock';
  q: string;
}

// 從 URL 讀取狀態
export function readUrlState(): UrlState {
  try {
    const url = new URL(window.location.href);
    const mode = (url.searchParams.get('mode') || 'theme') as 'theme' | 'stock';
    const q = url.searchParams.get('q') || '';
    
    return { mode, q };
  } catch (error) {
    console.error('Failed to read URL state:', error);
    return { mode: 'theme', q: '' };
  }
}

// 寫入狀態到 URL
export function writeUrlState(state: Partial<UrlState>): void {
  try {
    const url = new URL(window.location.href);
    
    if (state.mode !== undefined) {
      url.searchParams.set('mode', state.mode);
    }
    
    if (state.q !== undefined) {
      if (state.q.trim()) {
        url.searchParams.set('q', state.q.trim());
      } else {
        url.searchParams.delete('q');
      }
    }
    
    // 使用 pushState 避免重新載入頁面
    window.history.pushState({}, '', url.toString());
  } catch (error) {
    console.error('Failed to write URL state:', error);
  }
}

// 更新單一參數
export function updateUrlParam(key: keyof UrlState, value: string): void {
  try {
    const url = new URL(window.location.href);
    
    if (value.trim()) {
      url.searchParams.set(key, value.trim());
    } else {
      url.searchParams.delete(key);
    }
    
    window.history.pushState({}, '', url.toString());
  } catch (error) {
    console.error('Failed to update URL param:', error);
  }
}

// 清除所有參數
export function clearUrlState(): void {
  try {
    const url = new URL(window.location.href);
    url.searchParams.delete('mode');
    url.searchParams.delete('q');
    window.history.pushState({}, '', url.toString());
  } catch (error) {
    console.error('Failed to clear URL state:', error);
  }
}

// 監聽 URL 變化
export function useUrlStateListener(callback: (state: UrlState) => void): () => void {
  const handlePopState = () => {
    const state = readUrlState();
    callback(state);
  };

  window.addEventListener('popstate', handlePopState);
  
  return () => {
    window.removeEventListener('popstate', handlePopState);
  };
}

// 獲取當前 URL 的完整狀態
export function getCurrentUrlState(): string {
  try {
    return window.location.href;
  } catch (error) {
    console.error('Failed to get current URL state:', error);
    return '';
  }
}

// 檢查 URL 是否包含有效狀態
export function hasValidUrlState(): boolean {
  const state = readUrlState();
  return state.q.trim().length > 0;
}

// 生成分享連結
export function generateShareUrl(state: UrlState): string {
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('mode', state.mode);
    if (state.q.trim()) {
      url.searchParams.set('q', state.q.trim());
    }
    return url.toString();
  } catch (error) {
    console.error('Failed to generate share URL:', error);
    return window.location.href;
  }
}
