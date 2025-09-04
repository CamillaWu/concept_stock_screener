import React from 'react';
import { Stock } from '@concepts-radar/types';
interface StockListProps {
    stocks: Stock[];
    onStockClick?: (stock: Stock) => void;
    className?: string;
    compact?: boolean;
}
export declare const StockList: React.FC<StockListProps>;
export {};
