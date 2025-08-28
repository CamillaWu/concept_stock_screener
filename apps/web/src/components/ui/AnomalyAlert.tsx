import React from 'react';
import { ExclamationTriangleIcon, TrendingUpIcon, TrendingDownIcon, ChartBarIcon } from '@heroicons/react/24/outline';

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
        return <ChartBarIcon className="w-4 h-4 text-blue-500" />;
      case 'volume_down':
        return <ChartBarIcon className="w-4 h-4 text-orange-500" />;
      default:
        return <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getAnomalyColor = (type: string) => {
    switch (type) {
      case 'price_up':
        return 'border-red-200 bg-red-50';
      case 'price_down':
        return 'border-green-200 bg-green-50';
      case 'volume_up':
        return 'border-blue-200 bg-blue-50';
      case 'volume_down':
        return 'border-orange-200 bg-orange-50';
      default:
        return 'border-yellow-200 bg-yellow-50';
    }
  };

  const getAnomalyLabel = (type: string) => {
    switch (type) {
      case 'price_up':
        return '價格異常上漲';
      case 'price_down':
        return '價格異常下跌';
      case 'volume_up':
        return '成交量異常放大';
      case 'volume_down':
        return '成交量異常萎縮';
      default:
        return '異常波動';
    }
  };

  if (events.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {events.map((event, index) => (
        <div
          key={index}
          className={`border rounded-lg p-4 ${getAnomalyColor(event.type)}`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              {getAnomalyIcon(event.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-gray-900">
                  {getAnomalyLabel(event.type)}
                </h4>
                <span className="text-xs text-gray-500">
                  {event.timestamp}
                </span>
              </div>
              
              <p className="text-sm text-gray-700 mb-2">
                {event.description}
              </p>
              
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <span>漲幅: {event.value}%</span>
                <span>閾值: {event.threshold}%</span>
              </div>

              {showDetails && event.affectedStocks.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-600 mb-2">受影響股票:</p>
                  <div className="flex flex-wrap gap-2">
                    {event.affectedStocks.map((stock, stockIndex) => (
                      <span
                        key={stockIndex}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-white text-gray-700 border border-gray-300"
                      >
                        {stock}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnomalyAlert;
