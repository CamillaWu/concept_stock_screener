import React from 'react';
import { Stock, StockAnalysisResult } from '@concepts-radar/types';
interface StockDetailPanelProps {
    selectedStock?: Stock;
    analysis?: StockAnalysisResult;
    loading?: boolean;
    error?: string;
    onRetry?: () => void;
    className?: string;
    useRealData?: boolean;
    showStockAttribution?: boolean;
}
export declare const StockDetailPanel: React.FC<StockDetailPanelProps>;
export {};
