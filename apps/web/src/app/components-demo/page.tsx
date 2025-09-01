'use client';

import React, { useState } from 'react';
import { SearchBar } from '@concepts-radar/ui';
import ThemeToStockList from '../../components/ui/ThemeToStockList';
import StockToThemePills from '../../components/ui/StockToThemePills';
import { HeatBar } from '@concepts-radar/ui';
import { ConceptStrength } from '../../components/ui/ConceptStrength';
import { StockAttribution } from '../../components/ui/StockAttribution';

export default function ComponentsDemo() {
  const [searchMode, setSearchMode] = useState<'theme' | 'stock'>('theme');
  const [useRealData, setUseRealData] = useState(false);

  // Mock 數據
  const mockThemes = [
    {
      id: 'ai',
      theme: 'AI 概念',
      name: 'AI 概念',
      heatScore: 85,
      stocks: [
        { ticker: '2330', symbol: '2330', name: '台積電', exchange: 'TWSE' as const },
        { ticker: '2317', symbol: '2317', name: '鴻海', exchange: 'TWSE' as const },
        { ticker: '2454', symbol: '2454', name: '聯發科', exchange: 'TWSE' as const }
      ]
    },
    {
      id: 'ev',
      theme: '電動車',
      name: '電動車',
      heatScore: 72,
      stocks: [
        { ticker: '2207', symbol: '2207', name: '和泰車', exchange: 'TWSE' as const },
        { ticker: '2201', symbol: '2201', name: '裕隆', exchange: 'TWSE' as const }
      ]
    }
  ];

  const mockStockThemes = [
    { id: 'ai', theme: 'AI 概念', name: 'AI 概念', heatScore: 85, stocks: [] },
    { id: 'semiconductor', theme: '半導體', name: '半導體', heatScore: 70, stocks: [] },
    { id: 'tech', theme: '科技股', name: '科技股', heatScore: 65, stocks: [] },
    { id: 'bluechip', theme: '藍籌股', name: '藍籌股', heatScore: 60, stocks: [] }
  ];

  const handleSearch = (query) => {
    console.log('搜尋:', query, '模式:', searchMode);
  };

  const handleSelectTheme = (theme) => {
    console.log('選擇主題:', theme);
  };

  const handleSelectStock = (stock) => {
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
            useRealData={useRealData}
            onUseRealDataChange={setUseRealData}
          />
        </section>

        {/* ThemeToStockList */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">2. ThemeToStockList 元件</h2>
          <ThemeToStockList
            theme={mockThemes[0]}
            onSelectStock={handleSelectStock}
          />
        </section>

        {/* StockToThemePills */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">3. StockToThemePills 元件</h2>
          <StockToThemePills
            themes={mockStockThemes}
            onThemeClick={handleSelectTheme}
          />
        </section>

        {/* HeatBar */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">4. HeatBar 元件</h2>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-600 mb-2">有數據的熱度條：</div>
              <HeatBar score={85} />
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-2">自動獲取數據的熱度條：</div>
              <HeatBar score={72} />
            </div>
          </div>
        </section>

        {/* ConceptStrength */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">5. ConceptStrength 元件</h2>
          <ConceptStrength 
            strengthScore={75}
            dimensions={{
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
            <div>使用真實資料: <span className="font-medium">{useRealData ? '是' : '否'}</span></div>
          </div>
        </section>
      </div>
    </div>
  );
}
