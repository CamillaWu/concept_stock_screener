const BASE_URL = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8787';

// 錯誤碼類型
export interface ApiError {
  code: 'invalid_mode' | 'no_results' | 'rate_limited' | 'internal_error';
  message: string;
  trace_id?: string;
}

// 通用 HTTP 請求函數
async function httpRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000); // 3秒超時

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        code: 'internal_error',
        message: `HTTP ${response.status}`,
      }));
      throw errorData;
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw {
          code: 'internal_error',
          message: '請求超時',
        } as ApiError;
      }
    }
    
    throw error;
  }
}

// API 服務類
export const Api = {
  // 獲取熱門主題清單
  async getTrending(): Promise<any[]> {
    return httpRequest<any[]>('/trending');
  },

  // 搜尋主題
  async searchTheme(query: string): Promise<any> {
    return httpRequest<any>(`/search?mode=theme&q=${encodeURIComponent(query)}`);
  },

  // 搜尋個股
  async searchStock(query: string): Promise<any> {
    return httpRequest<any>(`/search?mode=stock&q=${encodeURIComponent(query)}`);
  },

  // 通用搜尋（根據模式）
  async search(mode: 'theme' | 'stock', query: string): Promise<any> {
    if (!['theme', 'stock'].includes(mode)) {
      throw {
        code: 'invalid_mode',
        message: 'mode must be theme or stock',
      } as ApiError;
    }

    if (!query.trim()) {
      throw {
        code: 'no_results',
        message: 'q required',
      } as ApiError;
    }

    return httpRequest<any>(`/search?mode=${mode}&q=${encodeURIComponent(query.trim())}`);
  },
};

// 錯誤處理工具
export const ErrorHandler = {
  // 判斷是否為可重試的錯誤
  isRetryable(error: ApiError): boolean {
    return error.code === 'rate_limited' || error.code === 'internal_error';
  },

  // 判斷是否為空結果錯誤
  isEmptyResult(error: ApiError): boolean {
    return error.code === 'no_results';
  },

  // 獲取用戶友好的錯誤訊息
  getFriendlyMessage(error: ApiError): string {
    switch (error.code) {
      case 'invalid_mode':
        return '搜尋模式錯誤';
      case 'no_results':
        return '找不到相關結果';
      case 'rate_limited':
        return '請求過於頻繁，請稍後再試';
      case 'internal_error':
        return '服務暫時無法使用，請稍後再試';
      default:
        return error.message || '發生未知錯誤';
    }
  },
};
