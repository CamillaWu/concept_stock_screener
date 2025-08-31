'use client';

import { useState, useEffect } from 'react';

interface ApiResponse {
  themes?: Array<{
    id: string;
    theme: string;
    description: string;
    heatScore: number;
    stocks: Array<{
      ticker: string;
      name: string;
      reason: string;
    }>;
  }>;
}

export default function DebugPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        addLog('開始 API 呼叫...');
        
        const apiUrl = 'https://concept-stock-screener-api.sandy246836.workers.dev/trending';
        addLog(`API URL: ${apiUrl}`);
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          mode: 'cors',
        });
        
        addLog(`回應狀態: ${response.status} ${response.statusText}`);
        addLog(`回應標頭: ${JSON.stringify(Object.fromEntries(response.headers.entries()))}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          addLog(`錯誤回應: ${errorText}`);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        addLog(`成功取得資料: ${JSON.stringify(result).substring(0, 200)}...`);
        setData(result);
      } catch (err) {
        console.error('API 呼叫失敗:', err);
        addLog(`錯誤: ${err instanceof Error ? err.message : '載入失敗'}`);
        setError(err instanceof Error ? err.message : '載入失敗');
      } finally {
        setLoading(false);
        addLog('API 呼叫完成');
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">API 調試頁面</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左側：日誌 */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">調試日誌</h2>
          <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-96 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="mb-1">{log}</div>
            ))}
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
            <div className="bg-white p-4 rounded border">
              <h3 className="font-semibold mb-2">API 回應:</h3>
              <pre className="text-xs overflow-auto max-h-96">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* 手動測試按鈕 */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">手動測試</h3>
        <button
          onClick={() => {
            addLog('手動測試按鈕被點擊');
            window.open('https://concept-stock-screener-api.sandy246836.workers.dev/trending', '_blank');
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          在新視窗開啟 API
        </button>
      </div>
    </div>
  );
}
