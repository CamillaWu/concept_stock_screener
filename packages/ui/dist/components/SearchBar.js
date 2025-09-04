"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchBar = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const SearchBar = ({ mode, onModeChange, onSearch, useRealData = false, onUseRealDataChange, placeholder, loading = false }) => {
    const [query, setQuery] = (0, react_1.useState)('');
    const [suggestions, setSuggestions] = (0, react_1.useState)([]);
    const [showSuggestions, setShowSuggestions] = (0, react_1.useState)(false);
    const [focused, setFocused] = (0, react_1.useState)(false);
    // 搜尋建議
    const themeSuggestions = ['AI', '光通訊', '電動車', '半導體', '生技', '綠能', '元宇宙', '5G'];
    const stockSuggestions = ['2330', '2317', '2454', '1301', '2881', '2412', '2308', '1303'];
    (0, react_1.useEffect)(() => {
        if (query.trim()) {
            const currentSuggestions = mode === 'theme'
                ? themeSuggestions.filter(s => s.toLowerCase().includes(query.toLowerCase()))
                : stockSuggestions.filter(s => s.toLowerCase().includes(query.toLowerCase()));
            setSuggestions(currentSuggestions.slice(0, 5));
            setShowSuggestions(true);
        }
        else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [query, mode]);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim() && !loading) {
            onSearch(query.trim(), mode, useRealData);
            setShowSuggestions(false);
        }
    };
    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion);
        setShowSuggestions(false);
        onSearch(suggestion, mode, useRealData);
    };
    const getPlaceholder = () => {
        if (placeholder)
            return placeholder;
        return mode === 'theme'
            ? '搜尋主題，如：光通訊'
            : '輸入股號/名稱，如：2330 或 台積電';
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "w-full max-w-4xl mx-auto", children: [(0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "flex flex-col lg:flex-row gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex bg-gray-100 rounded-xl p-1 shadow-sm", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => onModeChange('theme'), className: `px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${mode === 'theme'
                                    ? 'bg-white text-gray-900 shadow-md hover-lift'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`, "aria-label": "\u4E3B\u984C\u641C\u5C0B\u6A21\u5F0F", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" }) }), "\u4E3B\u984C"] }) }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => onModeChange('stock'), className: `px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${mode === 'stock'
                                    ? 'bg-white text-gray-900 shadow-md hover-lift'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`, "aria-label": "\u500B\u80A1\u641C\u5C0B\u6A21\u5F0F", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" }) }), "\u500B\u80A1"] }) })] }), onUseRealDataChange && ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center", children: (0, jsx_runtime_1.jsxs)("label", { className: "flex items-center space-x-3 text-sm text-gray-600 bg-white px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: useRealData, onChange: (e) => onUseRealDataChange(e.target.checked), className: "sr-only" }), (0, jsx_runtime_1.jsx)("div", { className: `w-10 h-6 rounded-full transition-colors ${useRealData ? 'bg-green-500' : 'bg-gray-300'}`, children: (0, jsx_runtime_1.jsx)("div", { className: `w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${useRealData ? 'translate-x-4' : 'translate-x-1'}`, style: { marginTop: '4px' } }) })] }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "\u771F\u5BE6\u8CC7\u6599" }), useRealData && ((0, jsx_runtime_1.jsxs)("span", { className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800", children: [(0, jsx_runtime_1.jsx)("svg", { className: "w-3 h-3 mr-1", fill: "currentColor", viewBox: "0 0 20 20", children: (0, jsx_runtime_1.jsx)("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) }), "\u5DF2\u555F\u7528"] }))] }) })), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 relative", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", id: "search-input", name: "search-query", value: query, onChange: (e) => setQuery(e.target.value), onFocus: () => setFocused(true), onBlur: () => setTimeout(() => setFocused(false), 200), placeholder: getPlaceholder(), className: "w-full px-6 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 text-lg", disabled: loading, "aria-label": `搜尋${mode === 'theme' ? '主題' : '個股'}` }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none", children: loading ? ((0, jsx_runtime_1.jsx)("div", { className: "w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" })) : ((0, jsx_runtime_1.jsx)("svg", { className: "w-5 h-5 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) })) })] }), showSuggestions && suggestions.length > 0 && focused && ((0, jsx_runtime_1.jsx)("div", { className: "absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 slide-up", children: suggestions.map((suggestion, index) => ((0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => handleSuggestionClick(suggestion), className: "w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg focus:bg-gray-50 focus:outline-none", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("svg", { className: "w-4 h-4 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-700", children: suggestion })] }) }, index))) }))] }), (0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: loading || !query.trim(), className: "px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg hover-lift font-medium text-lg", "aria-label": "\u57F7\u884C\u641C\u5C0B", children: loading ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" }), "\u641C\u5C0B\u4E2D..."] })) : ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }), "\u641C\u5C0B"] })) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4 text-center text-sm text-gray-500", children: [(0, jsx_runtime_1.jsxs)("span", { className: "inline-flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)("kbd", { className: "px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded", children: "Ctrl" }), (0, jsx_runtime_1.jsx)("span", { children: "+" }), (0, jsx_runtime_1.jsx)("kbd", { className: "px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded", children: "K" }), (0, jsx_runtime_1.jsx)("span", { children: "\u5FEB\u901F\u641C\u5C0B" })] }), (0, jsx_runtime_1.jsx)("span", { className: "mx-2", children: "\u2022" }), (0, jsx_runtime_1.jsxs)("span", { className: "inline-flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)("kbd", { className: "px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded", children: "Tab" }), (0, jsx_runtime_1.jsx)("span", { children: "\u5207\u63DB\u6A21\u5F0F" })] })] })] }));
};
exports.SearchBar = SearchBar;
