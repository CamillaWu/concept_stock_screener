import React from 'react';

interface ConceptStrengthProps {
  strengthScore?: number;
  dimensions?: {
    marketCapRatio: number; // 市值佔比 0-100
    priceContribution: number; // 漲幅貢獻度 0-100
    discussionLevel: number; // 討論度 0-100
  };
  className?: string;
}

const ConceptStrength: React.FC<ConceptStrengthProps> = ({
  strengthScore,
  dimensions,
  className = ''
}) => {
  const defaultDimensions = {
    marketCapRatio: 75,
    priceContribution: 60,
    discussionLevel: 85
  };

  const dims = dimensions || defaultDimensions;
  const score = strengthScore || Math.round((dims.marketCapRatio + dims.priceContribution + dims.discussionLevel) / 3);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return '極強';
    if (score >= 60) return '強';
    if (score >= 40) return '中等';
    return '弱';
  };

  const getDimensionColor = (value: number) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-blue-600';
    if (value >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 綜合強度分數 */}
      <div className="text-center">
        <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-bold ${getScoreColor(score)}`}>
          <span className="text-2xl mr-2">{score}</span>
          <span>{getScoreLabel(score)}</span>
        </div>
        <p className="text-sm text-gray-600 mt-2">綜合強度分數</p>
      </div>

      {/* 三個維度 */}
      <div className="space-y-3">
        {/* 市值佔比 */}
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">市值佔比</span>
            <span className={`text-lg font-bold ${getDimensionColor(dims.marketCapRatio)}`}>
              {dims.marketCapRatio}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${dims.marketCapRatio}%` }}
            />
          </div>
        </div>

        {/* 漲幅貢獻度 */}
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">漲幅貢獻度</span>
            <span className={`text-lg font-bold ${getDimensionColor(dims.priceContribution)}`}>
              {dims.priceContribution}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${dims.priceContribution}%` }}
            />
          </div>
        </div>

        {/* 討論度 */}
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">討論熱度</span>
            <span className={`text-lg font-bold ${getDimensionColor(dims.discussionLevel)}`}>
              {dims.discussionLevel}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${dims.discussionLevel}%` }}
            />
          </div>
        </div>
      </div>

      {/* 說明 */}
      <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
        <p className="mb-1"><strong>市值佔比：</strong>該概念相關股票在整體市場的市值佔比</p>
        <p className="mb-1"><strong>漲幅貢獻度：</strong>該概念股票對市場漲幅的貢獻程度</p>
        <p><strong>討論熱度：</strong>新聞和社群對該概念的討論程度</p>
      </div>
    </div>
  );
};

export { ConceptStrength };
