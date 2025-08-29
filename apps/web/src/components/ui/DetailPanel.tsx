import React, { useState, useEffect } from 'react';
import type { StockConcept } from '@concepts-radar/types';
import { StockList } from './StockList';
import { ConceptStrength } from './ConceptStrength';
import { SentimentAnalysis } from './SentimentAnalysis';
import { AnomalyAlert } from './AnomalyAlert';
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
  const [, setAnalysisLoading] = useState(false);

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
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      {/* 主題標題 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {theme.theme}
        </h1>
        {theme.description && (
          <p className="text-gray-600">{theme.description}</p>
        )}
      </div>

      {/* 概念強度分析 */}
      {conceptStrength && (
        <div className="mb-6">
          <ConceptStrength 
            strengthScore={conceptStrength.strengthScore}
            dimensions={conceptStrength.dimensions}
          />
        </div>
      )}

      {/* 情緒分析 */}
      {sentiment && (
        <div className="mb-6">
          <SentimentAnalysis data={sentiment} />
        </div>
      )}

      {/* 異常警示 */}
      {anomalyEvents.length > 0 && (
        <div className="mb-6">
          <AnomalyAlert events={anomalyEvents} />
        </div>
      )}

      {/* 相關股票列表 */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          相關股票 ({theme.stocks.length})
        </h2>
        <StockList
          stocks={theme.stocks}
          onStockClick={onStockClick}
        />
      </div>
    </div>
  );
};
