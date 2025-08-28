import React, { useState, useEffect } from 'react';
import { ExternalLinkIcon, DocumentTextIcon, NewspaperIcon, MegaphoneIcon } from '@heroicons/react/outline';

interface AttributionSource {
  type: 'news' | 'report' | 'announcement' | 'ai';
  title: string;
  url?: string;
  timestamp: string;
  summary: string;
}

interface StockAttributionProps {
  stockId: string;
  stockName: string;
  currentTheme: string;
  className?: string;
}

const StockAttribution: React.FC<StockAttributionProps> = ({
  stockId,
  stockName,
  currentTheme,
  className = ''
}) => {
  const [attributions, setAttributions] = useState<AttributionSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttribution = async () => {
      if (!stockId || !currentTheme) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // 模擬 API 調用，實際應該調用真實的 API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 模擬數據
        const mockAttributions: AttributionSource[] = [
          {
            type: 'news',
            title: '台積電 CoWoS 產能滿載，AI 晶片需求強勁',
            url: 'https://example.com/news/1',
            timestamp: '2024-01-15',
            summary: '該公司為 CoWoS 核心供應商，相關新聞報導顯示其產能滿載'
          },
          {
            type: 'report',
            title: '2024年第一季財報摘要',
            url: 'https://example.com/report/1',
            timestamp: '2024-01-10',
            summary: '財報顯示 AI 相關業務營收佔比提升至 30%'
          },
          {
            type: 'ai',
            title: 'AI 分析結果',
            timestamp: '2024-01-15',
            summary: '基於市場數據分析，該股在 AI 伺服器概念中具有核心地位'
          }
        ];

        setAttributions(mockAttributions);
      } catch (err) {
        setError('無法載入歸因資料');
      } finally {
        setLoading(false);
      }
    };

    fetchAttribution();
  }, [stockId, currentTheme]);

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'news':
        return <NewspaperIcon className="w-4 h-4 text-blue-500" />;
      case 'report':
        return <DocumentTextIcon className="w-4 h-4 text-green-500" />;
      case 'announcement':
        return <MegaphoneIcon className="w-4 h-4 text-purple-500" />;
      default:
        return <DocumentTextIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSourceLabel = (type: string) => {
    switch (type) {
      case 'news':
        return '新聞';
      case 'report':
        return '財報';
      case 'announcement':
        return '公告';
      case 'ai':
        return 'AI 分析';
      default:
        return '其他';
    }
  };

  if (loading) {
    return (
      <div className={`p-4 bg-white border border-gray-200 rounded-lg ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="border border-gray-200 rounded p-3">
                <div className="flex items-center mb-2">
                  <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 bg-white border border-gray-200 rounded-lg ${className}`}>
        <div className="text-center">
          <div className="text-red-500 mb-2">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            重試
          </button>
        </div>
      </div>
    );
  }

  if (attributions.length === 0) {
    return (
      <div className={`p-4 bg-white border border-gray-200 rounded-lg ${className}`}>
        <div className="text-center text-gray-500">
          <div className="text-sm font-medium mb-2">入選原因</div>
          <div className="text-xs">暫無歸因資訊</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 bg-white border border-gray-200 rounded-lg ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">入選原因</h3>
      
      <div className="space-y-3">
        {attributions.map((attribution, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                {getSourceIcon(attribution.type)}
                <span className="ml-2 text-xs font-medium text-gray-600">
                  {getSourceLabel(attribution.type)}
                </span>
              </div>
              <span className="text-xs text-gray-400">{attribution.timestamp}</span>
            </div>
            
            <div className="mb-2">
              <div className="text-sm font-medium text-gray-900 mb-1">
                {attribution.title}
              </div>
              <div className="text-sm text-gray-600">
                {attribution.summary}
              </div>
            </div>
            
            {attribution.url && (
              <a
                href={attribution.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ExternalLinkIcon className="w-3 h-3 mr-1" />
                查看原文
              </a>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          基於新聞、財報、公告等多源資料分析
        </div>
      </div>
    </div>
  );
};

export default StockAttribution;
