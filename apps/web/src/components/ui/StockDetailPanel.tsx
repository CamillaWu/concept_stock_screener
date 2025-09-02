import React, { useMemo } from 'react';
import type { StockAnalysisResult } from '@concepts-radar/types';
import { StockDetailPanel as UIStockDetailPanel } from '@concepts-radar/ui';
import { useStockPrice } from '../../hooks';

interface StockDetailPanelProps {
  stock: StockAnalysisResult;
  useRealData?: boolean;
  className?: string;
}

export const StockDetailPanel: React.FC<StockDetailPanelProps> = ({
  stock,
  useRealData = false,
  className = ''
}) => {
  // 使用新的 Hook 獲取實時股票價格數據
  const { 
    data: stockPrice, 
    loading: priceLoading, 
    error: priceError 
  } = useStockPrice(stock.stock.ticker, {
    enabled: useRealData && !!stock.stock.ticker,
    cacheTime: 1 * 60 * 1000, // 1分鐘快取
    staleTime: 30 * 1000,      // 30秒過期
    retryCount: 3
  });



  // 計算載入狀態
  const analysisLoading = priceLoading;

  // 合併實時價格數據到股票分析結果中
  const enhancedStock = useMemo(() => {
    if (!stockPrice) return stock;

    return {
      ...stock,
      currentPrice: stockPrice.price,
      priceChange: stockPrice.change,
      priceChangePercent: stockPrice.changePercent,
      volume: stockPrice.volume,
      lastUpdated: stockPrice.timestamp,
      // 添加實時價格指標
      realTimeMetrics: {
        price: stockPrice.price,
        change: stockPrice.change,
        changePercent: stockPrice.changePercent,
        volume: stockPrice.volume,
        timestamp: stockPrice.timestamp
      }
    };
  }, [stock, stockPrice]);



  // 處理錯誤狀態
  const errorMessage = useMemo(() => {
    if (priceError) return `價格數據載入失敗: ${priceError}`;
    return null;
  }, [priceError]);

  return (
    <UIStockDetailPanel
      analysis={enhancedStock}
      useRealData={useRealData}
      showStockAttribution={true}
      className={className}
      loading={analysisLoading}
      error={errorMessage}
    />
  );
};
