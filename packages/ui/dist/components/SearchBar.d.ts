import React from 'react';
import type { SearchMode } from '@concepts-radar/types';
interface SearchBarProps {
    mode: SearchMode;
    onModeChange: (mode: SearchMode) => void;
    onSearch: (query: string, mode: SearchMode, useRealData: boolean) => void;
    useRealData?: boolean;
    onUseRealDataChange?: (useRealData: boolean) => void;
    placeholder?: string;
    loading?: boolean;
    className?: string;
}
export declare const SearchBar: React.FC<SearchBarProps>;
export {};
