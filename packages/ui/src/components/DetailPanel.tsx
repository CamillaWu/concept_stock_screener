import React from 'react';
import { StockConcept, Stock } from '@concepts-radar/types';
import { ThemeCard } from './ThemeCard';
import { StockList } from './StockList';
import { LoadingSkeleton } from './LoadingSkeleton';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';

interface ConceptStrengthData {
  strengthScore: number;
  dimensions: {
    marketCapRatio: number;
    priceContribution: number;
    discussionLevel: number;
  };
}

interface SentimentData {
  score: number;
  trend: 'up' | 'down' | 'stable';
  sources: {
    news: number;
    social: number;
  };
  recentTrend: number[];
}

interface AnomalyEvent {
  type: 'price_up' | 'price_down' | 'volume_up' | 'volume_down';
  value: number;
  threshold: number;
  timestamp: string;
  description: string;
  affectedStocks: string[];
}

interface DetailPanelProps {
  selectedTheme?: StockConcept;
  relatedStocks?: Stock[];
  loading?: boolean;
  error?: string;
  onStockClick?: (stock: Stock) => void;
  onRetry?: () => void;
  className?: string;
  // 進階分析功能
  conceptStrength?: ConceptStrengthData | null;
  sentiment?: SentimentData | null;
  anomalyEvents?: AnomalyEvent[];
  showAdvancedAnalysis?: boolean;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({
  selectedTheme,
  relatedStocks = [],
  loading = false,
  error,
  onStockClick,
  onRetry,
  className = '',
  conceptStrength = null,
  sentiment = null,
  anomalyEvents = [],
  showAdvancedAnalysis = false
}) => {
  if (loading) {
    return (
      <div className={`flex-1 bg-white ${className}`}>
        <div className="p-6">
          <LoadingSkeleton type="card" className="mb-6" />
          <LoadingSkeleton type="list" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex-1 bg-white ${className}`}>
        <ErrorState
          message={error}
          onRetry={onRetry}
          className="h-full"
        />
      </div>
    );
  }

  if (!selectedTheme) {
    return (
      <div className={`flex-1 bg-white ${className}`}>
        <EmptyState
          title="選擇一個概念"
          message="從左側選擇一個熱門概念來查看詳細資訊"
          icon={
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          }
          className="h-full"
        />
      </div>
    );
  }

  return (
    <div className={`flex-1 bg-white overflow-y-auto ${className}`}>
      <div className="p-6">
        {/* 主題標題 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {selectedTheme.theme}
          </h1>
          {selectedTheme.description && (
            <p className="text-gray-600">{selectedTheme.description}</p>
          )}
        </div>

        {/* 概念強度分析 */}
        {showAdvancedAnalysis && conceptStrength && (
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">概念強度分析</h3>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{conceptStrength.strengthScore}</div>
                  <div className="text-sm text-gray-600">綜合評分</div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">市值佔比</span>
                    <span className="text-sm font-medium">{conceptStrength.dimensions.marketCapRatio}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">價格貢獻</span>
                    <span className="text-sm font-medium">{conceptStrength.dimensions.priceContribution}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">討論熱度</span>
                    <span className="text-sm font-medium">{conceptStrength.dimensions.discussionLevel}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 情緒分析 */}
        {showAdvancedAnalysis && sentiment && (
          <div className="mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">市場情緒分析</h3>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(sentiment.score * 100)}
                  </div>
                  <div className="text-sm text-gray-600">情緒指數</div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">新聞</span>
                    <span className="text-sm font-medium">{sentiment.sources.news}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">社群</span>
                    <span className="text-sm font-medium">{sentiment.sources.social}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 異常警示 */}
        {showAdvancedAnalysis && anomalyEvents.length > 0 && (
          <div className="mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">異常警示</h3>
              <div className="space-y-2">
                {anomalyEvents.map((event, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{event.description}</div>
                      <div className="text-xs text-gray-600">{event.timestamp}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 相關股票列表 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            相關股票 ({(relatedStocks.length > 0 ? relatedStocks : selectedTheme.stocks).length})
          </h3>
          <StockList
            stocks={relatedStocks.length > 0 ? relatedStocks : selectedTheme.stocks}
            onStockClick={onStockClick}
          />
        </div>
      </div>
    </div>
  );
};
