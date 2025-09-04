import React from 'react';
interface StockFiltersProps {
    filters: {
        favorites?: boolean;
        anomalies?: boolean;
        sentimentPositive?: boolean;
        sentimentNegative?: boolean;
    };
    onFilterChange: (filter: string, value: boolean) => void;
    className?: string;
}
export declare const StockFilters: React.FC<StockFiltersProps>;
export {};
