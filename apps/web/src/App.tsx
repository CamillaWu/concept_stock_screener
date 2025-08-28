import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/ui/Sidebar';
import { DetailPanel } from './components/ui/DetailPanel';
import { StockDetailPanel } from './components/ui/StockDetailPanel';
import { StockConcept, Stock, SearchMode, ApiResponse } from './types';
import './App.css';

function App() {
  // 狀態管理
  const [trendingThemes, setTrendingThemes] = useState<StockConcept[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<StockConcept | undefined>();
  const [selectedStock, setSelectedStock] = useState<Stock | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState<SearchMode>('theme');

  // 載入熱門概念
  useEffect(() => {
    fetchTrendingThemes();
  }, []);

  const fetchTrendingThemes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://concept-stock-screener-api.sandy246836.workers.dev/trending');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setTrendingThemes(data);
    } catch (err) {
      console.error('載入熱門概念失敗:', err);
      setError(err instanceof Error ? err.message : '載入失敗');
    } finally {
      setLoading(false);
    }
  };

  // 處理搜尋
  const handleSearch = async (query: string, mode: SearchMode) => {
    try {
      setLoading(true);
      setError(null);
      setSearchMode(mode);
      
      const response = await fetch(`https://concept-stock-screener-api.sandy246836.workers.dev/search?mode=${mode}&q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (mode === 'theme') {
        setSelectedTheme(data);
        setSelectedStock(undefined);
      } else {
        // 股票搜尋模式 - 這裡需要實作股票分析
        console.log('股票搜尋結果:', data);
      }
    } catch (err) {
      console.error('搜尋失敗:', err);
      setError(err instanceof Error ? err.message : '搜尋失敗');
    } finally {
      setLoading(false);
    }
  };

  // 處理概念點擊
  const handleThemeClick = (theme: StockConcept) => {
    setSelectedTheme(theme);
    setSelectedStock(undefined);
  };

  // 處理股票點擊
  const handleStockClick = (stock: Stock) => {
    setSelectedStock(stock);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 側邊欄 */}
      <Sidebar
        trendingThemes={trendingThemes}
        onSearch={handleSearch}
        onThemeClick={handleThemeClick}
        onStockClick={handleStockClick}
        loading={loading}
      />

      {/* 主要內容區域 */}
      <div className="flex-1 flex">
        <DetailPanel
          selectedTheme={selectedTheme}
          relatedStocks={selectedTheme?.stocks || []}
          loading={loading}
          error={error}
          onStockClick={handleStockClick}
          onRetry={fetchTrendingThemes}
        />

        {/* 股票詳細面板 */}
        {selectedStock && (
          <StockDetailPanel
            selectedStock={selectedStock}
            loading={false}
            onRetry={() => {}}
          />
        )}
      </div>
    </div>
  );
}

export default App;

