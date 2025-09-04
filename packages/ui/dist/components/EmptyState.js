"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyState = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const EmptyState = ({ title = '沒有找到結果', message = '請嘗試其他搜尋條件', icon, action, className = '' }) => {
    const defaultIcon = ((0, jsx_runtime_1.jsx)("svg", { className: "w-12 h-12 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": "true", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }));
    return ((0, jsx_runtime_1.jsxs)("div", { className: `flex flex-col items-center justify-center p-8 text-center ${className}`, children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-4", children: icon || defaultIcon }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: title }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 mb-4 max-w-sm", children: message }), action && ((0, jsx_runtime_1.jsx)("div", { className: "mt-4", children: action }))] }));
};
exports.EmptyState = EmptyState;
