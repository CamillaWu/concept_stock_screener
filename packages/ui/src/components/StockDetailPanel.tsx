import React from 'react';
import { Stock, StockAnalysisResult } from '@concepts-radar/types';
import { HeatBar } from './HeatBar';
import { LoadingSkeleton } from './LoadingSkeleton';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';

interface StockAttributionProps {
  stockId: string;
  stockName: string;
  currentTheme: string;
}

// 簡化的 StockAttribution 組件（避免依賴問題）
const StockAttribution: React.FC<StockAttributionProps> = ({
  stockId,
  stockName,
  currentTheme
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h4 className="text-sm font-medium text-gray-700 mb-2">個股歸因分析</h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">股票代號</span>
          <span className="font-medium">{stockId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">股票名稱</span>
          <span className="font-medium">{stockName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">當前概念</span>
          <span className="font-medium">{currentTheme}</span>
        </div>
      </div>
    </div>
  );
};

interface StockDetailPanelProps {
  selectedStock?: Stock;
  analysis?: StockAnalysisResult;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  className?: string;
  // 新增功能
  useRealData?: boolean;
  showStockAttribution?: boolean;
}

export const StockDetailPanel: React.FC<StockDetailPanelProps> = ({
  selectedStock,
  analysis,
  loading = false,
  error,
  onRetry,
  className = '',
  useRealData = false,
  showStockAttribution = false
}) => {
  if (loading) {
    return (
      <div className={`w-96 bg-white border-l border-gray-200 ${className}`}>
        <div className="p-6">
          <LoadingSkeleton type="card" className="mb-6" />
          <LoadingSkeleton type="text" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`w-96 bg-white border-l border-gray-200 ${className}`}>
        <ErrorState
          message={error}
          onRetry={onRetry}
          className="h-full"
        />
      </div>
    );
  }

  if (!selectedStock && !analysis) {
    return (
      <div className={`w-96 bg-white border-l border-gray-200 ${className}`}>
        <EmptyState
          title="選擇一支股票"
          message="從列表中選擇一支股票來查看詳細分析"
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          }
          className="h-full"
        />
      </div>
    );
  }

  // 決定顯示的股票資訊
  const stockInfo = selectedStock || analysis?.stock;
  const stockTicker = stockInfo?.ticker || '';
  const stockName = stockInfo?.name || '';

  return (
    <div className={`w-96 bg-white border-l border-gray-200 overflow-y-auto ${className}`}>
      <div className="p-6">
        {/* 股票基本資訊 */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {stockTicker}
              </h2>
              {stockName && (
                <p className="text-gray-600 mt-1">
                  {stockName}
                </p>
              )}
            </div>
            <HeatBar
              score={selectedStock?.heatScore || analysis?.themes?.[0]?.relevanceScore || 75}
              size="md"
              showScore={true}
            />
          </div>

          {/* 概念標籤 */}
          {(selectedStock?.concepts || analysis?.themes) && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                相關概念
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedStock?.concepts?.map((concept, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {concept}
                  </span>
                )) || analysis?.themes?.map((theme, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {theme.theme}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 個股歸因分析 */}
        {showStockAttribution && (
          <div className="mb-6">
            <StockAttribution
              stockId={stockTicker}
              stockName={stockName}
              currentTheme={analysis?.themes?.[0]?.theme || ''}
            />
          </div>
        )}

        {/* AI 分析結果 */}
        {analysis && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              AI 分析
            </h3>
            
            {analysis.themes && analysis.themes.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  相關概念分析
                </h4>
                <div className="space-y-2">
                  {analysis.themes.map((theme, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">
                          {theme.name}
                        </span>
                        <HeatBar
                          score={theme.relevanceScore}
                          size="sm"
                          showScore={false}
                        />
                      </div>
                      {theme.description && (
                        <p className="text-sm text-gray-600">
                          {theme.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.summary && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  投資建議
                </h4>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {analysis.summary}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 資料來源提示 */}
        {useRealData && (
          <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center text-sm text-green-700">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              使用真實台股資料
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
