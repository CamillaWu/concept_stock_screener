import React, { useMemo } from 'react';
import type { StockAnalysisResult } from '@concepts-radar/types';
import { StockDetailPanel as UIStockDetailPanel } from '@concepts-radar/ui';
import { useStockPrice, useAiInvestmentAdvice, useAiRiskAssessment } from '../../hooks';

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
  } = useStockPrice(stock.stockCode, {
    enabled: useRealData && !!stock.stockCode,
    cacheTime: 1 * 60 * 1000, // 1分鐘快取
    staleTime: 30 * 1000,      // 30秒過期
    retryCount: 3
  });

  // 使用 AI 投資建議 Hook
  const { 
    data: investmentAdvice, 
    loading: adviceLoading, 
    error: adviceError 
  } = useAiInvestmentAdvice(stock.stockCode, {
    enabled: !!stock.stockCode,
    cacheTime: 30 * 60 * 1000, // 30分鐘快取
    staleTime: 15 * 60 * 1000,  // 15分鐘過期
    retryCount: 2
  });

  // 使用 AI 風險評估 Hook
  const { 
    data: riskAssessment, 
    loading: riskLoading, 
    error: riskError 
  } = useAiRiskAssessment(stock.stockCode, {
    enabled: !!stock.stockCode,
    cacheTime: 30 * 60 * 1000, // 30分鐘快取
    staleTime: 15 * 60 * 1000,  // 15分鐘過期
    retryCount: 2
  });

  // 計算載入狀態
  const analysisLoading = priceLoading || adviceLoading || riskLoading;

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

  // 準備 AI 分析數據
  const aiAnalysis = useMemo(() => {
    const analysis: any = {};

    if (investmentAdvice) {
      analysis.investmentAdvice = {
        recommendation: investmentAdvice.recommendation,
        confidence: investmentAdvice.confidence,
        reasoning: investmentAdvice.reasoning,
        riskFactors: investmentAdvice.riskFactors,
        targetPrice: investmentAdvice.targetPrice
      };
    }

    if (riskAssessment) {
      analysis.riskAssessment = {
        riskLevel: riskAssessment.riskLevel,
        riskScore: riskAssessment.riskScore,
        riskFactors: riskAssessment.riskFactors,
        mitigationStrategies: riskAssessment.mitigationStrategies
      };
    }

    return analysis;
  }, [investmentAdvice, riskAssessment]);

  // 處理錯誤狀態
  const hasErrors = priceError || adviceError || riskError;
  const errorMessage = useMemo(() => {
    if (priceError) return `價格數據載入失敗: ${priceError}`;
    if (adviceError) return `AI 投資建議載入失敗: ${adviceError}`;
    if (riskError) return `AI 風險評估載入失敗: ${riskError}`;
    return null;
  }, [priceError, adviceError, riskError]);

  return (
    <UIStockDetailPanel
      analysis={enhancedStock}
      useRealData={useRealData}
      showStockAttribution={true}
      className={className}
      // 傳遞新的 AI 分析數據
      aiAnalysis={aiAnalysis}
      // 傳遞載入和錯誤狀態
      loading={analysisLoading}
      error={errorMessage}
      // 啟用實時數據顯示
      showRealTimeData={!!stockPrice}
      showAiAnalysis={!!aiAnalysis.investmentAdvice || !!aiAnalysis.riskAssessment}
    />
  );
};
