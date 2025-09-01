import React from 'react';

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

export const AnomalyAlert: React.FC<AnomalyAlertProps> = ({
  events = [],
  showDetails = false,
  className = ''
}) => {
  const getAnomalyIcon = (type: string) => {
    switch (type) {
      case 'price_up':
        return (
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      case 'price_down':
        return (
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
          </svg>
        );
      case 'volume_up':
        return (
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'volume_down':
        return (
          <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
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


