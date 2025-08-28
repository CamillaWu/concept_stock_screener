import { useState, useCallback } from 'react';
import { apiService } from '../services/api';
import type { StockConcept, Stock, StockAnalysisResult, SearchMode } from '../types';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (...args: any[]) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiFunction(...args);
      setState({ data: result, loading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : '發生未知錯誤',
      });
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, execute, reset };
}

// 專門用於熱門概念的 Hook
export function useTrendingThemes() {
  return useApi(apiService.getTrendingThemes);
}

// 專門用於概念搜尋的 Hook
export function useThemeSearch() {
  return useApi(apiService.searchThemes);
}

// 專門用於股票搜尋的 Hook
export function useStockSearch() {
  return useApi(apiService.searchStocks);
}

// 專門用於股票分析的 Hook
export function useStockAnalysis() {
  return useApi(apiService.getStockAnalysis);
}

// 通用搜尋 Hook
export function useSearch() {
  return useApi(apiService.search);
}
