"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockItem = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const HeatBar_1 = require("../HeatBar");
exports.StockItem = react_1.default.memo(({ stock, onStockClick, compact = false, className = '' }) => {
    const handleClick = () => {
        onStockClick?.(stock);
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: `bg-white rounded-lg border border-gray-200 p-3 hover:border-gray-300 transition-colors cursor-pointer ${compact ? 'p-2' : ''} ${className}`, onClick: handleClick, role: "button", tabIndex: 0, onKeyDown: handleKeyDown, "aria-label": `選擇股票：${stock.name} (${stock.ticker})`, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium text-gray-900 truncate", children: stock.ticker }), stock.name && ((0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-500 truncate", children: stock.name }))] }), stock.concepts && stock.concepts.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap gap-1", children: [stock.concepts.slice(0, compact ? 2 : 3).map((concept, index) => ((0, jsx_runtime_1.jsx)("span", { className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800", children: concept }, index))), stock.concepts.length > (compact ? 2 : 3) && ((0, jsx_runtime_1.jsxs)("span", { className: "text-xs text-gray-500", children: ["+", stock.concepts.length - (compact ? 2 : 3)] }))] }))] }), (0, jsx_runtime_1.jsx)("div", { className: "ml-3 flex-shrink-0", children: (0, jsx_runtime_1.jsx)(HeatBar_1.HeatBar, { score: stock.heatScore || 0, size: "sm", showScore: !compact }) })] }) }));
});
exports.StockItem.displayName = 'StockItem';
