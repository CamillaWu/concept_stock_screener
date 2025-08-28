import React, { useState, useEffect } from 'react';
import { ArrowTopRightOnSquareIcon, DocumentTextIcon, MegaphoneIcon, NewspaperIcon } from '@heroicons/react/24/outline';

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

      try {
        setLoading(true);
        setError(null);
        
        // 模擬 API 調用
        const mockAttributions: AttributionSource[] = [
          {
            type: 'news',
            title: `${stockName} ${currentTheme} 相關新聞`,
            url: 'https://example.com/news/1',
            timestamp: '2024-01-15',
            summary: '該公司為相關產業重要供應商'
          },
          {
            type: 'report',
            title: '2024年第一季財報摘要',
            url: 'https://example.com/report/1',
            timestamp: '2024-01-10',
            summary: '財報顯示相關業務營收佔比提升'
          },
          {
            type: 'ai',
            title: 'AI 分析結果',
            timestamp: '2024-01-15',
            summary: '基於市場數據分析，該股在相關概念中具有重要地位'
          }
        ];

        setAttributions(mockAttributions);
      } catch (err) {
        console.error('獲取歸因分析失敗:', err);
        setError('載入失敗');
      } finally {
        setLoading(false);
      }
    };

    fetchAttribution();
  }, [stockId, stockName, currentTheme]);

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'news':
        return <NewspaperIcon className="w-4 h-4" />;
      case 'report':
        return <DocumentTextIcon className="w-4 h-4" />;
      case 'announcement':
        return <MegaphoneIcon className="w-4 h-4" />;
      case 'ai':
        return <DocumentTextIcon className="w-4 h-4" />;
      default:
        return <DocumentTextIcon className="w-4 h-4" />;
    }
  };

  const getSourceColor = (type: string) => {
    switch (type) {
      case 'news':
        return 'text-blue-600 bg-blue-50';
      case 'report':
        return 'text-green-600 bg-green-50';
      case 'announcement':
        return 'text-orange-600 bg-orange-50';
      case 'ai':
        return 'text-purple-600 bg-purple-50';
      default:
        return 'text-gray-600 bg-gray-50';
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
        return 'AI分析';
      default:
        return '其他';
    }
  };

  if (loading) {
    return (
      <div className={`p-4 bg-gray-50 rounded-lg ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (attributions.length === 0) {
    return (
      <div className={`p-4 bg-gray-50 rounded-lg ${className}`}>
        <p className="text-gray-500 text-sm">暫無歸因分析資料</p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
        <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        個股歸因分析
      </h3>
      
      <div className="space-y-3">
        {attributions.map((source, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 p-2 rounded-lg ${getSourceColor(source.type)}`}>
                {getSourceIcon(source.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      {source.title}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSourceColor(source.type)}`}>
                      {getSourceLabel(source.type)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {source.timestamp}
                  </span>
                </div>
                
                <p className="text-sm text-gray-700 mb-3">
                  {source.summary}
                </p>
                
                {source.url && (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <ArrowTopRightOnSquareIcon className="w-3 h-3 mr-1" />
                    查看原文
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockAttribution;
