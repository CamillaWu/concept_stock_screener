import React, { useState } from 'react';

interface SearchBarProps {
  mode: 'theme' | 'stock';
  onModeChange: (mode: 'theme' | 'stock') => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  loading?: boolean;
}

export default function SearchBar({ 
  mode, 
  onModeChange, 
  onSearch, 
  placeholder,
  loading = false 
}: SearchBarProps) {
  const [query, setQuery] = useState('');

  // 動態引導文字
  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    return mode === 'theme' 
      ? '搜尋主題，如：光通訊' 
      : '輸入股號/名稱，如：2330 或 台積電';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !loading) {
      onSearch(query.trim());
    }
  };

  const handleModeChange = (newMode: 'theme' | 'stock') => {
    if (newMode !== mode) {
      onModeChange(newMode);
      setQuery(''); // 切換模式時清空輸入
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        {/* 模式切換器 */}
        <div className="flex bg-gray-100 rounded-lg p-1" role="group" aria-label="搜尋模式選擇">
          <button
            type="button"
            onClick={() => handleModeChange('theme')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'theme'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            aria-pressed={mode === 'theme'}
            disabled={loading}
          >
            主題
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('stock')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'stock'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            aria-pressed={mode === 'stock'}
            disabled={loading}
          >
            個股
          </button>
        </div>

        {/* 搜尋輸入框 */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={getPlaceholder()}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label={`${mode === 'theme' ? '主題' : '個股'}搜尋`}
            disabled={loading}
          />
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>

        {/* 搜尋按鈕 */}
        <button
          type="submit"
          disabled={!query.trim() || loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="執行搜尋"
        >
          {loading ? '搜尋中...' : '搜尋'}
        </button>
      </form>
    </div>
  );
}
