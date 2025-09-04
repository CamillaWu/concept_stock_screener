"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentimentAnalysis = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const SentimentAnalysis = ({ data, showDetails = false, className = '' }) => {
    const getSentimentColor = (score) => {
        if (score >= 0.6)
            return 'text-green-600 bg-green-50';
        if (score >= 0.2)
            return 'text-blue-600 bg-blue-50';
        if (score >= -0.2)
            return 'text-gray-600 bg-gray-50';
        if (score >= -0.6)
            return 'text-orange-600 bg-orange-50';
        return 'text-red-600 bg-red-50';
    };
    const getSentimentLabel = (score) => {
        if (score >= 0.6)
            return '非常樂觀';
        if (score >= 0.2)
            return '樂觀';
        if (score >= -0.2)
            return '中性';
        if (score >= -0.6)
            return '悲觀';
        return '非常悲觀';
    };
    const getTrendIcon = (trend) => {
        switch (trend) {
            case 'up':
                return '↗️';
            case 'down':
                return '↘️';
            default:
                return '→';
        }
    };
    const formatScore = (score) => {
        return Math.round(score * 100);
    };
    if (!data) {
        return ((0, jsx_runtime_1.jsx)("div", { className: `p-3 bg-gray-50 rounded-lg ${className}`, children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center text-gray-500", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm", children: "\u60C5\u7DD2\u5206\u6790" }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs", children: "\u66AB\u7121\u8CC7\u6599" })] }) }));
    }
    const sentimentColor = getSentimentColor(data.score);
    const sentimentLabel = getSentimentLabel(data.score);
    const formattedScore = formatScore(data.score);
    return ((0, jsx_runtime_1.jsxs)("div", { className: `p-4 bg-white border border-gray-200 rounded-lg ${className}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-medium text-gray-900", children: "\u5E02\u5834\u60C5\u7DD2" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-500", children: getTrendIcon(data.trend) }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-500", children: "7\u5929\u8DA8\u52E2" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between mb-3", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("div", { className: `px-2 py-1 rounded text-xs font-medium ${sentimentColor}`, children: formattedScore }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-600", children: sentimentLabel })] }) }), showDetails && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500 mb-1", children: "\u4F86\u6E90\u5206\u4F48" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1 bg-gray-100 rounded p-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-600", children: "\u65B0\u805E" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm font-medium", children: [data.sources.news, "%"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 bg-gray-100 rounded p-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-600", children: "\u793E\u7FA4" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm font-medium", children: [data.sources.social, "%"] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500 mb-2", children: "7\u5929\u8DA8\u52E2" }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-end space-x-1 h-12", children: data.recentTrend.map((value, index) => ((0, jsx_runtime_1.jsx)("div", { className: "flex-1 bg-blue-200 rounded-t", style: {
                                        height: `${Math.abs(value) * 100}%`,
                                        backgroundColor: value >= 0 ? '#3B82F6' : '#EF4444'
                                    } }, index))) })] })] })), (0, jsx_runtime_1.jsx)("div", { className: "mt-3 pt-2 border-t border-gray-100", children: (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500", children: "\u57FA\u65BC\u65B0\u805E\u8207\u793E\u7FA4\u8A0E\u8AD6\u60C5\u7DD2\u5206\u6790" }) })] }));
};
exports.SentimentAnalysis = SentimentAnalysis;
