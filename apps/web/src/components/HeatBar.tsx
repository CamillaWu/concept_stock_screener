import React, { useState } from 'react';

interface HeatBarProps {
  score?: number;
  size?: 'small' | 'medium' | 'large';
  showValue?: boolean;
  className?: string;
  tooltipContent?: string;
}

export default function HeatBar({ 
  score, 
  size = 'medium',
  showValue = true,
  className = '',
  tooltipContent
}: HeatBarProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  // 根據分數計算顏色
  const getColorClass = (score: number) => {
    if (score >= 80) return 'bg-red-500';
    if (score >= 60) return 'bg-orange-500';
    if (score >= 40) return 'bg-yellow-500';
    if (score >= 20) return 'bg-blue-500';
    return 'bg-gray-400';
  };

  // 根據尺寸設定樣式
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'h-2 text-xs';
      case 'large':
        return 'h-4 text-sm';
      default:
        return 'h-3 text-sm';
    }
  };

  // 預設 tooltip 內容
  const defaultTooltip = tooltipContent || 
    `市場熱度：${score || 0}/100\n由近7日新聞/社群分佈 + 搜尋熱度估算`;

  if (score === undefined || score === null) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className={`flex-1 bg-gray-200 rounded ${getSizeClasses()}`}>
          <div className="h-full bg-gray-300 rounded animate-pulse"></div>
        </div>
        {showValue && <span className="text-gray-400">—</span>}
      </div>
    );
  }

  const clampedScore = Math.max(0, Math.min(100, score));
  const percentage = `${clampedScore}%`;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div 
        className={`flex-1 bg-gray-200 rounded relative ${getSizeClasses()}`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        role="progressbar"
        aria-valuenow={clampedScore}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`市場熱度：${clampedScore}分`}
      >
        <div 
          className={`h-full rounded transition-all duration-300 ${getColorClass(clampedScore)}`}
          style={{ width: percentage }}
        />
        
        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-pre-line z-10">
            {defaultTooltip}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        )}
      </div>
      
      {showValue && (
        <span className="font-medium text-gray-700 min-w-[2.5rem] text-right">
          {clampedScore}
        </span>
      )}
    </div>
  );
}
