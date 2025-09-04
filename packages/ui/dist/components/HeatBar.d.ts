import React from 'react';
interface HeatBarProps {
    score: number;
    size?: 'small' | 'medium' | 'large' | 'sm' | 'md';
    showScore?: boolean;
    className?: string;
}
export declare const HeatBar: React.FC<HeatBarProps>;
export {};
