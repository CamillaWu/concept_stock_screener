import React, { useState, useEffect } from 'react';
import type { SearchMode } from '@concepts-radar/types';

interface SearchBarProps {
  mode: SearchMode;
  onModeChange: (mode: SearchMode) => void;
  onSearch: (query: string, mode: SearchMode, useRealData: boolean) => void;
  useRealData?: boolean;
  onUseRealDataChange?: (useRealData: boolean) => void;
  placeholder?: string;
  loading?: boolean;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  mode,
  onModeChange,
  onSearch,
  useRealData = false,
  onUseRealDataChange,
  placeholder,
  loading = false
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focused, setFocused] = useState(false);

  // 搜尋建議
  const themeSuggestions = ['AI', '光通訊', '電動車', '半導體', '生技', '綠能', '元宇宙', '5G'];
  const stockSuggestions = ['2330', '2317', '2454', '1301', '2881', '2412', '2308', '1303'];

  useEffect(() => {
    if (query.trim()) {
      const currentSuggestions = mode === 'theme' 
        ? themeSuggestions.filter(s => s.toLowerCase().includes(query.toLowerCase()))
        : stockSuggestions.filter(s => s.toLowerCase().includes(query.toLowerCase()));
      setSuggestions(currentSuggestions.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !loading) {
      onSearch(query.trim(), mode, useRealData);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion, mode, useRealData);
  };

  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    return mode === 'theme' 
      ? '搜尋主題，如：光通訊' 
      : '輸入股號/名稱，如：2330 或 台積電';
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-4">
        {/* 模式切換 */}
        <div className="flex bg-gray-100 rounded-xl p-1 shadow-sm">
          <button
            type="button"
            onClick={() => onModeChange('theme')}
            className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              mode === 'theme'
                ? 'bg-white text-gray-900 shadow-md hover-lift'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
            aria-label="主題搜尋模式"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              主題
            </div>
          </button>
          <button
            type="button"
            onClick={() => onModeChange('stock')}
            className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              mode === 'stock'
                ? 'bg-white text-gray-900 shadow-md hover-lift'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
            aria-label="個股搜尋模式"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              個股
            </div>
          </button>
        </div>

        {/* 真實資料切換 */}
        {onUseRealDataChange && (
          <div className="flex items-center">
            <label className="flex items-center space-x-3 text-sm text-gray-600 bg-white px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={useRealData}
                  onChange={(e) => onUseRealDataChange(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-10 h-6 rounded-full transition-colors ${
                  useRealData ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                    useRealData ? 'translate-x-4' : 'translate-x-1'
                  }`} style={{ marginTop: '4px' }} />
                </div>
              </div>
              <span className="font-medium">真實資料</span>
              {useRealData && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  已啟用
                </span>
              )}
            </label>
          </div>
        )}

        {/* 搜尋輸入框 */}
        <div className="flex-1 relative">
          <div className="relative">
            <input
              type="text"
              id="search-input"
              name="search-query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 200)}
              placeholder={getPlaceholder()}
              className="w-full px-6 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 text-lg"
              disabled={loading}
              aria-label={`搜尋${mode === 'theme' ? '主題' : '個股'}`}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {loading ? (
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </div>
          </div>

          {/* 搜尋建議 */}
          {showSuggestions && suggestions.length > 0 && focused && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 slide-up">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg focus:bg-gray-50 focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="text-gray-700">{suggestion}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 搜尋按鈕 */}
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg hover-lift font-medium text-lg"
          aria-label="執行搜尋"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              搜尋中...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              搜尋
            </div>
          )}
        </button>
      </form>

      {/* 快捷鍵提示 */}
      <div className="mt-4 text-center text-sm text-gray-500">
        <span className="inline-flex items-center gap-1">
          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded">Ctrl</kbd>
          <span>+</span>
          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded">K</kbd>
          <span>快速搜尋</span>
        </span>
        <span className="mx-2">•</span>
        <span className="inline-flex items-center gap-1">
          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded">Tab</kbd>
          <span>切換模式</span>
        </span>
      </div>
    </div>
  );
};
