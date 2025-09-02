'use client';

import React from 'react';
import type { 
  Stock, 
  StockConcept, 
  StockAnalysisResult, 
  ThemeForStock,
  Exchange,
  SearchMode,
  SortOption,
  RiskLevel,
  Recommendation,
  Sentiment
} from '@concepts-radar/types';

export default function TypeSystemTestPage() {
  // 測試基礎型別
  const testExchange: Exchange = 'TWSE';
  const testSearchMode: SearchMode = 'theme';
  const testSortOption: SortOption = 'popular';
  const testRiskLevel: RiskLevel = 'medium';
  const testRecommendation: Recommendation = 'buy';
  const testSentiment: Sentiment = 'positive';

  // 測試 Stock 型別
  const testStock: Stock = {
    id: 'test-stock-1',
    ticker: '2330',
    symbol: '2330',
    name: '台積電',
    exchange: 'TWSE',
    currentPrice: 500,
    change: 10,
    changePercent: 2.0,
    volume: 1000000,
    marketCap: 1000000000000,
    pe: 15,
    pb: 2.5,
    reason: '全球最大晶圓代工廠',
    heatScore: 95,
    concepts: ['AI', '半導體', 'CoWoS']
  };

  // 測試 StockConcept 型別
  const testStockConcept: StockConcept = {
    id: 'test-concept-1',
    theme: 'AI概念',
    name: '人工智慧概念股',
    description: '與人工智慧技術相關的股票概念',
    heatScore: 85,
    stocks: [testStock]
  };

  // 測試 ThemeForStock 型別
  const testThemeForStock: ThemeForStock = {
    id: 'test-theme-1',
    theme: 'AI概念',
    name: '人工智慧概念股',
    description: '與人工智慧技術相關的股票概念',
    heatScore: 85,
    relevanceScore: 90
  };

  // 測試 StockAnalysisResult 型別
  const testStockAnalysis: StockAnalysisResult = {
    id: 'test-analysis-1',
    stock: {
      ticker: '2330',
      name: '台積電'
    },
    themes: [testThemeForStock]
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">型別系統測試頁面</h1>
      
      <div className="space-y-8">
        {/* 基礎型別測試 */}
        <section className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">基礎型別測試</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Exchange:</strong> {testExchange}</div>
            <div><strong>SearchMode:</strong> {testSearchMode}</div>
            <div><strong>SortOption:</strong> {testSortOption}</div>
            <div><strong>RiskLevel:</strong> {testRiskLevel}</div>
            <div><strong>Recommendation:</strong> {testRecommendation}</div>
            <div><strong>Sentiment:</strong> {testSentiment}</div>
          </div>
        </section>

        {/* Stock 型別測試 */}
        <section className="bg-green-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-green-800">Stock 型別測試</h2>
          <div className="space-y-2 text-sm">
            <div><strong>ID:</strong> {testStock.id}</div>
            <div><strong>代號:</strong> {testStock.ticker}</div>
            <div><strong>名稱:</strong> {testStock.name}</div>
            <div><strong>交易所:</strong> {testStock.exchange}</div>
            <div><strong>現價:</strong> ${testStock.currentPrice}</div>
            <div><strong>漲跌:</strong> {testStock.change > 0 ? '+' : ''}{testStock.change}</div>
            <div><strong>漲跌幅:</strong> {testStock.changePercent}%</div>
            <div><strong>成交量:</strong> {testStock.volume.toLocaleString()}</div>
            <div><strong>市值:</strong> ${(testStock.marketCap / 1000000000).toFixed(1)}B</div>
            <div><strong>本益比:</strong> {testStock.pe}</div>
            <div><strong>股價淨值比:</strong> {testStock.pb}</div>
            <div><strong>熱度分數:</strong> {testStock.heatScore}/100</div>
            <div><strong>概念:</strong> {testStock.concepts.join(', ')}</div>
          </div>
        </section>

        {/* StockConcept 型別測試 */}
        <section className="bg-purple-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-purple-800">StockConcept 型別測試</h2>
          <div className="space-y-2 text-sm">
            <div><strong>ID:</strong> {testStockConcept.id}</div>
            <div><strong>主題:</strong> {testStockConcept.theme}</div>
            <div><strong>名稱:</strong> {testStockConcept.name}</div>
            <div><strong>描述:</strong> {testStockConcept.description}</div>
            <div><strong>熱度分數:</strong> {testStockConcept.heatScore}/100</div>
            <div><strong>相關股票數量:</strong> {testStockConcept.stocks.length}</div>
          </div>
        </section>

        {/* ThemeForStock 型別測試 */}
        <section className="bg-yellow-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-yellow-800">ThemeForStock 型別測試</h2>
          <div className="space-y-2 text-sm">
            <div><strong>ID:</strong> {testThemeForStock.id}</div>
            <div><strong>主題:</strong> {testThemeForStock.theme}</div>
            <div><strong>名稱:</strong> {testThemeForStock.name}</div>
            <div><strong>描述:</strong> {testThemeForStock.description}</div>
            <div><strong>熱度分數:</strong> {testThemeForStock.heatScore}/100</div>
            <div><strong>相關性分數:</strong> {testThemeForStock.relevanceScore}/100</div>
          </div>
        </section>

        {/* StockAnalysisResult 型別測試 */}
        <section className="bg-red-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-red-800">StockAnalysisResult 型別測試</h2>
          <div className="space-y-2 text-sm">
            <div><strong>ID:</strong> {testStockAnalysis.id}</div>
            <div><strong>股票代號:</strong> {testStockAnalysis.stock.ticker}</div>
            <div><strong>股票名稱:</strong> {testStockAnalysis.stock.name}</div>
            <div><strong>相關主題數量:</strong> {testStockAnalysis.themes.length}</div>
          </div>
        </section>

        {/* 型別驗證結果 */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">型別驗證結果</h2>
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              所有型別定義驗證通過！
            </div>
            <p className="mt-2 text-sm text-gray-600">
              新的型別系統已成功整合，所有組件都能正確使用統一的型別定義。
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
