import React from 'react';
import type { StockConcept } from '@concepts-radar/types';

interface StockToThemePillsProps {
  themes: StockConcept[];
  onThemeClick?: (theme: StockConcept) => void;
  maxThemes?: number;
}

const StockToThemePills: React.FC<StockToThemePillsProps> = ({
  themes,
  onThemeClick,
  maxThemes = 5
}) => {
  const displayThemes = themes?.slice(0, maxThemes) || [];

  if (displayThemes.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        <p>暫無相關主題</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-700">
        相關主題 ({displayThemes.length})
      </h4>
      <div className="flex flex-wrap gap-2">
        {displayThemes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onThemeClick?.(theme)}
            className="px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors border border-blue-200"
            aria-label={`選擇主題：${theme.theme}`}
          >
            {theme.theme}
          </button>
        ))}
      </div>
      
      {/* 顯示更多提示 */}
      {themes && themes.length > maxThemes && (
        <div className="text-sm text-gray-500">
          還有 {themes.length - maxThemes} 個主題...
        </div>
      )}
    </div>
  );
};

export default StockToThemePills;
