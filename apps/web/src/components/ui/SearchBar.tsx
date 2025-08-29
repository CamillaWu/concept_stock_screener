import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string, mode: 'theme' | 'stock', useRealData: boolean) => void;
  mode: 'theme' | 'stock';
  onModeChange: (mode: 'theme' | 'stock') => void;
  loading?: boolean;
  useRealData: boolean;
  onUseRealDataChange: (useRealData: boolean) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  mode,
  onModeChange,
  loading = false,
  useRealData,
  onUseRealDataChange
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), mode, useRealData);
    }
  };

  const quickSuggestions = mode === 'theme' 
    ? ['AI', '電動車', '綠能', '生技', '金融']
    : ['2330', '2317', '2454', '2412', '1301'];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center space-x-2 mb-4">
          {/* 模式切換 */}
          <div className="flex bg-white rounded-lg shadow-sm border border-gray-200">
            <button
              type="button"
              onClick={() => onModeChange('theme')}
              className={`px-4 py-2 rounded-l-lg text-sm font-medium transition-colors ${
                mode === 'theme'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              主題搜尋
            </button>
            <button
              type="button"
              onClick={() => onModeChange('stock')}
              className={`px-4 py-2 rounded-r-lg text-sm font-medium transition-colors ${
                mode === 'stock'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              股票搜尋
            </button>
          </div>

          {/* 真實資料切換 */}
          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={useRealData}
                onChange={(e) => onUseRealDataChange(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span>真實資料</span>
            </label>
          </div>
        </div>

        {/* 搜尋輸入框 */}
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={mode === 'theme' ? '搜尋投資主題...' : '輸入股票代號...'}
            className="w-full px-4 py-3 pl-12 pr-20 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            disabled={loading}
          />
          
          {/* 搜尋圖示 */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* 搜尋按鈕 */}
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute inset-y-0 right-0 px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </button>
        </div>
      </form>

      {/* 快速搜尋建議 */}
      <div className="mt-3">
        <div className="text-sm text-gray-500 mb-2">快速搜尋：</div>
        <div className="flex flex-wrap gap-2">
          {quickSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => {
                setQuery(suggestion);
                onSearch(suggestion, mode, useRealData);
              }}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* 資料來源提示 */}
      {useRealData && (
        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center text-sm text-green-700">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            使用真實台股資料（台灣證券交易所 + Yahoo Finance）
          </div>
        </div>
      )}
    </div>
  );
};
