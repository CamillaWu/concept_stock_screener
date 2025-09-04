import React from 'react';
import { Stock } from '@concepts-radar/types';
interface StockItemProps {
    stock: Stock;
    onStockClick?: (stock: Stock) => void;
    compact?: boolean;
    className?: string;
}
export declare const StockItem: React.FC<StockItemProps>;
export {};
