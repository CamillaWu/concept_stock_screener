import React from 'react';
import type { StockConcept, Stock } from '@concepts-radar/types';
import { DetailPanel as UIDetailPanel } from '@concepts-radar/ui';
import { useAiConceptStrength, useAiSentiment } from '../../hooks';

interface DetailPanelProps {
  selectedTheme: StockConcept | null;
  onStockClick: (stock: Stock) => void;
  className?: string;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({
  selectedTheme,
  onStockClick,
  className
}) => {
  // 使用新的 AI 分析 Hook
  const { 
    data: conceptStrength, 
    loading: strengthLoading
  } = useAiConceptStrength(selectedTheme?.theme || '', {
    enabled: !!selectedTheme?.theme,
    cacheTime: 10 * 60 * 1000, // 10分鐘快取
    staleTime: 5 * 60 * 1000,   // 5分鐘過期
    retryCount: 2
  });

  const { 
    data: sentiment, 
    loading: sentimentLoading
  } = useAiSentiment(selectedTheme?.theme || '', {
    enabled: !!selectedTheme?.theme,
    cacheTime: 10 * 60 * 1000, // 10分鐘快取
    staleTime: 5 * 60 * 1000,   // 5分鐘過期
    retryCount: 2
  });

  // 計算載入狀態
  const analysisLoading = strengthLoading || sentimentLoading;

  // 模擬異常事件（可以後續遷移到專門的 Hook）
  const anomalyEvents = selectedTheme ? [
    {
      type: 'price_up' as const,
      value: 8.5,
      threshold: 5,
      timestamp: '2024-01-15 14:30',
      description: `${selectedTheme.theme} 概念股集體上漲`,
      affectedStocks: ['2330', '2317', '2454']
    }
  ] : [];

  // 轉換 AI 分析數據格式以符合現有組件期望
  const transformedConceptStrength = conceptStrength ? {
    strengthScore: conceptStrength.score,
    dimensions: {
      marketCapRatio: conceptStrength.keyMetrics.find(m => m.metric === 'market_cap_ratio')?.value || 70,
      priceContribution: conceptStrength.keyMetrics.find(m => m.metric === 'price_contribution')?.value || 65,
      discussionLevel: conceptStrength.keyMetrics.find(m => m.metric === 'discussion_level')?.value || 80
    }
  } : null;

  const transformedSentiment: {
    score: number;
    trend: 'up' | 'down' | 'stable';
    sources: {
      news: number;
      social: number;
    };
    recentTrend: number[];
  } | null = sentiment ? {
    score: sentiment.score,
    trend: sentiment.trend === 'improving' ? 'up' : sentiment.trend === 'declining' ? 'down' : 'stable',
    sources: {
      news: sentiment.sources.find(s => s.type === 'news')?.weight || 60,
      social: sentiment.sources.find(s => s.type === 'social')?.weight || 40
    },
    recentTrend: [0.4, 0.5, 0.6, 0.7, 0.6, 0.8, 0.6] // 可以後續從 API 獲取
  } : null;

  return (
    <UIDetailPanel
      selectedTheme={selectedTheme}
      onStockClick={onStockClick}
      loading={analysisLoading}
      className={className}
      conceptStrength={transformedConceptStrength}
      sentiment={transformedSentiment}
      anomalyEvents={anomalyEvents}
      showAdvancedAnalysis={true}
    />
  );
};
