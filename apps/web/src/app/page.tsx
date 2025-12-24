'use client';

import { SearchBox } from '@ui/components';
import { useApi } from '@ui/hooks';
import type { SearchResponse } from '@concept-stock-screener/types';

export default function HomePage() {
  const { data, loading, error, execute } = useApi<SearchResponse>({
    url: `${process.env.NEXT_PUBLIC_API_URL}/api/search`,
    method: 'GET',
  });

  const handleSearch = async (query: string) => {
    await execute({ params: { q: query } });
  };

  return (
    <div className="space-y-8">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          智能概念股篩選平台
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          結合研究資料與 AI
          助理，數秒內找到概念主題、相關個股與可執行的投資想法。
        </p>

        <div className="max-w-2xl mx-auto">
          <SearchBox
            onSearch={handleSearch}
            placeholder="輸入股票、概念或關鍵字"
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
          <h3 className="text-lg font-semibold mb-2">智慧搜尋</h3>
          <p className="text-gray-600">
            依代碼、名稱或產業條件快速鎖定潛在個股。
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
          <h3 className="text-lg font-semibold mb-2">概念洞察</h3>
          <p className="text-gray-600">
            掌握概念熱度、關鍵產業與支撐數據，一眼看懂。
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
          <h3 className="text-lg font-semibold mb-2">即時訊號</h3>
          <p className="text-gray-600">
            即時追蹤價格、成交量與市值變化，掌握市場節奏。
          </p>
        </div>
      </div>

      {loading && (
        <div className="card text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-2 text-gray-600">讀取最新結果...</p>
        </div>
      )}

      {error && (
        <div className="card bg-red-50 border-red-200">
          <p className="text-red-600">搜尋失敗: {error}</p>
        </div>
      )}

      {data && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">搜尋結果</h2>
            <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-sm">
              找到 {data.stocks.length + data.concepts.length} 筆結果
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Stocks Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 border-b pb-2 border-gray-200">
                <span className="bg-blue-100 text-blue-700 p-1.5 rounded-md">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </span>
                <h3 className="text-xl font-semibold text-gray-800">
                  相關個股 ({data.stocks.length})
                </h3>
              </div>

              <div className="grid gap-3">
                {data.stocks.length > 0 ? (
                  data.stocks.map((stock, index) => (
                    <div
                      key={index}
                      className="group flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 flex flex-col items-center justify-center bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                          <span className="text-sm font-bold text-gray-900">
                            {stock.symbol}
                          </span>
                          <span className="text-[10px] text-gray-500">TW</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                            {stock.name}
                          </h4>
                          <span className="text-xs text-gray-400">
                            {stock.industry !== 'N/A'
                              ? stock.industry
                              : '台灣股市'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <button className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors">
                          查看分析
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-8">
                    沒有找到相關個股
                  </p>
                )}
              </div>
            </div>

            {/* Concepts Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 border-b pb-2 border-gray-200">
                <span className="bg-green-100 text-green-700 p-1.5 rounded-md">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </span>
                <h3 className="text-xl font-semibold text-gray-800">
                  相關概念 ({data.concepts.length})
                </h3>
              </div>

              <div className="grid gap-4">
                {data.concepts.length > 0 ? (
                  data.concepts.map((concept, index) => (
                    <div
                      key={index}
                      className="p-5 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
                    >
                      <h4 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
                        {concept.name}
                        {index === 0 && (
                          <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] rounded-full uppercase tracking-wider">
                            Top Match
                          </span>
                        )}
                      </h4>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
                        {concept.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {concept.keywords.slice(0, 4).map((keyword, kIndex) => (
                          <span
                            key={kIndex}
                            className="px-2.5 py-1 bg-white border border-gray-200 text-gray-600 text-xs rounded-md shadow-sm"
                          >
                            #{keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-8">
                    沒有找到相關概念
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
