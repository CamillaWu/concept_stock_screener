import React from 'react';
import { ExclamationTriangleIcon, TrendingUpIcon, TrendingDownIcon, ChartBarIcon } from '@heroicons/react/outline';

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

const AnomalyAlert: React.FC<AnomalyAlertProps> = ({
  events = [],
  showDetails = false,
  className = ''
}) => {
  const getAnomalyIcon = (type: string) => {
    switch (type) {
      case 'price_up':
        return <TrendingUpIcon className="w-4 h-4 text-red-500" />;
      case 'price_down':
        return <TrendingDownIcon className="w-4 h-4 text-green-500" />;
      case 'volume_up':
      case 'volume_down':
        return <ChartBarIcon className="w-4 h-4 text-orange-500" />;
      default:
        return <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getAnomalyLabel = (type: string, value: number) => {
    switch (type) {
      case 'price_up':
        return `▲${value}%`;
      case 'price_down':
        return `▼${Math.abs(value)}%`;
      case 'volume_up':
        return `VOL↑${value}x`;
      case 'volume_down':
        return `VOL↓${value}x`;
      default:
        return '異常';
    }
  };

  const getAnomalyColor = (type: string) => {
    switch (type) {
      case 'price_up':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'price_down':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'volume_up':
      case 'volume_down':
        return 'bg-orange-50 border-orange-200 text-orange-700';
      default:
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
    }
  };

  const getAnomalyDescription = (type: string, value: number, threshold: number) => {
    switch (type) {
      case 'price_up':
        return `漲幅超過${threshold}% (實際: ${value}%)`;
      case 'price_down':
        return `跌幅超過${threshold}% (實際: ${Math.abs(value)}%)`;
      case 'volume_up':
        return `成交量放大${threshold}倍以上 (實際: ${value}x)`;
      case 'volume_down':
        return `成交量萎縮${threshold}倍以上 (實際: ${value}x)`;
      default:
        return '檢測到異常波動';
    }
  };

  if (events.length === 0) {
    return null;
  }

  // 只顯示最嚴重的一個異常
  const primaryEvent = events[0];
  const anomalyColor = getAnomalyColor(primaryEvent.type);
  const anomalyLabel = getAnomalyLabel(primaryEvent.type, primaryEvent.value);

  return (
    <div className={`${className}`}>
      {/* 主要異常標籤 */}
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${anomalyColor}`}>
        {getAnomalyIcon(primaryEvent.type)}
        <span className="ml-1">{anomalyLabel}</span>
      </div>

      {/* 詳細異常列表 */}
      {showDetails && events.length > 0 && (
        <div className="mt-3 p-3 bg-white border border-gray-200 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-3">異常事件</h4>
          <div className="space-y-2">
            {events.map((event, index) => (
              <div key={index} className="flex items-start space-x-2 p-2 bg-gray-50 rounded">
                {getAnomalyIcon(event.type)}
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {getAnomalyDescription(event.type, event.value, event.threshold)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {event.timestamp} • 影響個股: {event.affectedStocks.join(', ')}
                  </div>
                  {event.description && (
                    <div className="text-xs text-gray-600 mt-1">
                      {event.description}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnomalyAlert;
