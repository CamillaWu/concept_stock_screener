import React from 'react';
import { StockList, StockListErrorBoundary } from '@concepts-radar/ui';
import { Stock } from '@concepts-radar/types';

// 範例股票數據
const sampleStocks: Stock[] = [
  {
    ticker: '2330',
    name: '台積電',
    exchange: 'TWSE',
    reason: '全球最大晶圓代工廠，AI 晶片核心供應商',
    heatScore: 95,
    concepts: ['AI 伺服器', '半導體', 'CoWoS']
  },
  {
    ticker: '2454',
    name: '聯發科',
    exchange: 'TWSE',
    reason: '手機晶片龍頭，積極布局 AI 邊緣運算',
    heatScore: 88,
    concepts: ['AI PC', '手機晶片', '邊緣運算']
  },
  {
    ticker: '3034',
    name: '聯詠',
    exchange: 'TWSE',
    reason: '顯示驅動 IC 領導廠商，車用晶片成長強勁',
    heatScore: 82,
    concepts: ['車用晶片', '顯示驅動', 'IC 設計']
  },
  {
    ticker: '2379',
    name: '瑞昱',
    exchange: 'TWSE',
    reason: '網通晶片大廠，WiFi 7 技術領先',
    heatScore: 78,
    concepts: ['網通晶片', 'WiFi 7', 'IoT']
  },
  {
    ticker: '2308',
    name: '台達電',
    exchange: 'TWSE',
    reason: '電源管理龍頭，電動車充電樁布局完整',
    heatScore: 75,
    concepts: ['電動車', '電源管理', '充電樁']
  }
];

export const StockListExample: React.FC = () => {
  const handleStockClick = (stock: Stock) => {
    console.log('點擊股票:', stock);
    // 這裡可以整合右側詳情面板的開啟邏輯
  };

  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error('StockList 錯誤:', error, errorInfo);
    // 這裡可以整合錯誤報告服務
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        StockList 組件重構範例
      </h1>

      {/* 基礎版本 */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">基礎版本</h2>
        <StockListErrorBoundary onError={handleError}>
          <StockList
            stocks={sampleStocks}
            onStockClick={handleStockClick}
            className="bg-white rounded-lg border border-gray-200 p-4"
          />
        </StockListErrorBoundary>
      </div>

      {/* 緊湊版本 */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">緊湊版本</h2>
        <StockListErrorBoundary onError={handleError}>
          <StockList
            stocks={sampleStocks}
            onStockClick={handleStockClick}
            compact={true}
            className="bg-white rounded-lg border border-gray-200 p-4"
          />
        </StockListErrorBoundary>
      </div>

      {/* 帶篩選器版本 */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">帶篩選器版本</h2>
        <StockListErrorBoundary onError={handleError}>
          <StockList
            stocks={sampleStocks}
            onStockClick={handleStockClick}
            showFilters={true}
            className="bg-white rounded-lg border border-gray-200 p-4"
          />
        </StockListErrorBoundary>
      </div>

      {/* 帶分頁版本 */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">帶分頁版本</h2>
        <StockListErrorBoundary onError={handleError}>
          <StockList
            stocks={sampleStocks}
            onStockClick={handleStockClick}
            showPagination={true}
            itemsPerPage={3}
            className="bg-white rounded-lg border border-gray-200 p-4"
          />
        </StockListErrorBoundary>
      </div>

      {/* 完整功能版本 */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">完整功能版本</h2>
        <StockListErrorBoundary onError={handleError}>
          <StockList
            stocks={sampleStocks}
            onStockClick={handleStockClick}
            showFilters={true}
            showPagination={true}
            itemsPerPage={3}
            className="bg-white rounded-lg border border-gray-200 p-4"
          />
        </StockListErrorBoundary>
      </div>
    </div>
  );
};
