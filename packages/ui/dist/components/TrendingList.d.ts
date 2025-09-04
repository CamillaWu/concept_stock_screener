import React from 'react';
import { StockConcept } from '@concepts-radar/types';
interface TrendingListProps {
    themes: StockConcept[];
    onThemeClick?: (theme: StockConcept) => void;
    onStockClick?: (stock: any) => void;
    className?: string;
    loading?: boolean;
    error?: string | null;
    onRetry?: () => void;
    onToggleFavorite?: (themeId: string, themeName: string) => void;
    isFavorite?: (themeId: string) => boolean;
}
export declare const TrendingList: React.FC<TrendingListProps>;
export {};
