import React, { useState } from 'react';
import { Sidebar } from './components/ui/Sidebar';
import { SearchBar } from '@concepts-radar/ui';
import { DetailPanel } from './components/ui/DetailPanel';
import { StockDetailPanel } from './components/ui/StockDetailPanel';
import { KeyboardShortcuts } from './components/ui/KeyboardShortcuts';
import { apiService } from './services/api';
import type { StockConcept, StockAnalysisResult, Stock } from '@concepts-radar/types';

function App() {
  const [selectedTheme, setSelectedTheme] = useState<StockConcept | null>(null);
  const [selectedStock, setSelectedStock] = useState<StockAnalysisResult | null>(null);
  const [searchMode, setSearchMode] = useState<'theme' | 'stock'>('theme');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [useRealData, setUseRealData] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

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
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      {/* 側邊欄 */}
      <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out shadow-lg ${
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
        <div className="p-6 bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm">
          <SearchBar
            mode={searchMode}
            onModeChange={setSearchMode}
            onSearch={handleSearch}
            loading={loading}
            useRealData={useRealData}
            onUseRealDataChange={setUseRealData}
          />
          
          {/* 快捷鍵提示 */}
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-500">
            <button
              onClick={() => setShowShortcuts(true)}
              className="flex items-center gap-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              快捷鍵
            </button>
            <span>•</span>
            <span>Ctrl + K 快速搜尋</span>
            <span>•</span>
            <span>Tab 切換模式</span>
          </div>
        </div>

        {/* 內容區域 */}
        <div className="flex-1 flex overflow-hidden">
          {/* 左側：主題詳情 */}
          {selectedTheme && (
            <div className="flex-1 p-6 overflow-y-auto slide-in">
              <DetailPanel
                theme={selectedTheme}
                onStockClick={handleStockClick}
                useRealData={useRealData}
              />
            </div>
          )}

          {/* 右側：股票詳情 */}
          {selectedStock && (
            <div className="w-96 p-6 bg-white/95 backdrop-blur-sm border-l border-gray-200 overflow-y-auto shadow-lg slide-in">
              <StockDetailPanel
                stock={selectedStock}
                useRealData={useRealData}
              />
            </div>
          )}

          {/* 空狀態 */}
          {!selectedTheme && !selectedStock && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500 max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">開始搜尋</h3>
                <p className="text-lg text-gray-600 mb-6">
                  {searchMode === 'theme' 
                    ? '搜尋投資主題來查看相關概念股' 
                    : '搜尋股票代號來查看相關概念分析'
                  }
                </p>
                
                {/* 快速操作按鈕 */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={() => setSearchMode('theme')}
                    className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
                  >
                    <div className="w-8 h-8 mx-auto mb-2 bg-blue-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div className="text-sm font-medium text-blue-700">主題搜尋</div>
                    <div className="text-xs text-blue-600">AI、光通訊、電動車</div>
                  </button>
                  
                  <button
                    onClick={() => setSearchMode('stock')}
                    className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
                  >
                    <div className="w-8 h-8 mx-auto mb-2 bg-green-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="text-sm font-medium text-green-700">個股搜尋</div>
                    <div className="text-xs text-green-600">2330、2317、2454</div>
                  </button>
                </div>

                {useRealData && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-center text-sm text-green-700">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* 快捷鍵面板 */}
      {showShortcuts && (
        <KeyboardShortcuts onClosePanel={() => setShowShortcuts(false)} />
      )}
    </div>
  );
}

export default App;

