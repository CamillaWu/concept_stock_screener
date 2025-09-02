import { renderHook, waitFor, act } from '@testing-library/react';
import { 
  useTrendingThemes, 
  useThemeSearch, 
  useStockSearch,
  useAiConceptStrength,
  useAiSentiment 
} from '../index';

// Mock fetch globally
global.fetch = jest.fn();

// Mock console methods to avoid noise in tests
const originalConsole = { ...console };
beforeAll(() => {
  console.log = jest.fn();
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  console.log = originalConsole.log;
  console.error = originalConsole.error;
  console.warn = originalConsole.warn;
});

describe('API Hook Migration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear any cached data
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('useTrendingThemes Hook Migration', () => {
    it('should construct correct URL with migration options', () => {
      const mockData = [
        { id: '1', theme: 'AI', name: 'AI概念股', heatScore: 85, stocks: [] }
      ];
      
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      renderHook(() => useTrendingThemes({ 
        useRealData: true, 
        sortBy: 'popular',
        cacheTime: 5 * 60 * 1000, // 5分鐘快取
        staleTime: 2 * 60 * 1000,  // 2分鐘過期
        retryCount: 3
      }));

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/trending?sort=popular&real=true'),
        expect.any(Object)
      );
    });

    it('should handle caching correctly with 5 minute cache and 2 minute stale time', async () => {
      const mockData = [{ id: '1', theme: 'AI', name: 'AI概念股', heatScore: 85, stocks: [] }];
      
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      const { result, rerender } = renderHook(() => useTrendingThemes({ 
        useRealData: false,
        cacheTime: 5 * 60 * 1000,
        staleTime: 2 * 60 * 1000
      }));

      // Wait for first fetch
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockData);
      expect(fetch).toHaveBeenCalledTimes(1);

      // Rerender should use cached data
      rerender();
      expect(fetch).toHaveBeenCalledTimes(1); // Still 1, using cache
    });

    it('should retry 3 times on failure', async () => {
      const error = new Error('Network error');
      (fetch as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useTrendingThemes({ 
        retryCount: 3,
        retryDelay: 100 // Fast retry for testing
      }));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      }, { timeout: 1000 });

      // Should have attempted 3 retries
      expect(fetch).toHaveBeenCalledTimes(3);
      expect(result.current.error).toBe('Network error');
    });
  });

  describe('useThemeSearch Hook Migration', () => {
    it('should only enable when query is provided', () => {
      const { result } = renderHook(() => useThemeSearch('', { 
        useRealData: false,
        cacheTime: 10 * 60 * 1000,
        staleTime: 5 * 60 * 1000
      }));

      expect(result.current.loading).toBe(false);
      expect(fetch).not.toHaveBeenCalled();
    });

    it('should construct correct search URL', () => {
      const mockData = { id: '1', theme: 'AI', name: 'AI概念股', heatScore: 85, stocks: [] };
      
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      renderHook(() => useThemeSearch('AI概念', { 
        useRealData: true,
        cacheTime: 10 * 60 * 1000,
        staleTime: 5 * 60 * 1000
      }));

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/search?mode=theme&q=AI%E6%A6%82%E5%BF%B5&real=true'),
        expect.any(Object)
      );
    });

    it('should handle 10 minute cache and 5 minute stale time', async () => {
      const mockData = { id: '1', theme: 'AI', name: 'AI概念股', heatScore: 85, stocks: [] };
      
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      const { result, rerender } = renderHook(() => useThemeSearch('AI', { 
        useRealData: false,
        cacheTime: 10 * 60 * 1000,
        staleTime: 5 * 60 * 1000
      }));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockData);
      expect(fetch).toHaveBeenCalledTimes(1);

      // Rerender should use cached data
      rerender();
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('useStockSearch Hook Migration', () => {
    it('should construct correct stock search URL', () => {
      const mockData = {
        stock: { id: '1', ticker: '2330', name: '台積電' },
        analysis: { score: 85, trend: 'up' }
      };
      
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      renderHook(() => useStockSearch('2330', { 
        useRealData: true,
        cacheTime: 10 * 60 * 1000,
        staleTime: 5 * 60 * 1000
      }));

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/search?mode=stock&q=2330&real=true'),
        expect.any(Object)
      );
    });

    it('should handle stock search with proper caching', async () => {
      const mockData = {
        stock: { id: '1', ticker: '2330', name: '台積電' },
        analysis: { score: 85, trend: 'up' }
      };
      
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      const { result } = renderHook(() => useStockSearch('2330', { 
        useRealData: false,
        cacheTime: 10 * 60 * 1000,
        staleTime: 5 * 60 * 1000
      }));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockData);
      expect(result.current.isSuccess).toBe(true);
    });
  });

  describe('useAiConceptStrength Hook Migration', () => {
    it('should only enable when theme is provided', () => {
      const { result } = renderHook(() => useAiConceptStrength('', { 
        cacheTime: 30 * 60 * 1000,
        staleTime: 15 * 60 * 1000
      }));

      expect(result.current.loading).toBe(false);
      expect(fetch).not.toHaveBeenCalled();
    });

    it('should construct correct AI analysis URL', () => {
      const mockData = {
        strength: 'strong',
        score: 85,
        analysis: 'AI概念具有強勁的市場表現',
        keyMetrics: [
          { metric: 'market_cap_ratio', value: 70, trend: 'up' }
        ],
        sustainability: 'high'
      };
      
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      renderHook(() => useAiConceptStrength('AI概念', { 
        cacheTime: 30 * 60 * 1000,
        staleTime: 15 * 60 * 1000
      }));

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/ai/concept-strength?theme=AI%E6%A6%82%E5%BF%B5'),
        expect.any(Object)
      );
    });

    it('should handle AI analysis with 30 minute cache and 15 minute stale time', async () => {
      const mockData = {
        strength: 'strong',
        score: 85,
        analysis: 'AI概念具有強勁的市場表現',
        keyMetrics: [
          { metric: 'market_cap_ratio', value: 70, trend: 'up' }
        ],
        sustainability: 'high'
      };
      
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      const { result } = renderHook(() => useAiConceptStrength('AI概念', { 
        cacheTime: 30 * 60 * 1000,
        staleTime: 15 * 60 * 1000
      }));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockData);
      expect(result.current.isSuccess).toBe(true);
    });
  });

  describe('useAiSentiment Hook Migration', () => {
    it('should construct correct sentiment analysis URL', () => {
      const mockData = {
        sentiment: 'positive',
        score: 0.8,
        analysis: '市場情緒樂觀',
        sources: [
          { type: 'news', sentiment: 'positive', weight: 60 }
        ],
        trend: 'improving'
      };
      
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      renderHook(() => useAiSentiment('2330', { 
        cacheTime: 30 * 60 * 1000,
        staleTime: 15 * 60 * 1000
      }));

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/ai/sentiment?stock=2330'),
        expect.any(Object)
      );
    });

    it('should handle sentiment analysis with proper caching', async () => {
      const mockData = {
        sentiment: 'positive',
        score: 0.8,
        analysis: '市場情緒樂觀',
        sources: [
          { type: 'news', sentiment: 'positive', weight: 60 }
        ],
        trend: 'improving'
      };
      
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      const { result } = renderHook(() => useAiSentiment('2330', { 
        cacheTime: 30 * 60 * 1000,
        staleTime: 15 * 60 * 1000
      }));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockData);
      expect(result.current.isSuccess).toBe(true);
    });
  });

  describe('Migration Benefits Verification', () => {
    it('should provide consistent API state structure across all hooks', () => {
      const { result: trendingResult } = renderHook(() => useTrendingThemes());
      const { result: searchResult } = renderHook(() => useThemeSearch('test'));
      const { result: aiResult } = renderHook(() => useAiConceptStrength('test'));

      // All hooks should have the same state structure
      const expectedKeys = ['data', 'loading', 'error', 'isSuccess', 'isError'];
      
      expect(Object.keys(trendingResult.current)).toEqual(expect.arrayContaining(expectedKeys));
      expect(Object.keys(searchResult.current)).toEqual(expect.arrayContaining(expectedKeys));
      expect(Object.keys(aiResult.current)).toEqual(expect.arrayContaining(expectedKeys));
    });

    it('should handle errors consistently across all hooks', async () => {
      const error = new Error('API Error');
      (fetch as jest.Mock).mockRejectedValue(error);

      const { result: trendingResult } = renderHook(() => useTrendingThemes());
      const { result: searchResult } = renderHook(() => useThemeSearch('test'));
      const { result: aiResult } = renderHook(() => useAiConceptStrength('test'));

      await waitFor(() => {
        expect(trendingResult.current.loading).toBe(false);
        expect(searchResult.current.loading).toBe(false);
        expect(aiResult.current.loading).toBe(false);
      });

      expect(trendingResult.current.error).toBe('API Error');
      expect(searchResult.current.error).toBe('API Error');
      expect(aiResult.current.error).toBe('API Error');
    });
  });
});
