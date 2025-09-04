"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockListExample = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const index_1 = require("./index");
// 範例股票數據
const sampleStocks = [
    {
        id: 'stock-2330',
        ticker: '2330',
        symbol: '2330',
        name: '台積電',
        exchange: 'TWSE',
        reason: '全球最大晶圓代工廠，AI 晶片核心供應商',
        heatScore: 95,
        concepts: ['AI 伺服器', '半導體', 'CoWoS']
    },
    {
        id: 'stock-2454',
        ticker: '2454',
        symbol: '2454',
        name: '聯發科',
        exchange: 'TWSE',
        reason: '手機晶片龍頭，積極布局 AI 邊緣運算',
        heatScore: 88,
        concepts: ['AI PC', '手機晶片', '邊緣運算']
    },
    {
        id: 'stock-3034',
        ticker: '3034',
        symbol: '3034',
        name: '聯詠',
        exchange: 'TWSE',
        reason: '顯示驅動 IC 領導廠商，車用晶片成長強勁',
        heatScore: 82,
        concepts: ['車用晶片', '顯示驅動', 'IC 設計']
    },
    {
        id: 'stock-2379',
        ticker: '2379',
        symbol: '2379',
        name: '瑞昱',
        exchange: 'TWSE',
        reason: '網通晶片大廠，WiFi 7 技術領先',
        heatScore: 78,
        concepts: ['網通晶片', 'WiFi 7', 'IoT']
    },
    {
        id: 'stock-2308',
        ticker: '2308',
        symbol: '2308',
        name: '台達電',
        exchange: 'TWSE',
        reason: '電源管理龍頭，電動車充電樁布局完整',
        heatScore: 75,
        concepts: ['電動車', '電源管理', '充電樁']
    }
];
const StockListExample = () => {
    const handleStockClick = (stock) => {
        console.log('點擊股票:', stock);
        // 這裡可以整合右側詳情面板的開啟邏輯
    };
    const handleError = (error, errorInfo) => {
        console.error('StockList 錯誤:', error, errorInfo);
        // 這裡可以整合錯誤報告服務
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "max-w-4xl mx-auto p-6 space-y-8", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-gray-900 mb-6", children: "StockList \u7D44\u4EF6\u91CD\u69CB\u7BC4\u4F8B" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold text-gray-800", children: "\u57FA\u790E\u7248\u672C" }), (0, jsx_runtime_1.jsx)(index_1.StockListErrorBoundary, { onError: handleError, children: (0, jsx_runtime_1.jsx)(index_1.StockList, { stocks: sampleStocks, onStockClick: handleStockClick, className: "bg-white rounded-lg border border-gray-200 p-4" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold text-gray-800", children: "\u7DCA\u6E4A\u7248\u672C" }), (0, jsx_runtime_1.jsx)(index_1.StockListErrorBoundary, { onError: handleError, children: (0, jsx_runtime_1.jsx)(index_1.StockList, { stocks: sampleStocks, onStockClick: handleStockClick, compact: true, className: "bg-white rounded-lg border border-gray-200 p-4" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold text-gray-800", children: "\u5E36\u7BE9\u9078\u5668\u7248\u672C" }), (0, jsx_runtime_1.jsx)(index_1.StockListErrorBoundary, { onError: handleError, children: (0, jsx_runtime_1.jsx)(index_1.StockList, { stocks: sampleStocks, onStockClick: handleStockClick, showFilters: true, className: "bg-white rounded-lg border border-gray-200 p-4" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold text-gray-800", children: "\u5E36\u5206\u9801\u7248\u672C" }), (0, jsx_runtime_1.jsx)(index_1.StockListErrorBoundary, { onError: handleError, children: (0, jsx_runtime_1.jsx)(index_1.StockList, { stocks: sampleStocks, onStockClick: handleStockClick, showPagination: true, itemsPerPage: 3, className: "bg-white rounded-lg border border-gray-200 p-4" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold text-gray-800", children: "\u5B8C\u6574\u529F\u80FD\u7248\u672C" }), (0, jsx_runtime_1.jsx)(index_1.StockListErrorBoundary, { onError: handleError, children: (0, jsx_runtime_1.jsx)(index_1.StockList, { stocks: sampleStocks, onStockClick: handleStockClick, showFilters: true, showPagination: true, itemsPerPage: 3, className: "bg-white rounded-lg border border-gray-200 p-4" }) })] })] }));
};
exports.StockListExample = StockListExample;
