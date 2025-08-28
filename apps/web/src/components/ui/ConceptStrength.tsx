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
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return '極強';
    if (score >= 60) return '強';
    if (score >= 40) return '中等';
    return '弱';
  };

  if (!strengthScore && !dimensions) {
    return (
      <div className={`p-4 bg-gray-50 rounded-lg ${className}`}>
        <div className="text-center text-gray-500">
          <div className="text-sm font-medium mb-2">概念強度分析</div>
          <div className="text-xs">暫無資料</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 bg-white border border-gray-200 rounded-lg ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">概念強度</h3>
        <div className="text-right">
          <div className={`text-2xl font-bold ${getScoreColor(score)}`}>
            {score}
          </div>
          <div className="text-xs text-gray-500">{getScoreLabel(score)}</div>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">市值佔比</span>
            <span className="font-medium">{dims.marketCapRatio}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${dims.marketCapRatio}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">漲幅貢獻</span>
            <span className="font-medium">{dims.priceContribution}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${dims.priceContribution}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">討論熱度</span>
            <span className="font-medium">{dims.discussionLevel}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${dims.discussionLevel}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          基於市值佔比、漲幅貢獻、討論熱度三維度綜合評估
        </div>
      </div>
    </div>
  );
};

export default ConceptStrength;
