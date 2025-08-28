import React from 'react';
import { Stock, StockAnalysisResult } from '../../types';
import { HeatBar } from './HeatBar';
import { LoadingSkeleton } from './LoadingSkeleton';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';

interface StockDetailPanelProps {
  selectedStock?: Stock;
  analysis?: StockAnalysisResult;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  className?: string;
}

export const StockDetailPanel: React.FC<StockDetailPanelProps> = ({
  selectedStock,
  analysis,
  loading = false,
  error,
  onRetry,
  className = ''
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

  if (!selectedStock) {
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

  return (
    <div className={`w-96 bg-white border-l border-gray-200 overflow-y-auto ${className}`}>
      <div className="p-6">
        {/* 股票基本資訊 */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {selectedStock.symbol}
              </h2>
              {selectedStock.name && (
                <p className="text-gray-600 mt-1">
                  {selectedStock.name}
                </p>
              )}
            </div>
            <HeatBar
              score={selectedStock.heatScore || 0}
              size="md"
              showScore={true}
            />
          </div>

          {/* 概念標籤 */}
          {selectedStock.concepts && selectedStock.concepts.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                相關概念
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedStock.concepts.map((concept, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {concept}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

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
      </div>
    </div>
  );
};
