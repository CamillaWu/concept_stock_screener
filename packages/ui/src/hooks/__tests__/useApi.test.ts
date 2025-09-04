import { act, renderHook, waitFor } from '@testing-library/react';
import { useApi } from '../useApi';

// 模擬 fetch
global.fetch = jest.fn();

describe('useApi Hook', () => {
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    mockFetch.mockClear();
    jest.clearAllMocks();
  });

  describe('基本功能', () => {
    it('應該返回正確的初始狀態', () => {
      const { result } = renderHook(() =>
        useApi({
          url: '/api/test',
        })
      );

      expect(result.current.data).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(typeof result.current.execute).toBe('function');
      expect(typeof result.current.reset).toBe('function');
    });

    it('應該支援自定義配置', () => {
      const { result } = renderHook(() =>
        useApi({
          url: '/api/test',
          method: 'POST',
          body: { test: 'data' },
          headers: { 'Custom-Header': 'value' },
        })
      );

      expect(result.current.data).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('execute 方法', () => {
    it('應該在執行時設置 loading 狀態', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: 'test' }),
      } as Response);

      const { result } = renderHook(() =>
        useApi({
          url: '/api/test',
        })
      );

      act(() => {
        result.current.execute();
      });

      expect(result.current.loading).toBe(true);
    });

    it('應該成功處理 API 響應', async () => {
      const mockData = { id: 1, name: 'test' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockData }),
      } as Response);

      const { result } = renderHook(() =>
        useApi({
          url: '/api/test',
        })
      );

      act(() => {
        result.current.execute();
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.data).toEqual(mockData);
        expect(result.current.error).toBeNull();
      });
    });

    it('應該處理 API 錯誤響應', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

      const { result } = renderHook(() =>
        useApi({
          url: '/api/test',
        })
      );

      act(() => {
        result.current.execute();
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.data).toBeNull();
        expect(result.current.error).toBe('HTTP error! status: 500');
      });
    });

    it('應該處理網絡錯誤', async () => {
      const networkError = new Error('Network error');
      mockFetch.mockRejectedValueOnce(networkError);

      const { result } = renderHook(() =>
        useApi({
          url: '/api/test',
        })
      );

      act(() => {
        result.current.execute();
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.data).toBeNull();
        expect(result.current.error).toBe('Network error');
      });
    });

    it('應該處理 JSON 解析錯誤', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      } as Response);

      const { result } = renderHook(() =>
        useApi({
          url: '/api/test',
        })
      );

      act(() => {
        result.current.execute();
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.data).toBeNull();
        expect(result.current.error).toBe('Invalid JSON');
      });
    });
  });

  describe('回調函數', () => {
    it('應該在成功時調用 onSuccess', async () => {
      const onSuccess = jest.fn();
      const mockData = { id: 1, name: 'test' };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockData }),
      } as Response);

      const { result } = renderHook(() =>
        useApi({
          url: '/api/test',
          onSuccess,
        })
      );

      act(() => {
        result.current.execute();
      });

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledWith(mockData);
      });
    });

    it('應該在錯誤時調用 onError', async () => {
      const onError = jest.fn();
      const errorMessage = 'API error';

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: false, error: errorMessage }),
      } as Response);

      const { result } = renderHook(() =>
        useApi({
          url: '/api/test',
          onError,
        })
      );

      act(() => {
        result.current.execute();
      });

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(errorMessage);
      });
    });
  });

  describe('HTTP 方法支援', () => {
    it('應該支援 GET 請求', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: 'get-data' }),
      } as Response);

      const { result } = renderHook(() =>
        useApi({
          url: '/api/test',
          method: 'GET',
        })
      );

      act(() => {
        result.current.execute();
      });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/test',
          expect.objectContaining({
            method: 'GET',
          })
        );
      });
    });

    it('應該支援 POST 請求', async () => {
      const postData = { name: 'test' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: 'post-data' }),
      } as Response);

      const { result } = renderHook(() =>
        useApi({
          url: '/api/test',
          method: 'POST',
          body: postData,
        })
      );

      act(() => {
        result.current.execute();
      });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/test',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(postData),
          })
        );
      });
    });

    it('應該支援自定義請求頭', async () => {
      const customHeaders = { Authorization: 'Bearer token' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: 'data' }),
      } as Response);

      const { result } = renderHook(() =>
        useApi({
          url: '/api/test',
          headers: customHeaders,
        })
      );

      act(() => {
        result.current.execute();
      });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/test',
          expect.objectContaining({
            headers: expect.objectContaining({
              'Content-Type': 'application/json',
              Authorization: 'Bearer token',
            }),
          })
        );
      });
    });
  });

  describe('reset 方法', () => {
    it('應該重置所有狀態', async () => {
      const mockData = { id: 1, name: 'test' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockData }),
      } as Response);

      const { result } = renderHook(() =>
        useApi({
          url: '/api/test',
        })
      );

      // 先執行一次成功的請求
      act(() => {
        result.current.execute();
      });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData);
        expect(result.current.loading).toBe(false);
      });

      // 重置狀態
      act(() => {
        result.current.reset();
      });

      expect(result.current.data).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('immediate 執行', () => {
    it('應該在 immediate=true 時自動執行', async () => {
      const mockData = { id: 1, name: 'test' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockData }),
      } as Response);

      renderHook(() =>
        useApi({
          url: '/api/test',
          immediate: true,
        })
      );

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(1);
      });
    });

    it('應該在 immediate=false 時不自動執行', () => {
      renderHook(() =>
        useApi({
          url: '/api/test',
          immediate: false,
        })
      );

      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('錯誤處理邊界情況', () => {
    it('應該處理空的響應數據', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      const { result } = renderHook(() =>
        useApi({
          url: '/api/test',
        })
      );

      act(() => {
        result.current.execute();
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.data).toBeNull();
        expect(result.current.error).toBeNull();
      });
    });

    it('應該處理非標準錯誤響應', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: false }),
      } as Response);

      const { result } = renderHook(() =>
        useApi({
          url: '/api/test',
        })
      );

      act(() => {
        result.current.execute();
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.data).toBeNull();
        expect(result.current.error).toBe('API 請求失敗');
      });
    });
  });

  describe('並發請求處理', () => {
    it('應該正確處理多個並發請求', async () => {
      const mockData1 = { id: 1, name: 'request1' };
      const mockData2 = { id: 2, name: 'request2' };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: mockData1 }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: mockData2 }),
        } as Response);

      const { result } = renderHook(() =>
        useApi({
          url: '/api/test',
        })
      );

      // 發起第一個請求
      act(() => {
        result.current.execute();
      });

      // 立即發起第二個請求
      act(() => {
        result.current.execute();
      });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(2);
      });
    });
  });
});
