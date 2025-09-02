import { renderHook, waitFor } from '@testing-library/react';
import { useApi, useTrendingThemes, useRagSearch } from '../src/hooks';

// Mock fetch
global.fetch = jest.fn();

describe('API Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useApi', () => {
    it('should handle successful API calls', async () => {
      const mockData = { id: 1, name: 'Test' };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const { result } = renderHook(() => useApi('/test'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockData);
      expect(result.current.error).toBeNull();
      expect(result.current.isSuccess).toBe(true);
    });

    it('should handle API errors', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useApi('/test'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBeNull();
      expect(result.current.error).toBe('Network error');
      expect(result.current.isError).toBe(true);
    });

    it('should respect enabled option', () => {
      const { result } = renderHook(() => useApi('/test', { enabled: false }));

      expect(result.current.loading).toBe(false);
      expect(fetch).not.toHaveBeenCalled();
    });
  });

  describe('useTrendingThemes', () => {
    it('should construct correct URL with options', () => {
      const mockData = [{ id: '1', theme: 'AI', name: 'AI概念股', heatScore: 85, stocks: [] }];
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      renderHook(() => useTrendingThemes({ useRealData: true, sortBy: 'popular' }));

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/trending?sort=popular&real=true'),
        expect.any(Object)
      );
    });
  });

  describe('useRagSearch', () => {
    it('should construct correct URL with options', () => {
      const mockData = {
        results: [],
        total: 0,
        query: 'test',
        searchTime: 100
      };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      renderHook(() => useRagSearch('test query', { maxResults: 10, minScore: 0.5 }));

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/rag/search?query=test%20query&maxResults=10&minScore=0.5'),
        expect.any(Object)
      );
    });
  });
});
