import React from 'react';

interface SentimentData {
  score: number; // -1.0 到 +1.0
  trend: 'up' | 'down' | 'stable';
  sources: {
    news: number;
    social: number;
  };
  recentTrend: number[]; // 最近7天的數據
}

interface SentimentAnalysisProps {
  data?: SentimentData;
  showDetails?: boolean;
  className?: string;
}

const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({
  data,
  showDetails = false,
  className = ''
}) => {
  const getSentimentColor = (score: number) => {
    if (score >= 0.6) return 'text-green-600 bg-green-50';
    if (score >= 0.2) return 'text-blue-600 bg-blue-50';
    if (score >= -0.2) return 'text-gray-600 bg-gray-50';
    if (score >= -0.6) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getSentimentLabel = (score: number) => {
    if (score >= 0.6) return '非常樂觀';
    if (score >= 0.2) return '樂觀';
    if (score >= -0.2) return '中性';
    if (score >= -0.6) return '悲觀';
    return '非常悲觀';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return '↗️';
      case 'down':
        return '↘️';
      default:
        return '→';
    }
  };

  const formatScore = (score: number) => {
    return Math.round(score * 100);
  };

  if (!data) {
    return (
      <div className={`p-3 bg-gray-50 rounded-lg ${className}`}>
        <div className="text-center text-gray-500">
          <div className="text-sm">情緒分析</div>
          <div className="text-xs">暫無資料</div>
        </div>
      </div>
    );
  }

  const sentimentColor = getSentimentColor(data.score);
  const sentimentLabel = getSentimentLabel(data.score);
  const formattedScore = formatScore(data.score);

  return (
    <div className={`p-4 bg-white border border-gray-200 rounded-lg ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">市場情緒</h3>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">{getTrendIcon(data.trend)}</span>
          <span className="text-xs text-gray-500">7天趨勢</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`px-2 py-1 rounded text-xs font-medium ${sentimentColor}`}>
            {formattedScore}
          </div>
          <span className="text-sm text-gray-600">{sentimentLabel}</span>
        </div>
      </div>

      {showDetails && (
        <div className="space-y-3">
          <div>
            <div className="text-xs text-gray-500 mb-1">來源分佈</div>
            <div className="flex space-x-2">
              <div className="flex-1 bg-gray-100 rounded p-2">
                <div className="text-xs text-gray-600">新聞</div>
                <div className="text-sm font-medium">{data.sources.news}%</div>
              </div>
              <div className="flex-1 bg-gray-100 rounded p-2">
                <div className="text-xs text-gray-600">社群</div>
                <div className="text-sm font-medium">{data.sources.social}%</div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-2">7天趨勢</div>
            <div className="flex items-end space-x-1 h-12">
              {data.recentTrend.map((value, index) => (
                <div
                  key={index}
                  className="flex-1 bg-blue-200 rounded-t"
                  style={{
                    height: `${Math.abs(value) * 100}%`,
                    backgroundColor: value >= 0 ? '#3B82F6' : '#EF4444'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-3 pt-2 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          基於新聞與社群討論情緒分析
        </div>
      </div>
    </div>
  );
};

export { SentimentAnalysis };
