import React, { useState } from 'react';
import type { SearchMode } from '../../types';

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
  loading = false,
  className = ''
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
      ? '搜尋主題，如：AI 伺服器、光通訊' 
      : '輸入股號/名稱，如：2330 或 台積電';
  };

  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* 模式切換 */}
        <div className="flex bg-gray-100 rounded-xl p-1 shadow-inner">
          <button
            type="button"
            onClick={() => onModeChange('theme')}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              mode === 'theme'
                ? 'bg-white text-blue-600 shadow-sm ring-1 ring-blue-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
            aria-label="主題搜尋模式"
          >
            <svg className="w-4 h-4 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
            主題
          </button>
          <button
            type="button"
            onClick={() => onModeChange('stock')}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              mode === 'stock'
                ? 'bg-white text-blue-600 shadow-sm ring-1 ring-blue-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
            aria-label="個股搜尋模式"
          >
            <svg className="w-4 h-4 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
            </svg>
            個股
          </button>
        </div>

        {/* 搜尋輸入框 */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            id="search-input"
            name="search-query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={getPlaceholder()}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
            disabled={loading}
            aria-label={`搜尋${mode === 'theme' ? '主題' : '個股'}`}
          />
        </div>

        {/* 搜尋按鈕 */}
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
          aria-label="執行搜尋"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              搜尋中...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              搜尋
            </div>
          )}
        </button>
      </form>

      {/* 快速搜尋建議 */}
      {mode === 'theme' && (
        <div className="mt-3">
          <div className="text-xs text-gray-500 mb-2">熱門搜尋：</div>
          <div className="flex flex-wrap gap-2">
            {['AI 伺服器', '光通訊', '電動車', '半導體'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => onSearch(suggestion, mode)}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
