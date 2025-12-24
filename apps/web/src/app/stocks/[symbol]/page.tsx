'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useApi } from '@ui/hooks';

interface StockDetail {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  sector: string;
  industry: string;
  aiAnalysis?: string;
  relatedConcepts?: {
    id: string;
    name: string;
  }[];
}

export default function StockDetailPage({
  params,
}: {
  params: { symbol: string };
}) {
  const { data, loading, error, execute } = useApi<StockDetail>({
    url: `${process.env.NEXT_PUBLIC_API_URL}/api/stocks/${params.symbol}`,
    method: 'GET',
  });

  useEffect(() => {
    execute();
  }, [params.symbol]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-600">
        <h2 className="text-2xl font-bold mb-2">無法載入個股資訊</h2>
        <p>{error}</p>
        <Link href="/" className="mt-4 text-blue-600 hover:underline">
          返回首頁
        </Link>
      </div>
    );
  }

  if (!data) return null;

  const isPositive = data.change >= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Breadcrumb */}
      <nav className="mb-8 text-gray-500 text-sm">
        <Link href="/" className="hover:text-blue-600">
          首頁
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">{data.symbol}</span>
      </nav>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {data.name}
                  </h1>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                    {data.symbol}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <span>
                    {data.sector !== 'Unknown' ? data.sector : '台股市場'}
                  </span>
                  <span>•</span>
                  <span>
                    {data.industry !== 'Unknown' ? data.industry : '一般產業'}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-gray-900 font-mono">
                  ${data.price.toLocaleString()}
                </div>
                <div
                  className={`text-lg font-medium mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}
                >
                  {isPositive ? '▲' : '▼'} {Math.abs(data.change)} (
                  {Math.abs(data.changePercent * 100).toFixed(2)}%)
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  成交量: {(data.volume / 1000).toFixed(0)}K
                </div>
              </div>
            </div>
          </div>

          {/* AI Analysis Card */}
          <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl shadow-sm border border-indigo-100 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <svg
                className="w-24 h-24 text-indigo-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
                <path d="M12 6a6 6 0 1 0 6 6 6 6 0 0 0-6-6zm0 10a4 4 0 1 1 4-4 4 4 0 0 1-4 4z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              AI 投資快評
            </h2>
            <div className="prose prose-indigo max-w-none">
              {data.aiAnalysis ? (
                <div className="whitespace-pre-line text-gray-700 leading-relaxed font-medium">
                  {data.aiAnalysis}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-500 italic">
                  <div className="animate-pulse w-4 h-4 bg-gray-300 rounded-full"></div>
                  正在生成 AI 分析...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Related Concepts */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              關聯概念主題
            </h3>

            {data.relatedConcepts && data.relatedConcepts.length > 0 ? (
              <div className="space-y-3">
                {data.relatedConcepts.map(concept => (
                  <Link
                    key={concept.id}
                    href={`/concepts/${concept.id}`}
                    className="block group"
                  >
                    <div className="p-3 rounded-xl bg-gray-50 hover:bg-blue-50 border border-gray-100 group-hover:border-blue-200 transition-all duration-200">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700 group-hover:text-blue-700">
                          {concept.name}
                        </span>
                        <svg
                          className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-transform"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm text-center py-4">
                暫無相關概念數據
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
