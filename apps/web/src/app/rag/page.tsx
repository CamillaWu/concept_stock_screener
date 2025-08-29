'use client';

import { useState, useEffect } from 'react';
import { ragApi } from '@/services/api';

interface RAGStatus {
  isValid: boolean;
  stats: {
    total: number;
    theme_overview: number;
    theme_to_stock: number;
    errors: string[];
  };
}

interface SearchResult {
  doc_id: string;
  score: number;
  metadata: {
    type: string;
    title: string;
    theme_name: string;
    ticker?: string;
    stock_name?: string;
    tags: string[];
  };
  content: string;
}

export default function RAGManagementPage() {
  const [status, setStatus] = useState<RAGStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'theme_overview' | 'theme_to_stock'>('theme_overview');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [themes, setThemes] = useState<Array<{ name: string; overview: string; score: number }>>([]);
  const [selectedTheme, setSelectedTheme] = useState('');
  const [themeStocks, setThemeStocks] = useState<Array<{ ticker: string; stock_name: string; score: number; content: string }>>([]);

  // 檢查 RAG 狀態
  const checkStatus = async () => {
    setLoading(true);
    try {
      const response = await ragApi.checkStatus();
      setStatus(response.data);
    } catch (error) {
      console.error('Failed to check status:', error);
    } finally {
      setLoading(false);
    }
  };

  // 向量化 RAG 資料
  const vectorizeData = async () => {
    setLoading(true);
    try {
      const response = await ragApi.vectorize();
      console.log('Vectorization result:', response);
      alert('向量化完成！');
    } catch (error) {
      console.error('Failed to vectorize:', error);
      alert('向量化失敗！');
    } finally {
      setLoading(false);
    }
  };

  // 搜尋
  const performSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await ragApi.search(searchQuery, {
        type: searchType,
        topK: 10,
      });
      setSearchResults(response.data.results);
    } catch (error) {
      console.error('Search failed:', error);
      alert('搜尋失敗！');
    } finally {
      setLoading(false);
    }
  };

  // 取得所有主題
  const loadThemes = async () => {
    setLoading(true);
    try {
      const response = await ragApi.getAllThemes();
      setThemes(response.data.themes);
    } catch (error) {
      console.error('Failed to load themes:', error);
    } finally {
      setLoading(false);
    }
  };

  // 搜尋主題相關股票
  const searchStocksByTheme = async (theme: string) => {
    setLoading(true);
    try {
      const response = await ragApi.getStocksByTheme(theme, 10);
      setThemeStocks(response.data.stocks);
      setSelectedTheme(theme);
    } catch (error) {
      console.error('Failed to search stocks by theme:', error);
    } finally {
      setLoading(false);
    }
  };

  // 清除向量資料
  const clearVectors = async () => {
    if (!confirm('確定要清除所有向量資料嗎？')) return;
    
    setLoading(true);
    try {
      await ragApi.clearVectors();
      alert('向量資料已清除！');
    } catch (error) {
      console.error('Failed to clear vectors:', error);
      alert('清除失敗！');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
    loadThemes();
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8">RAG 管理面板</h1>
      
      {/* 狀態檢查 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">RAG 狀態</h2>
        {status ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${status.isValid ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span>狀態: {status.isValid ? '正常' : '異常'}</span>
            </div>
            <div>總文件數: {status.stats.total}</div>
            <div>主題概覽: {status.stats.theme_overview}</div>
            <div>主題股票關聯: {status.stats.theme_to_stock}</div>
            {status.stats.errors.length > 0 && (
              <div className="text-red-600">
                <div>錯誤:</div>
                <ul className="list-disc list-inside">
                  {status.stats.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div>載入中...</div>
        )}
        
        <div className="flex gap-4 mt-4">
          <button
            onClick={checkStatus}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            重新檢查
          </button>
          <button
            onClick={vectorizeData}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            向量化資料
          </button>
          <button
            onClick={clearVectors}
            disabled={loading}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          >
            清除向量
          </button>
        </div>
      </div>

      {/* 搜尋功能 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">向量搜尋</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="輸入搜尋關鍵字..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as 'theme_overview' | 'theme_to_stock')}
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="theme_overview">主題概覽</option>
            <option value="theme_to_stock">主題股票關聯</option>
          </select>
          <button
            onClick={performSearch}
            disabled={loading || !searchQuery.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            搜尋
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold">搜尋結果 ({searchResults.length})</h3>
            {searchResults.map((result, index) => (
              <div key={index} className="border border-gray-200 rounded p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{result.metadata.title}</h4>
                  <span className="text-sm text-gray-500">
                    相似度: {(result.score * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  類型: {result.metadata.type} | 主題: {result.metadata.theme_name}
                  {result.metadata.stock_name && ` | 股票: ${result.metadata.stock_name}`}
                </div>
                <p className="text-sm">{result.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 主題列表 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">主題列表 ({themes.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {themes.map((theme, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => searchStocksByTheme(theme.name)}
            >
              <h3 className="font-medium mb-2">{theme.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-3">{theme.overview}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 主題相關股票 */}
      {selectedTheme && themeStocks.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            {selectedTheme} 相關股票 ({themeStocks.length})
          </h2>
          <div className="space-y-4">
            {themeStocks.map((stock, index) => (
              <div key={index} className="border border-gray-200 rounded p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">
                    {stock.stock_name} {stock.ticker && `(${stock.ticker})`}
                  </h4>
                  <span className="text-sm text-gray-500">
                    相似度: {(stock.score * 100).toFixed(1)}%
                  </span>
                </div>
                <p className="text-sm text-gray-600">{stock.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <div className="mt-2">處理中...</div>
          </div>
        </div>
      )}
    </div>
  );
}
