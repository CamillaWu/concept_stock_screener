"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadingSkeleton = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const LoadingSkeleton = ({ type = 'card', className = '' }) => {
    const renderSkeleton = () => {
        switch (type) {
            case 'card':
                return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg border border-gray-200 p-4 animate-pulse", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between mb-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-6 bg-gray-200 rounded w-1/3" }), (0, jsx_runtime_1.jsx)("div", { className: "h-4 bg-gray-200 rounded w-16" })] }), (0, jsx_runtime_1.jsx)("div", { className: "h-4 bg-gray-200 rounded w-full mb-2" }), (0, jsx_runtime_1.jsx)("div", { className: "h-4 bg-gray-200 rounded w-2/3" })] }));
            case 'list':
                return ((0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: [...Array(5)].map((_, i) => ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg border border-gray-200 p-4 animate-pulse", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-5 bg-gray-200 rounded w-1/4" }), (0, jsx_runtime_1.jsx)("div", { className: "h-4 bg-gray-200 rounded w-12" })] }), (0, jsx_runtime_1.jsx)("div", { className: "h-3 bg-gray-200 rounded w-3/4" })] }, i))) }));
            case 'bar':
                return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-1 h-3 bg-gray-200 rounded-full animate-pulse" }), (0, jsx_runtime_1.jsx)("div", { className: "h-4 bg-gray-200 rounded w-8 animate-pulse" })] }));
            case 'text':
                return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-4 bg-gray-200 rounded w-full animate-pulse" }), (0, jsx_runtime_1.jsx)("div", { className: "h-4 bg-gray-200 rounded w-3/4 animate-pulse" }), (0, jsx_runtime_1.jsx)("div", { className: "h-4 bg-gray-200 rounded w-1/2 animate-pulse" })] }));
            default:
                return (0, jsx_runtime_1.jsx)("div", { className: "h-4 bg-gray-200 rounded animate-pulse" });
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: className, "aria-hidden": "true", children: renderSkeleton() }));
};
exports.LoadingSkeleton = LoadingSkeleton;
