import { useCallback, useEffect, useRef, useState } from 'react';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface UseApiOptions<T> {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

// ... interface update needs to be done too, but assuming replace_file_content replaces chunk
interface ExecuteOptions {
  params?: Record<string, string>;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (options?: ExecuteOptions) => Promise<void>; // Updated signature
  reset: () => void;
}

export function useApi<T>({
  url,
  method = 'GET',
  body,
  headers = {},
  immediate = false,
  onSuccess,
  onError,
}: UseApiOptions<T>): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const immediateRef = useRef(immediate);

  const execute = useCallback(
    async (options?: ExecuteOptions) => {
      setLoading(true);
      setError(null);

      try {
        let requestUrl = url;
        if (options?.params) {
          const separator = requestUrl.includes('?') ? '&' : '?';
          const queryString = new URLSearchParams(options.params).toString();
          requestUrl = `${requestUrl}${separator}${queryString}`;
        }

        const requestOptions: {
          method: string;
          headers: Record<string, string>;
          body?: string;
        } = {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
        };

        if (body && method !== 'GET') {
          requestOptions.body = JSON.stringify(body);
        }

        const response = await fetch(requestUrl, requestOptions);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ApiResponse<T> = await response.json();

        if (result.success) {
          setData(result.data || null);
          onSuccess?.(result.data as T);
        } else {
          throw new Error(result.error || 'API 請求失敗');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '未知錯誤';
        setError(errorMessage);
        onError?.(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [url, method, body, headers, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (immediateRef.current) {
      immediateRef.current = false; // 防止重複執行
      execute();
    }
  }, []); // 只在組件掛載時執行一次

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}
