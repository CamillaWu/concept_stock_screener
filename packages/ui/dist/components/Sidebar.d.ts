import React from 'react';
import type { StockConcept } from '@concepts-radar/types';
interface SidebarProps {
    collapsed: boolean;
    onToggleCollapse: () => void;
    trendingThemes: StockConcept[];
    loading?: boolean;
    error?: string | null;
    onRetry?: () => void;
    onThemeClick: (theme: StockConcept) => void;
    useRealData: boolean;
    onUseRealDataChange: (useRealData: boolean) => void;
    lastUpdated?: Date | null;
    className?: string;
    onToggleFavorite?: (themeId: string, themeName: string) => void;
    isFavorite?: (themeId: string) => boolean;
}
export declare const Sidebar: React.FC<SidebarProps>;
export {};
