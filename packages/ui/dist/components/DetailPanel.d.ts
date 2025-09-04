import React from 'react';
import { StockConcept, Stock } from '@concepts-radar/types';
interface ConceptStrengthData {
    strengthScore: number;
    dimensions: {
        marketCapRatio: number;
        priceContribution: number;
        discussionLevel: number;
    };
}
interface SentimentData {
    score: number;
    trend: 'up' | 'down' | 'stable';
    sources: {
        news: number;
        social: number;
    };
    recentTrend: number[];
}
interface AnomalyEvent {
    type: 'price_up' | 'price_down' | 'volume_up' | 'volume_down';
    value: number;
    threshold: number;
    timestamp: string;
    description: string;
    affectedStocks: string[];
}
interface DetailPanelProps {
    selectedTheme?: StockConcept;
    relatedStocks?: Stock[];
    loading?: boolean;
    error?: string;
    onStockClick?: (stock: Stock) => void;
    onRetry?: () => void;
    className?: string;
    conceptStrength?: ConceptStrengthData | null;
    sentiment?: SentimentData | null;
    anomalyEvents?: AnomalyEvent[];
    showAdvancedAnalysis?: boolean;
}
export declare const DetailPanel: React.FC<DetailPanelProps>;
export {};
