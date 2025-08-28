import React, { useState } from 'react';
import type { SearchMode } from '@concepts-radar/types';

interface SearchBarProps {
  mode: SearchMode;
  onModeChange: (mode: SearchMode) => void;
  onSearch: (query: string, mode?: SearchMode) => void;
  placeholder?: string;
  loading?: boolean;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  mode,
  onModeChange,
  onSearch,
  placeholder,
  loading = false
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !loading) {
      onSearch(query.trim(), mode);
    }
  };

  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    return mode === 'theme' 
      ? '搜尋主題，如：光通訊' 
      : '輸入股號/名稱，如：2330 或 台積電';
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        {/* 模式切換 */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => onModeChange('theme')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'theme'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            aria-label="主題搜尋模式"
          >
            主題
          </button>
          <button
            type="button"
            onClick={() => onModeChange('stock')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'stock'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            aria-label="個股搜尋模式"
          >
            個股
          </button>
        </div>

        {/* 搜尋輸入框 */}
        <div className="flex-1 relative">
          <input
            type="text"
            id="search-input"
            name="search-query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={getPlaceholder()}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
            aria-label={`搜尋${mode === 'theme' ? '主題' : '個股'}`}
          />
        </div>

        {/* 搜尋按鈕 */}
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="執行搜尋"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              搜尋中...
            </div>
          ) : (
            '搜尋'
          )}
        </button>
      </form>
    </div>
  );
};
