import React from 'react';
import { Stock } from '@concepts-radar/types';
import { StockListErrorBoundary } from './ErrorBoundary';
interface StockListProps {
    stocks: Stock[];
    onStockClick?: (stock: Stock) => void;
    className?: string;
    compact?: boolean;
    showFilters?: boolean;
    showPagination?: boolean;
    itemsPerPage?: number;
}
export declare const StockList: React.FC<StockListProps>;
export { StockListErrorBoundary };
