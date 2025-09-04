import React from 'react';
interface SentimentData {
    score: number;
    trend: 'up' | 'down' | 'stable';
    sources: {
        news: number;
        social: number;
    };
    recentTrend: number[];
}
interface SentimentAnalysisProps {
    data?: SentimentData;
    showDetails?: boolean;
    className?: string;
}
export declare const SentimentAnalysis: React.FC<SentimentAnalysisProps>;
export {};
