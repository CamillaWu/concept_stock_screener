'use client';

import React, { useState } from 'react';
import SearchBar from '../../components/ui/SearchBar';
import ThemeToStockList from '../../components/ui/ThemeToStockList';
import StockToThemePills from '../../components/ui/StockToThemePills';
import HeatBar from '../../components/ui/HeatBar';
import ConceptStrength from '../../components/ui/ConceptStrength';
import StockAttribution from '../../components/ui/StockAttribution';

export default function ComponentsDemo() {
  const [searchMode, setSearchMode] = useState('theme');
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);

  // Mock 數據
  const mockThemes = [
    {
      id: 'ai',
      name: 'AI 概念',
      heatScore: 85,
      stocks: [
        { id: '2330', name: '台積電', ticker: '2330' },
        { id: '2317', name: '鴻海', ticker: '2317' },
        { id: '2454', name: '聯發科', ticker: '2454' }
      ]
    },
    {
      id: 'ev',
      name: '電動車',
      heatScore: 72,
      stocks: [
        { id: '2207', name: '和泰車', ticker: '2207' },
        { id: '2201', name: '裕隆', ticker: '2201' }
      ]
    }
  ];

  const mockStockThemes = [
    { id: 'ai', name: 'AI 概念' },
    { id: 'semiconductor', name: '半導體' },
    { id: 'tech', name: '科技股' },
    { id: 'bluechip', name: '藍籌股' }
  ];

  const handleSearch = (query) => {
    console.log('搜尋:', query, '模式:', searchMode);
  };

  const handleSelectTheme = (theme) => {
    setSelectedTheme(theme);
    console.log('選擇主題:', theme);
  };

  const handleSelectStock = (stock) => {
    setSelectedStock(stock);
    console.log('選擇股票:', stock);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">元件展示頁面</h1>

        {/* SearchBar */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">1. SearchBar 元件</h2>
          <SearchBar
            mode={searchMode}
            onModeChange={setSearchMode}
            onSearch={handleSearch}
            placeholder="搜尋投資主題或股票..."
          />
        </section>

        {/* ThemeToStockList */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">2. ThemeToStockList 元件</h2>
          <ThemeToStockList
            themes={mockThemes}
            onSelectTheme={handleSelectTheme}
            onSelectStock={handleSelectStock}
          />
        </section>

        {/* StockToThemePills */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">3. StockToThemePills 元件</h2>
          <StockToThemePills
            themes={mockStockThemes}
            onSelectTheme={handleSelectTheme}
          />
        </section>

        {/* HeatBar */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">4. HeatBar 元件</h2>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-600 mb-2">有數據的熱度條：</div>
              <HeatBar themeName="AI 概念" score={85} updatedAt="2024-01-15 14:30" />
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-2">自動獲取數據的熱度條：</div>
              <HeatBar themeName="電動車" />
            </div>
          </div>
        </section>

        {/* ConceptStrength */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">5. ConceptStrength 元件</h2>
          <ConceptStrength 
            strengthScore={75}
            dims={{
              marketCapRatio: 70,
              priceContribution: 65,
              discussionLevel: 80
            }}
          />
        </section>

        {/* StockAttribution */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">6. StockAttribution 元件</h2>
          <StockAttribution 
            stockId="2330"
            stockName="台積電"
            currentTheme="AI 概念"
          />
        </section>

        {/* 狀態顯示 */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">當前狀態</h2>
          <div className="space-y-2 text-sm">
            <div>搜尋模式: <span className="font-medium">{searchMode}</span></div>
            <div>選中主題: <span className="font-medium">{selectedTheme?.name || '無'}</span></div>
            <div>選中股票: <span className="font-medium">{selectedStock?.name || '無'}</span></div>
          </div>
        </section>
      </div>
    </div>
  );
}
