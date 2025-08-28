import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/ui/Sidebar';
import { DetailPanel } from './components/ui/DetailPanel';
import { StockDetailPanel } from './components/ui/StockDetailPanel';
import { StockConcept, Stock, SearchMode, StockAnalysisResult } from './types';
import { apiService } from './services/api';
import './App.css';

function App() {
  // 狀態管理
  const [trendingThemes, setTrendingThemes] = useState<StockConcept[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<StockConcept | undefined>();
  const [selectedStock, setSelectedStock] = useState<Stock | undefined>();
  const [stockAnalysis, setStockAnalysis] = useState<StockAnalysisResult | undefined>();
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
      
      const data = await apiService.getTrendingThemes();
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
      
      const data = await apiService.search(query, mode);
      
      if (mode === 'theme') {
        setSelectedTheme(data as StockConcept);
        setSelectedStock(undefined);
        setStockAnalysis(undefined);
      } else {
        // 股票搜尋模式
        const stockAnalysis = data as StockAnalysisResult;
        setStockAnalysis(stockAnalysis);
        // 確保 stock 物件有正確的屬性
        const stock: Stock = {
          symbol: stockAnalysis.stock.ticker,
          ticker: stockAnalysis.stock.ticker,
          name: stockAnalysis.stock.name,
          exchange: 'TWSE' as const,
          heatScore: 0,
          concepts: []
        };
        setSelectedStock(stock);
        setSelectedTheme(undefined);
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
    setStockAnalysis(undefined);
  };

  // 處理股票點擊
  const handleStockClick = async (stock: Stock) => {
    try {
      setSelectedStock(stock);
      
      // 如果當前有選中的主題，獲取該股票的歸因分析
      if (selectedTheme) {
        // 這裡可以調用個股歸因分析 API
        console.log('獲取股票歸因分析:', stock.symbol, selectedTheme.theme);
      }
    } catch (err) {
      console.error('處理股票點擊失敗:', err);
    }
  };

  // 處理重試
  const handleRetry = () => {
    if (selectedTheme) {
      // 重新載入主題相關數據
      console.log('重新載入主題數據');
    } else {
      fetchTrendingThemes();
    }
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
          onRetry={handleRetry}
        />

        {/* 股票詳細面板 */}
        {selectedStock && (
          <StockDetailPanel
            selectedStock={selectedStock}
            analysis={stockAnalysis}
            currentTheme={selectedTheme?.theme || ''}
            loading={loading}
            onRetry={handleRetry}
          />
        )}
      </div>
    </div>
  );
}

export default App;

