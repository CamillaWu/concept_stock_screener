"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockListErrorBoundary = exports.StockList = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const StockItem_1 = require("./StockItem");
const StockFilters_1 = require("./StockFilters");
const StockPagination_1 = require("./StockPagination");
const ErrorBoundary_1 = require("./ErrorBoundary");
Object.defineProperty(exports, "StockListErrorBoundary", { enumerable: true, get: function () { return ErrorBoundary_1.StockListErrorBoundary; } });
exports.StockList = react_1.default.memo(({ stocks, onStockClick, className = '', compact = false, showFilters = false, showPagination = false, itemsPerPage = 10 }) => {
    // 狀態管理
    const [filters, setFilters] = (0, react_1.useState)({});
    const [currentPage, setCurrentPage] = (0, react_1.useState)(1);
    // 篩選邏輯
    const filteredStocks = (0, react_1.useMemo)(() => {
        let result = stocks;
        // 應用篩選條件
        if (filters.favorites) {
            // 這裡需要整合收藏功能
            // result = result.filter(stock => isFavorite(stock.ticker));
        }
        if (filters.anomalies) {
            // 篩選異常股票（價格或成交量異常）
            result = result.filter(stock => {
                // 這裡需要整合異常檢測邏輯
                return false; // 暫時返回 false
            });
        }
        if (filters.sentimentPositive) {
            // 篩選正面情緒股票
            // 需要整合情緒分析數據
        }
        if (filters.sentimentNegative) {
            // 篩選負面情緒股票
            // 需要整合情緒分析數據
        }
        return result;
    }, [stocks, filters]);
    // 分頁邏輯
    const paginatedStocks = (0, react_1.useMemo)(() => {
        if (!showPagination)
            return filteredStocks;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredStocks.slice(startIndex, endIndex);
    }, [filteredStocks, currentPage, itemsPerPage, showPagination]);
    const totalPages = (0, react_1.useMemo)(() => {
        if (!showPagination)
            return 1;
        return Math.ceil(filteredStocks.length / itemsPerPage);
    }, [filteredStocks.length, itemsPerPage, showPagination]);
    // 事件處理
    const handleFilterChange = (0, react_1.useCallback)((filter, value) => {
        setFilters(prev => ({
            ...prev,
            [filter]: value
        }));
        setCurrentPage(1); // 重置到第一頁
    }, []);
    const handlePageChange = (0, react_1.useCallback)((page) => {
        setCurrentPage(page);
    }, []);
    const handleStockClick = (0, react_1.useCallback)((stock) => {
        onStockClick?.(stock);
    }, [onStockClick]);
    // 空狀態處理
    if (stocks.length === 0) {
        return ((0, jsx_runtime_1.jsx)("div", { className: `text-center py-8 text-gray-500 ${className}`, children: "\u6C92\u6709\u76F8\u95DC\u80A1\u7968" }));
    }
    // 篩選後無結果
    if (filteredStocks.length === 0) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: `text-center py-8 text-gray-500 ${className}`, children: [(0, jsx_runtime_1.jsx)("div", { className: "text-4xl mb-2", children: "\uD83D\uDD0D" }), (0, jsx_runtime_1.jsx)("p", { children: "\u6C92\u6709\u7B26\u5408\u7BE9\u9078\u689D\u4EF6\u7684\u80A1\u7968" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setFilters({}), className: "mt-2 text-blue-600 hover:text-blue-800 underline", children: "\u6E05\u9664\u7BE9\u9078\u689D\u4EF6" })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: `space-y-4 ${className}`, children: [showFilters && ((0, jsx_runtime_1.jsx)(StockFilters_1.StockFilters, { filters: filters, onFilterChange: handleFilterChange })), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: paginatedStocks.map((stock) => ((0, jsx_runtime_1.jsx)(StockItem_1.StockItem, { stock: stock, onStockClick: handleStockClick, compact: compact }, stock.ticker))) }), showPagination && totalPages > 1 && ((0, jsx_runtime_1.jsx)(StockPagination_1.StockPagination, { currentPage: currentPage, totalPages: totalPages, onPageChange: handlePageChange })), showFilters && ((0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-500 text-center", children: ["\u986F\u793A ", paginatedStocks.length, " / ", filteredStocks.length, " \u6A94\u80A1\u7968", filters.favorites || filters.anomalies || filters.sentimentPositive || filters.sentimentNegative ? ((0, jsx_runtime_1.jsx)("span", { className: "ml-2", children: "(\u5DF2\u5957\u7528\u7BE9\u9078\u689D\u4EF6)" })) : null] }))] }));
});
exports.StockList.displayName = 'StockList';
