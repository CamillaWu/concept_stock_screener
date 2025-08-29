import React from 'react';
import type { StockAnalysisResult } from '@concepts-radar/types';
import { HeatBar } from './HeatBar';
import { StockAttribution } from './StockAttribution';

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
  return (
    <div className={`w-96 bg-white border-l border-gray-200 overflow-y-auto ${className}`}>
      <div className="p-6">
        {/* 股票基本資訊 */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {stock.stock.ticker}
              </h2>
              {stock.stock.name && (
                <p className="text-gray-600 mt-1">
                  {stock.stock.name}
                </p>
              )}
            </div>
            <HeatBar
              score={75}
              size="md"
              showScore={true}
            />
          </div>

          {/* 概念標籤 */}
          {stock.themes && stock.themes.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                相關概念
              </h3>
              <div className="flex flex-wrap gap-2">
                {stock.themes.map((theme, index) => (
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
        <div className="mb-6">
          <StockAttribution
            stockId={stock.stock.ticker}
            stockName={stock.stock.name}
            currentTheme={stock.themes[0]?.theme || ''}
          />
        </div>

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
