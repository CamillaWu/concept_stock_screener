'use client';

import { useTrendingThemes } from '../../hooks';

export default function DebugPage() {
  const { 
    data, 
    loading, 
    error, 
    refetch,
    isSuccess,
    isError 
  } = useTrendingThemes({
    useRealData: false,
    sortBy: 'popular',
    cacheTime: 5 * 60 * 1000,
    staleTime: 2 * 60 * 1000,
    retryCount: 3
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">API 調試頁面 (使用新 Hook)</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左側：Hook 狀態 */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Hook 狀態</h2>
          <div className="space-y-2 text-sm">
            <div><strong>載入狀態:</strong> {loading ? '載入中...' : '完成'}</div>
            <div><strong>成功狀態:</strong> {isSuccess ? '是' : '否'}</div>
            <div><strong>錯誤狀態:</strong> {isError ? '是' : '否'}</div>
            <div><strong>數據數量:</strong> {data?.length || 0}</div>
            {error && <div><strong>錯誤訊息:</strong> {error}</div>}
          </div>
          
          <div className="mt-4">
            <button
              onClick={() => refetch()}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              重新載入
            </button>
          </div>
        </div>

        {/* 右側：結果 */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">API 結果</h2>
          
          {loading && (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">載入中...</span>
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <strong>錯誤:</strong> {error}
            </div>
          )}
          
          {data && (
            <div>
              <h3 className="text-lg font-semibold mb-2">趨勢主題 ({data.length} 個):</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {data.map((theme, index) => (
                  <div key={theme.id || index} className="bg-white p-3 rounded border">
                    <div className="font-semibold">{theme.name}</div>
                    <div className="text-sm text-gray-600">{theme.description}</div>
                    <div className="text-sm text-blue-600">熱度: {theme.heatScore}</div>
                    <div className="text-sm text-green-600">股票數量: {theme.stocks.length}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
