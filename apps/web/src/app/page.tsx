'use client';

import { SearchBox } from '../../../../packages/ui/src/components';
import { useApi } from '../../../../packages/ui/src/hooks';

interface SearchResponse {
  stocks: Array<{
    name: string;
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
  }>;
  concepts: Array<{
    name: string;
    description: string;
    keywords: string[];
  }>;
  total: number;
  suggestions: string[];
  message: string;
}

export default function HomePage() {
  const { data, loading, error, execute } = useApi<SearchResponse>({
    url: `${process.env.NEXT_PUBLIC_API_URL}/api/search`,
    method: 'GET',
  });

  const handleSearch = async () => {
    await execute();
  };

  return (
    <div className="space-y-8">
      {/* 英雄區域 */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          智能概念股篩選系統
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          運用先進的 AI 技術，幫您快速篩選出最具潛力的概念股，
          提供專業的投資分析工具，助您做出明智的投資決策。
        </p>

        {/* 搜尋框 */}
        <div className="max-w-2xl mx-auto">
          <SearchBox
            onSearch={handleSearch}
            placeholder="搜尋股票代碼、名稱或概念..."
            className="w-full"
          />
        </div>
      </div>

      {/* 功能特色 */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">智能搜尋</h3>
          <p className="text-gray-600">
            支援股票代碼、名稱、產業等多維度搜尋，快速找到目標股票
          </p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">概念股分析</h3>
          <p className="text-gray-600">
            深入分析概念股產業鏈，掌握投資機會和風險
          </p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">即時數據</h3>
          <p className="text-gray-600">
            提供即時股價、成交量、市值等關鍵數據，助您掌握市場動態
          </p>
        </div>
      </div>

      {/* 搜尋結果 */}
      {loading && (
        <div className="card text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">搜尋中...</p>
        </div>
      )}

      {error && (
        <div className="card bg-red-50 border-red-200">
          <p className="text-red-600">搜尋失敗：{error}</p>
        </div>
      )}

      {data && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">搜尋結果</h2>
          <p className="text-gray-600 mb-4">{data.message}</p>

          {data.stocks.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">
                股票 ({data.stocks.length})
              </h3>
              <div className="space-y-2">
                {data.stocks.map(
                  (
                    stock: {
                      name: string;
                      symbol: string;
                      price: number;
                      change: number;
                      changePercent: number;
                    },
                    index: number
                  ) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <span className="font-medium">{stock.symbol}</span>
                        <span className="text-gray-600 ml-2">{stock.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${stock.price}</div>
                        <div
                          className={`text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {stock.change >= 0 ? '+' : ''}
                          {stock.change} ({stock.changePercent >= 0 ? '+' : ''}
                          {(stock.changePercent * 100).toFixed(2)}%)
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {data.concepts.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-3">
                概念股 ({data.concepts.length})
              </h3>
              <div className="space-y-2">
                {data.concepts.map(
                  (
                    concept: {
                      name: string;
                      description: string;
                      keywords: string[];
                    },
                    index: number
                  ) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium">{concept.name}</h4>
                      <p className="text-gray-600 text-sm mt-1">
                        {concept.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {concept.keywords.map(
                          (keyword: string, kIndex: number) => (
                            <span
                              key={kIndex}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              {keyword}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
