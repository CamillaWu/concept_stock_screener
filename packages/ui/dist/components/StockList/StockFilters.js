"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockFilters = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
exports.StockFilters = react_1.default.memo(({ filters, onFilterChange, className = '' }) => {
    const filterOptions = [
        { key: 'favorites', label: '收藏', icon: '⭐' },
        { key: 'anomalies', label: '異常', icon: '⚠️' },
        { key: 'sentimentPositive', label: '正面', icon: '📈' },
        { key: 'sentimentNegative', label: '負面', icon: '📉' }
    ];
    return ((0, jsx_runtime_1.jsx)("div", { className: `flex flex-wrap gap-2 ${className}`, children: filterOptions.map(({ key, label, icon }) => ((0, jsx_runtime_1.jsxs)("button", { onClick: () => onFilterChange(key, !filters[key]), className: `flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${filters[key]
                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'}`, children: [(0, jsx_runtime_1.jsx)("span", { children: icon }), (0, jsx_runtime_1.jsx)("span", { children: label })] }, key))) }));
});
exports.StockFilters.displayName = 'StockFilters';
