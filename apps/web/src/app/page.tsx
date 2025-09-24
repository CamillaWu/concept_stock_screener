'use client';

import { SearchBox } from '@ui/components';
import { useApi } from '@ui/hooks';

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
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Intelligent Concept Stock Screener
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Combine workspace research and AI assistance to uncover concept
          themes, related stocks, and actionable ideas in seconds.
        </p>

        <div className="max-w-2xl mx-auto">
          <SearchBox
            onSearch={handleSearch}
            placeholder="Search by stock, concept, or keyword"
            className="w-full"
          />
        </div>
      </div>

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
          <h3 className="text-lg font-semibold mb-2">Intelligent Search</h3>
          <p className="text-gray-600">
            Quickly locate candidate stocks by symbol, name, or industry
            filters.
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
          <h3 className="text-lg font-semibold mb-2">Concept Insights</h3>
          <p className="text-gray-600">
            Understand concept strength, key industries, and supporting data at
            a glance.
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
          <h3 className="text-lg font-semibold mb-2">Realtime Signals</h3>
          <p className="text-gray-600">
            Stay on top of price action, volume, and market-cap changes with
            instant feedback.
          </p>
        </div>
      </div>

      {loading && (
        <div className="card text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-2 text-gray-600">Fetching the latest results�K</p>
        </div>
      )}

      {error && (
        <div className="card bg-red-50 border-red-200">
          <p className="text-red-600">Search failed: {error}</p>
        </div>
      )}

      {data && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Search results</h2>
          <p className="text-gray-600 mb-4">{data.message}</p>

          {data.stocks.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">
                Stocks ({data.stocks.length})
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
                Concepts ({data.concepts.length})
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
