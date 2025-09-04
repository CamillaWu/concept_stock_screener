"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockListErrorBoundary = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
class StockListErrorBoundary extends react_1.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error
        };
    }
    componentDidCatch(error, errorInfo) {
        console.error('StockList Error Boundary caught an error:', error, errorInfo);
        // 調用錯誤處理回調
        this.props.onError?.(error, errorInfo);
        // 這裡可以整合錯誤報告服務
        // 例如：Sentry, LogRocket 等
    }
    render() {
        if (this.state.hasError) {
            // 自定義錯誤 UI
            if (this.props.fallback) {
                return this.props.fallback;
            }
            // 預設錯誤 UI
            return ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8 text-red-600 bg-red-50 rounded-lg border border-red-200", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-4xl mb-2", children: "\u26A0\uFE0F" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold mb-2", children: "\u80A1\u7968\u5217\u8868\u8F09\u5165\u5931\u6557" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600 mb-4", children: "\u62B1\u6B49\uFF0C\u8F09\u5165\u80A1\u7968\u8CC7\u6599\u6642\u767C\u751F\u932F\u8AA4" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => this.setState({ hasError: false }), className: "px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors", children: "\u91CD\u65B0\u8F09\u5165" }), process.env.NODE_ENV === 'development' && this.state.error && ((0, jsx_runtime_1.jsxs)("details", { className: "mt-4 text-left", children: [(0, jsx_runtime_1.jsx)("summary", { className: "cursor-pointer text-sm text-gray-500", children: "\u67E5\u770B\u932F\u8AA4\u8A73\u60C5 (\u958B\u767C\u6A21\u5F0F)" }), (0, jsx_runtime_1.jsx)("pre", { className: "mt-2 text-xs text-gray-600 bg-gray-100 p-2 rounded overflow-auto", children: this.state.error.stack })] }))] }));
        }
        return this.props.children;
    }
}
exports.StockListErrorBoundary = StockListErrorBoundary;
