import React from 'react';
import type { StockConcept, Stock } from '@concepts-radar/types';
interface ThemeCardProps {
    theme: StockConcept;
    onSelect?: (theme: StockConcept) => void;
    onClick?: (theme: StockConcept) => void;
    onSelectStock?: (stock: Stock) => void;
    className?: string;
    compact?: boolean;
    showAnomaly?: boolean;
    showSentiment?: boolean;
    onToggleFavorite?: (themeId: string, themeName: string) => void;
    isFavorite?: (themeId: string) => boolean;
}
export declare const ThemeCard: React.FC<ThemeCardProps>;
export {};
