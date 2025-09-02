'use client';

import { useTrendingThemes } from '../../hooks';

export default function TestPage() {
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
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API 測試頁面 (使用新 Hook)</h1>
      
      {/* Hook 狀態顯示 */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Hook 狀態</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><strong>載入狀態:</strong> {loading ? '載入中...' : '完成'}</div>
          <div><strong>成功狀態:</strong> {isSuccess ? '是' : '否'}</div>
          <div><strong>錯誤狀態:</strong> {isError ? '是' : '否'}</div>
          <div><strong>數據數量:</strong> {data?.length || 0}</div>
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
      
      {loading && (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">載入中...</span>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          錯誤: {error}
        </div>
      )}
      
      {data && (
        <div>
          <h2 className="text-xl font-semibold mb-2">API 回應:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
