"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockPagination = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
exports.StockPagination = react_1.default.memo(({ currentPage, totalPages, onPageChange, className = '' }) => {
    if (totalPages <= 1)
        return null;
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        }
        else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
            else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            }
            else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: `flex items-center justify-center gap-2 ${className}`, children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => onPageChange(currentPage - 1), disabled: currentPage === 1, className: "px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50", children: "\u4E0A\u4E00\u9801" }), getPageNumbers().map((page, index) => ((0, jsx_runtime_1.jsx)("button", { onClick: () => typeof page === 'number' && onPageChange(page), disabled: page === '...', className: `px-3 py-1 rounded border ${page === currentPage
                    ? 'bg-blue-500 text-white border-blue-500'
                    : page === '...'
                        ? 'border-transparent cursor-default'
                        : 'border-gray-300 hover:bg-gray-50'}`, children: page }, index))), (0, jsx_runtime_1.jsx)("button", { onClick: () => onPageChange(currentPage + 1), disabled: currentPage === totalPages, className: "px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50", children: "\u4E0B\u4E00\u9801" })] }));
});
exports.StockPagination.displayName = 'StockPagination';
