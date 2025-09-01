import React from 'react';

export type SortOption = 'popular' | 'latest' | 'heat' | 'strength' | 'sentiment';
export type FilterOption = 'favorites' | 'anomaly' | 'sentiment_up' | 'sentiment_down';

interface SortFilterControlsProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  activeFilters: FilterOption[];
  onFilterToggle: (filter: FilterOption) => void;
  onClearFilters: () => void;
  className?: string;
}

const SortFilterControls: React.FC<SortFilterControlsProps> = ({
  sortBy,
  onSortChange,
  activeFilters,
  onFilterToggle,
  onClearFilters,
  className = ''
}) => {
  const sortOptions = [
    { value: 'popular', label: '熱門', icon: '🔥' },
    { value: 'latest', label: '最新', icon: '🆕' },
    { value: 'heat', label: '熱度', icon: '🌡️' },
    { value: 'strength', label: '強度', icon: '💪' },
    { value: 'sentiment', label: '情緒', icon: '😊' }
  ] as const;

  const filterOptions = [
    { value: 'favorites', label: '我的收藏', icon: '⭐' },
    { value: 'anomaly', label: '異常波動', icon: '🚨' },
    { value: 'sentiment_up', label: '情緒轉正', icon: '📈' },
    { value: 'sentiment_down', label: '情緒轉負', icon: '📉' }
  ] as const;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 排序控制 */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">排序方式</h3>
        <div className="flex flex-wrap gap-2">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === option.value
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
              }`}
              aria-pressed={sortBy === option.value}
            >
              <span className="mr-1">{option.icon}</span>
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 篩選控制 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-900">篩選條件</h3>
          {activeFilters.length > 0 && (
            <button
              onClick={onClearFilters}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              清除全部
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => {
            const isActive = activeFilters.includes(option.value);
            return (
              <button
                key={option.value}
                onClick={() => onFilterToggle(option.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                }`}
                aria-pressed={isActive}
              >
                <span className="mr-1">{option.icon}</span>
                {option.label}
                {isActive && (
                  <span className="ml-1 text-xs bg-green-200 text-green-800 px-1 rounded">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 活動篩選顯示 */}
      {activeFilters.length > 0 && (
        <div className="pt-2 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">已啟用：</span>
            <div className="flex flex-wrap gap-1">
              {activeFilters.map((filter) => {
                const option = filterOptions.find(opt => opt.value === filter);
                return (
                  <span
                    key={filter}
                    className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-700"
                  >
                    <span className="mr-1">{option?.icon}</span>
                    {option?.label}
                    <button
                      onClick={() => onFilterToggle(filter)}
                      className="ml-1 text-green-600 hover:text-green-800"
                      aria-label={`移除 ${option?.label} 篩選`}
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SortFilterControls;
