"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrendingList = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const ThemeCard_1 = require("./ThemeCard");
const TrendingList = ({ themes, onThemeClick, onStockClick, className = '', loading = false, error = null, onRetry, onToggleFavorite, isFavorite }) => {
    const [sortBy, setSortBy] = (0, react_1.useState)('heat');
    const [sortOrder, setSortOrder] = (0, react_1.useState)('desc');
    // 確保 themes 始終是一個陣列
    const safeThemes = Array.isArray(themes) ? themes : [];
    const sortedThemes = (0, react_1.useMemo)(() => {
        const sorted = [...safeThemes].sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'heat':
                    comparison = (a.heatScore || 0) - (b.heatScore || 0);
                    break;
                case 'stocks':
                    comparison = a.stocks.length - b.stocks.length;
                    break;
                case 'name':
                    comparison = a.theme.localeCompare(b.theme);
                    break;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });
        return sorted;
    }, [safeThemes, sortBy, sortOrder]);
    const handleSort = (option) => {
        if (sortBy === option) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        }
        else {
            setSortBy(option);
            setSortOrder('desc');
        }
    };
    if (loading) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: `p-6 ${className}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-6 bg-gray-200 rounded w-1/4 mb-2" }), (0, jsx_runtime_1.jsx)("div", { className: "h-4 bg-gray-200 rounded w-1/2" })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: [...Array(5)].map((_, i) => ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg border border-gray-200 p-6 animate-pulse", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-6 bg-gray-200 rounded w-1/3 mb-2" }), (0, jsx_runtime_1.jsx)("div", { className: "h-4 bg-gray-200 rounded w-1/4" })] }), (0, jsx_runtime_1.jsx)("div", { className: "h-6 bg-gray-200 rounded w-16" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4 mb-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-12 bg-gray-200 rounded" }), (0, jsx_runtime_1.jsx)("div", { className: "h-12 bg-gray-200 rounded" })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: [...Array(3)].map((_, j) => ((0, jsx_runtime_1.jsx)("div", { className: "h-10 bg-gray-200 rounded" }, j))) })] }, i))) })] }));
    }
    if (error) {
        return ((0, jsx_runtime_1.jsx)("div", { className: `p-6 text-center ${className}`, children: (0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-8 h-8 text-red-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" }) }) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "\u8F09\u5165\u5931\u6557" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-500 mb-4", children: error }), onRetry && ((0, jsx_runtime_1.jsxs)("button", { onClick: onRetry, className: "inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg", children: [(0, jsx_runtime_1.jsx)("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" }) }), "\u91CD\u65B0\u8F09\u5165"] }))] }) }));
    }
    if (safeThemes.length === 0) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: `p-6 text-center ${className}`, children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-8 h-8 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" }) }) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "\u76EE\u524D\u6C92\u6709\u71B1\u9580\u6982\u5FF5" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-500", children: "\u8ACB\u7A0D\u5F8C\u518D\u8A66\u6216\u5617\u8A66\u641C\u5C0B\u5176\u4ED6\u4E3B\u984C" })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: `p-6 ${className}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-900", children: "\u71B1\u9580\u6982\u5FF5" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-sm text-gray-500", children: [(0, jsx_runtime_1.jsx)("span", { children: "\u6392\u5E8F\u65B9\u5F0F\uFF1A" }), (0, jsx_runtime_1.jsx)("div", { className: "flex bg-gray-100 rounded-lg p-1", children: [
                                            { key: 'heat', label: '熱度' },
                                            { key: 'stocks', label: '股票數' },
                                            { key: 'name', label: '名稱' }
                                        ].map((option) => ((0, jsx_runtime_1.jsx)("button", { onClick: () => handleSort(option.key), className: `px-3 py-1 rounded-md text-xs font-medium transition-colors ${sortBy === option.key
                                                ? 'bg-white text-gray-900 shadow-sm'
                                                : 'text-gray-600 hover:text-gray-900'}`, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [option.label, sortBy === option.key && ((0, jsx_runtime_1.jsx)("svg", { className: `w-3 h-3 transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 15l7-7 7 7" }) }))] }) }, option.key))) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-3 gap-4 mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center p-4 bg-blue-50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-blue-600", children: safeThemes.length }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-blue-700", children: "\u7E3D\u6982\u5FF5\u6578" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center p-4 bg-green-50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-green-600", children: safeThemes.reduce((sum, theme) => sum + theme.stocks.length, 0) }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-green-700", children: "\u7E3D\u80A1\u7968\u6578" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center p-4 bg-orange-50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-orange-600", children: Math.round(safeThemes.reduce((sum, theme) => sum + (theme.heatScore || 0), 0) / safeThemes.length) }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-orange-700", children: "\u5E73\u5747\u71B1\u5EA6" })] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-6", children: sortedThemes.map((theme, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [index < 3 && ((0, jsx_runtime_1.jsx)("div", { className: "absolute -top-2 -left-2 z-10", children: (0, jsx_runtime_1.jsx)("div", { className: `w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${index === 0 ? 'bg-yellow-500' :
                                    index === 1 ? 'bg-gray-400' :
                                        'bg-orange-500'}`, children: index + 1 }) })), (0, jsx_runtime_1.jsx)(ThemeCard_1.ThemeCard, { theme: theme, onSelect: () => onThemeClick?.(theme), compact: false, onToggleFavorite: onToggleFavorite, isFavorite: isFavorite })] }, theme.id))) }), (0, jsx_runtime_1.jsx)("div", { className: "mt-6 text-center", children: (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-500", children: ["\u5171 ", safeThemes.length, " \u500B\u71B1\u9580\u6982\u5FF5 \u2022 \u6BCF 5 \u5206\u9418\u81EA\u52D5\u66F4\u65B0"] }) })] }));
};
exports.TrendingList = TrendingList;
