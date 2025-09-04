import React from 'react';
interface StockPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}
export declare const StockPagination: React.FC<StockPaginationProps>;
export {};
