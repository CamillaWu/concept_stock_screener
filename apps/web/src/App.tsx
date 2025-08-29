import React, { useState } from 'react';
import { Sidebar } from './components/ui/Sidebar';
import { SearchBar } from './components/ui/SearchBar';
import { DetailPanel } from './components/ui/DetailPanel';
import { StockDetailPanel } from './components/ui/StockDetailPanel';
import { apiService } from './services/api';
import type { StockConcept, StockAnalysisResult, Stock } from '@concepts-radar/types';

function App() {
  const [selectedTheme, setSelectedTheme] = useState<StockConcept | null>(null);
  const [selectedStock, setSelectedStock] = useState<StockAnalysisResult | null>(null);
  const [searchMode, setSearchMode] = useState<'theme' | 'stock'>('theme');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [useRealData, setUseRealData] = useState(false);

  // 處理搜尋
  const handleSearch = async (query: string, mode: 'theme' | 'stock', useRealData: boolean) => {
    setLoading(true);
    setUseRealData(useRealData);
    
    try {
      if (mode === 'theme') {
        const result = await apiService.searchThemes(query, useRealData);
        setSelectedTheme(result);
        setSelectedStock(null);
      } else {
        const result = await apiService.searchStocks(query, useRealData);
        setSelectedStock(result);
        setSelectedTheme(null);
      }
    } catch (error) {
      console.error('搜尋失敗:', error);
      // 這裡可以添加錯誤處理 UI
    } finally {
      setLoading(false);
    }
  };

  // 處理主題點擊
  const handleThemeClick = (theme: StockConcept) => {
    setSelectedTheme(theme);
    setSelectedStock(null);
  };

  // 處理股票點擊
  const handleStockClick = (stock: Stock) => {
    // 將 Stock 轉換為 StockAnalysisResult 格式
    const stockAnalysis: StockAnalysisResult = {
      stock: {
        ticker: stock.ticker,
        name: stock.name
      },
      themes: [
        {
          theme: selectedTheme?.theme || '相關概念',
          name: selectedTheme?.theme || '相關概念',
          description: selectedTheme?.description || '',
          heatScore: stock.heatScore || 0,
          relevanceScore: stock.heatScore || 0
        }
      ]
    };
    setSelectedStock(stockAnalysis);
    setSelectedTheme(null);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      {/* 側邊欄 */}
      <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'w-16' : 'w-80'
      }`}>
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onThemeClick={handleThemeClick}
          useRealData={useRealData}
          onUseRealDataChange={setUseRealData}
        />
      </div>

      {/* 主要內容區域 */}
      <div className="flex-1 flex flex-col">
        {/* 搜尋區域 */}
        <div className="p-6 bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <SearchBar
            mode={searchMode}
            onModeChange={setSearchMode}
            onSearch={handleSearch}
            loading={loading}
            useRealData={useRealData}
            onUseRealDataChange={setUseRealData}
          />
        </div>

        {/* 內容區域 */}
        <div className="flex-1 flex overflow-hidden">
          {/* 左側：主題詳情 */}
          {selectedTheme && (
            <div className="flex-1 p-6 overflow-y-auto">
              <DetailPanel
                theme={selectedTheme}
                onStockClick={handleStockClick}
                useRealData={useRealData}
              />
            </div>
          )}

          {/* 右側：股票詳情 */}
          {selectedStock && (
            <div className="w-96 p-6 bg-white/90 backdrop-blur-sm border-l border-gray-200 overflow-y-auto">
              <StockDetailPanel
                stock={selectedStock}
                useRealData={useRealData}
              />
            </div>
          )}

          {/* 空狀態 */}
          {!selectedTheme && !selectedStock && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-lg font-medium mb-2">開始搜尋</h3>
                <p className="text-sm">
                  {searchMode === 'theme' 
                    ? '搜尋投資主題來查看相關概念股' 
                    : '搜尋股票代號來查看相關概念分析'
                  }
                </p>
                {useRealData && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center text-sm text-green-700">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      已啟用真實台股資料
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

