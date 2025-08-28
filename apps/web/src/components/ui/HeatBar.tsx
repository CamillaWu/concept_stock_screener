import React from 'react';

interface HeatBarProps {
  score: number;
  size?: 'small' | 'medium' | 'large' | 'sm' | 'md';
  showScore?: boolean;
  className?: string;
}

export const HeatBar: React.FC<HeatBarProps> = ({
  score,
  size = 'medium',
  showScore = true,
  className = ''
}) => {
  // 確保分數在 0-100 範圍內
  const normalizedScore = Math.max(0, Math.min(100, score));
  
  // 根據分數決定顏色
  const getColorClass = (score: number) => {
    if (score >= 80) return 'bg-red-500';
    if (score >= 60) return 'bg-orange-500';
    if (score >= 40) return 'bg-yellow-500';
    if (score >= 20) return 'bg-blue-500';
    return 'bg-gray-400';
  };

         // 根據尺寸決定高度
       const getHeightClass = (size: string) => {
         switch (size) {
           case 'small':
           case 'sm': return 'h-2';
           case 'large': return 'h-4';
           case 'medium':
           case 'md':
           default: return 'h-3';
         }
       };

  // 根據分數決定文字顏色
  const getTextColorClass = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    if (score >= 40) return 'text-yellow-600';
    if (score >= 20) return 'text-blue-600';
    return 'text-gray-600';
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* 熱度條 */}
      <div className={`flex-1 bg-gray-200 rounded-full overflow-hidden ${getHeightClass(size)}`}>
        <div
          className={`h-full transition-all duration-300 ease-out ${getColorClass(normalizedScore)}`}
          style={{ width: `${normalizedScore}%` }}
          role="progressbar"
          aria-valuenow={normalizedScore}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`熱度分數：${normalizedScore}`}
        />
      </div>
      
      {/* 分數顯示 */}
      {showScore && (
        <span className={`text-sm font-medium min-w-[2rem] text-right ${getTextColorClass(normalizedScore)}`}>
          {normalizedScore}
        </span>
      )}
    </div>
  );
};
