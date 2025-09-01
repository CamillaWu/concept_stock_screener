import React, { useState, useEffect } from 'react';
import type { StockConcept } from '@concepts-radar/types';
import { DetailPanel as UIDetailPanel } from '@concepts-radar/ui';
import { apiService } from '../../services/api';

interface DetailPanelProps {
  theme: StockConcept;
  onStockClick: (stock: StockConcept['stocks'][0]) => void;
  useRealData?: boolean;
  className?: string;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({
  theme,
  onStockClick,
  className = ''
}) => {
  const [conceptStrength, setConceptStrength] = useState<{
    strengthScore: number;
    dimensions: {
      marketCapRatio: number;
      priceContribution: number;
      discussionLevel: number;
    };
  } | null>(null);
  const [sentiment, setSentiment] = useState<{
    score: number;
    trend: 'up' | 'down' | 'stable';
    sources: {
      news: number;
      social: number;
    };
    recentTrend: number[];
  } | null>(null);
  const [anomalyEvents, setAnomalyEvents] = useState<Array<{
    type: 'price_up' | 'price_down' | 'volume_up' | 'volume_down';
    value: number;
    threshold: number;
    timestamp: string;
    description: string;
    affectedStocks: string[];
  }>>([]);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  // 當選中主題時，載入分析數據
  useEffect(() => {
    if (theme?.theme) {
      loadThemeAnalysis(theme.theme);
    } else {
      // 重置狀態
      setConceptStrength(null);
      setSentiment(null);
      setAnomalyEvents([]);
    }
  }, [theme]);

  const loadThemeAnalysis = async (theme: string) => {
    try {
      setAnalysisLoading(true);
      
      console.log('開始載入主題分析:', theme);
      
      // 並行載入所有分析數據
      const [strengthData, sentimentData] = await Promise.all([
        apiService.getConceptStrength(theme).catch(err => {
          console.error('概念強度分析失敗:', err);
          return {
            strengthScore: 75,
            dimensions: {
              marketCapRatio: 70,
              priceContribution: 65,
              discussionLevel: 80
            }
          };
        }),
        apiService.getSentiment(theme).catch(err => {
          console.error('情緒分析失敗:', err);
          return {
            score: 0.6,
            trend: 'up' as const,
            sources: {
              news: 60,
              social: 40
            },
            recentTrend: [0.4, 0.5, 0.6, 0.7, 0.6, 0.8, 0.6]
          };
        })
      ]);

      console.log('分析數據載入成功:', { strengthData, sentimentData });

      setConceptStrength(strengthData);
      setSentiment(sentimentData);

      // 模擬異常事件
      setAnomalyEvents([
        {
          type: 'price_up' as const,
          value: 8.5,
          threshold: 5,
          timestamp: '2024-01-15 14:30',
          description: `${theme} 概念股集體上漲`,
          affectedStocks: ['2330', '2317', '2454']
        }
      ]);
    } catch (err) {
      console.error('載入主題分析失敗:', err);
    } finally {
      setAnalysisLoading(false);
    }
  };

  return (
    <UIDetailPanel
      selectedTheme={theme}
      onStockClick={onStockClick}
      loading={analysisLoading}
      className={className}
      conceptStrength={conceptStrength}
      sentiment={sentiment}
      anomalyEvents={anomalyEvents}
      showAdvancedAnalysis={true}
    />
  );
};
