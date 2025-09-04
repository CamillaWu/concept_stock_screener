import React from 'react';
interface AnomalyEvent {
    type: 'price_up' | 'price_down' | 'volume_up' | 'volume_down';
    value: number;
    threshold: number;
    timestamp: string;
    description: string;
    affectedStocks: string[];
}
interface AnomalyAlertProps {
    events?: AnomalyEvent[];
    showDetails?: boolean;
    className?: string;
}
export declare const AnomalyAlert: React.FC<AnomalyAlertProps>;
export {};
