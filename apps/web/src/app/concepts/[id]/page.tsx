'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useApi } from '@ui/hooks';

interface ConceptDetail {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  category: string;
  aiAnalysis?: string;
  stocks: {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    industry: string;
  }[];
}

export default function ConceptDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { data, loading, error, execute } = useApi<ConceptDetail>({
    url: `${process.env.NEXT_PUBLIC_API_URL}/api/concepts/${params.id}`,
    method: 'GET',
  });

  useEffect(() => {
    execute();
  }, [params.id]);

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
        <h2 className="text-2xl font-bold mb-2">無法載入概念股資訊</h2>
        <p>{error}</p>
        <Link href="/" className="mt-4 text-blue-600 hover:underline">
          返回首頁
        </Link>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Breadcrumb */}
      <nav className="mb-8 text-gray-500 text-sm">
        <Link href="/" className="hover:text-blue-600">首頁</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">{data.name}</span>
      </nav>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Concept Info & AI */}
        <div className="lg:col-span-1 space-y-6">
          {/* Header Card */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
             <div className="relative z-10">
                <h1 className="text-3xl font-bold mb-2">{data.name}</h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  {data.keywords.map((k) => (
                    <span key={k} className="px-2 py-1 bg-white/20 rounded-lg text-xs backdrop-blur-sm">
                      #{k}
                    </span>
                  ))}
                </div>
                <p className="text-blue-100 text-sm leading-relaxed">
                  {data.description}
                </p>
             </div>
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
             </div>
          </div>

          {/* AI Industry Analysis */}
          <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 p-6">
            <h2 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              AI 產業展望
            </h2>
            <div className="prose prose-sm prose-indigo max-w-none">
               {data.aiAnalysis ? (
                 <div className="whitespace-pre-line text-gray-700 leading-relaxed font-medium">
                   {data.aiAnalysis}
                 </div>
               ) : (
                 <div className="flex items-center gap-2 text-gray-400 italic">
                   <div className="animate-pulse w-3 h-3 bg-gray-300 rounded-full"></div>
                   正在分析產業趨勢...
                 </div>
               )}
            </div>
          </div>
        </div>

        {/* Right Column: Related Stocks Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              概念關聯個股 ({data.stocks.length})
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500 text-sm">
                    <th className="pb-3 font-medium">股票名稱</th>
                    <th className="pb-3 font-medium">代號</th>
                    <th className="pb-3 font-medium text-right">股價</th>
                    <th className="pb-3 font-medium text-right">漲跌幅</th>
                    <th className="pb-3 font-medium text-right">成交量</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.stocks.map((stock) => {
                    const isPositive = stock.change >= 0;
                    return (
                      <tr key={stock.symbol} className="group hover:bg-gray-50 transition-colors">
                        <td className="py-4">
                          <Link href={`/stocks/${stock.symbol}`} className="font-bold text-gray-900 group-hover:text-blue-600 block">
                            {stock.name}
                          </Link>
                          <span className="text-xs text-gray-400">{stock.industry}</span>
                        </td>
                        <td className="py-4 text-gray-500 font-mono text-sm">
                          {stock.symbol}
                        </td>
                        <td className="py-4 text-right font-bold text-gray-900 font-mono">
                          {stock.price.toLocaleString()}
                        </td>
                        <td className={`py-4 text-right font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                          {isPositive ? '+' : ''}{stock.changePercent ? (stock.changePercent * 100).toFixed(2) : '0.00'}%
                        </td>
                        <td className="py-4 text-right text-gray-500 text-sm font-mono">
                          {(stock.volume / 1000).toFixed(0)}K
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {data.stocks.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  暫無關聯個股數據
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
