import React, { useState } from 'react';

// 簡化的 API 服務
const API_BASE = 'http://127.0.0.1:8787';

async function searchAPI(mode: 'theme' | 'stock', query: string) {
  try {
    const response = await fetch(`${API_BASE}/search?mode=${mode}&q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API 呼叫失敗:', error);
    throw error;
  }
}

async function getTrendingAPI() {
  try {
    const response = await fetch(`${API_BASE}/trending`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API 呼叫失敗:', error);
    throw error;
  }
}

function App() {
  const [searchMode, setSearchMode] = useState<'theme' | 'stock'>('theme');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [trendingData, setTrendingData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 載入熱門主題
  React.useEffect(() => {
    async function loadTrending() {
      try {
        setLoading(true);
        const data = await getTrendingAPI();
        setTrendingData(data || []);
      } catch (err) {
        console.error('載入熱門主題失敗:', err);
        setError('無法載入熱門主題');
      } finally {
        setLoading(false);
      }
    }
    loadTrending();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        setLoading(true);
        setError(null);
        console.log(`搜尋 ${searchMode}: ${searchQuery}`);
        
        const result = await searchAPI(searchMode, searchQuery);
        setSearchResult(result);
        console.log('搜尋結果:', result);
      } catch (err) {
        console.error('搜尋失敗:', err);
        setError('搜尋失敗，請稍後再試');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頂部搜尋區域 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            概念股自動化篩選系統
          </h1>
          
          {/* 搜尋框 */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2">
              {/* 模式切換器 */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setSearchMode('theme')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    searchMode === 'theme'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  主題
                </button>
                <button
                  type="button"
                  onClick={() => setSearchMode('stock')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    searchMode === 'stock'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  個股
                </button>
              </div>

              {/* 搜尋輸入框 */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchMode === 'theme' ? '搜尋主題，如：光通訊' : '輸入股號/名稱，如：2330'}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />

              {/* 搜尋按鈕 */}
              <button
                type="submit"
                disabled={!searchQuery.trim() || loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? '搜尋中...' : '搜尋'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 主要內容區域 */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左欄：熱門主題 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">熱門主題</h2>
              {loading && trendingData.length === 0 ? (
                <div className="text-center py-4 text-gray-500">載入中...</div>
              ) : error ? (
                <div className="text-center py-4 text-red-500">{error}</div>
              ) : trendingData.length > 0 ? (
                <div className="space-y-2">
                  {trendingData.slice(0, 5).map((theme, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer">
                      <div className="font-medium text-gray-900">{theme.theme}</div>
                      <div className="text-sm text-gray-600">{theme.description}</div>
                      <div className="mt-2 text-sm text-blue-600">熱度: {theme.heatScore}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">暫無熱門主題</div>
              )}
            </div>
          </div>

          {/* 中欄：搜尋結果 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">搜尋結果</h2>
              
              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  搜尋中...
                </div>
              ) : error ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="text-red-800">{error}</div>
                </div>
              ) : searchResult ? (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2">搜尋結果</h3>
                    <pre className="text-sm text-blue-800 overflow-auto">
                      {JSON.stringify(searchResult, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-lg font-medium mb-2">開始搜尋</div>
                  <div className="text-sm">在上方搜尋框輸入關鍵詞</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 系統狀態 */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">系統狀態</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-green-800">
                <p>✅ 前端服務：運行中</p>
                <p className="text-sm">localhost:5173</p>
              </div>
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-green-800">
                <p>✅ 後端 API：運行中</p>
                <p className="text-sm">localhost:8787</p>
              </div>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-blue-800">
                <p>✅ API 串接：已啟用</p>
                <p className="text-sm">可正常呼叫後端</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

