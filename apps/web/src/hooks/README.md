# API Hook 優化使用範例

## 概述
本文檔展示如何使用優化後的 API Hook 系統，包括基礎 API Hook、股票數據 Hook、RAG 搜尋 Hook 和快取管理 Hook。

## 基礎 API Hook 使用

### 基本用法
```typescript
import { useApi } from '@/hooks';

function MyComponent() {
  const { data, loading, error, refetch, clearCache } = useApi('/api/endpoint', {
    cacheTime: 5 * 60 * 1000, // 5分鐘快取
    staleTime: 2 * 60 * 1000,  // 2分鐘過期
    retryCount: 3,
    timeout: 10000
  });

  if (loading) return <div>載入中...</div>;
  if (error) return <div>錯誤: {error}</div>;
  
  return (
    <div>
      <h1>數據: {JSON.stringify(data)}</h1>
      <button onClick={refetch}>重新載入</button>
      <button onClick={clearCache}>清除快取</button>
    </div>
  );
}
```

### 條件請求
```typescript
function ConditionalComponent({ userId }: { userId?: string }) {
  const { data, loading, error } = useApi(`/api/user/${userId}`, {
    enabled: !!userId, // 只有當 userId 存在時才發送請求
    cacheTime: 10 * 60 * 1000
  });

  if (!userId) return <div>請選擇用戶</div>;
  if (loading) return <div>載入中...</div>;
  if (error) return <div>錯誤: {error}</div>;
  
  return <div>用戶資料: {JSON.stringify(data)}</div>;
}
```

## 股票數據 Hook 使用

### 趨勢主題
```typescript
import { useTrendingThemes } from '@/hooks';

function TrendingThemes() {
  const { data, loading, error } = useTrendingThemes({
    useRealData: true,
    sortBy: 'popular',
    cacheTime: 5 * 60 * 1000
  });

  if (loading) return <div>載入趨勢主題中...</div>;
  if (error) return <div>錯誤: {error}</div>;
  
  return (
    <div>
      <h2>熱門主題</h2>
      {data?.map(theme => (
        <div key={theme.id}>
          <h3>{theme.name}</h3>
          <p>熱度: {theme.heatScore}</p>
          <p>股票數量: {theme.stocks.length}</p>
        </div>
      ))}
    </div>
  );
}
```

### 主題搜尋
```typescript
import { useThemeSearch } from '@/hooks';

function ThemeSearch({ query }: { query: string }) {
  const { data, loading, error } = useThemeSearch(query, {
    useRealData: false,
    cacheTime: 10 * 60 * 1000
  });

  if (loading) return <div>搜尋中...</div>;
  if (error) return <div>搜尋錯誤: {error}</div>;
  if (!data) return <div>未找到相關主題</div>;
  
  return (
    <div>
      <h2>搜尋結果: {data.name}</h2>
      <p>{data.description}</p>
      <p>熱度: {data.heatScore}</p>
      <div>
        <h3>相關股票:</h3>
        {data.stocks.map(stock => (
          <div key={stock.ticker}>
            {stock.name} ({stock.ticker})
          </div>
        ))}
      </div>
    </div>
  );
}
```

### AI 分析功能
```typescript
import { useAiInvestmentAdvice, useAiRiskAssessment, useAiSentiment } from '@/hooks';

function StockAnalysis({ stockCode }: { stockCode: string }) {
  const investmentAdvice = useAiInvestmentAdvice(stockCode);
  const riskAssessment = useAiRiskAssessment(stockCode);
  const sentiment = useAiSentiment(stockCode);

  return (
    <div>
      <h2>股票分析: {stockCode}</h2>
      
      {/* 投資建議 */}
      <div>
        <h3>投資建議</h3>
        {investmentAdvice.loading && <div>分析中...</div>}
        {investmentAdvice.data && (
          <div>
            <p>建議: {investmentAdvice.data.recommendation}</p>
            <p>信心度: {investmentAdvice.data.confidence}%</p>
            <p>理由: {investmentAdvice.data.reasoning}</p>
          </div>
        )}
      </div>

      {/* 風險評估 */}
      <div>
        <h3>風險評估</h3>
        {riskAssessment.loading && <div>評估中...</div>}
        {riskAssessment.data && (
          <div>
            <p>風險等級: {riskAssessment.data.riskLevel}</p>
            <p>風險分數: {riskAssessment.data.riskScore}</p>
            <ul>
              {riskAssessment.data.riskFactors.map((factor, index) => (
                <li key={index}>
                  {factor.factor} - {factor.impact} 影響
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 情緒分析 */}
      <div>
        <h3>市場情緒</h3>
        {sentiment.loading && <div>分析中...</div>}
        {sentiment.data && (
          <div>
            <p>情緒: {sentiment.data.sentiment}</p>
            <p>分數: {sentiment.data.score}</p>
            <p>趨勢: {sentiment.data.trend}</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

## RAG 搜尋 Hook 使用

### 基本 RAG 搜尋
```typescript
import { useRagSearch } from '@/hooks';

function RagSearch({ query }: { query: string }) {
  const { data, loading, error } = useRagSearch(query, {
    maxResults: 10,
    minScore: 0.5,
    includeMetadata: true
  });

  if (loading) return <div>搜尋中...</div>;
  if (error) return <div>搜尋錯誤: {error}</div>;
  
  return (
    <div>
      <h2>RAG 搜尋結果</h2>
      <p>找到 {data?.total} 個結果</p>
      {data?.results.map(result => (
        <div key={result.id}>
          <h3>{result.title}</h3>
          <p>相關度: {result.score}</p>
          <p>{result.content}</p>
          {result.metadata && (
            <div>
              <small>主題: {result.metadata.theme_name}</small>
              <small>股票: {result.metadata.stock_name}</small>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

### 智能 RAG 搜尋
```typescript
import { useRagSmartSearch } from '@/hooks';

function SmartRagSearch({ query }: { query: string }) {
  const { data, loading, error } = useRagSmartSearch(query, {
    maxResults: 10,
    minScore: 0.5
  });

  if (loading) return <div>智能分析中...</div>;
  if (error) return <div>分析錯誤: {error}</div>;
  
  return (
    <div>
      <h2>智能分析結果</h2>
      
      {/* AI 分析摘要 */}
      <div>
        <h3>分析摘要</h3>
        <p>{data?.analysis.summary}</p>
        
        <h4>關鍵洞察</h4>
        <ul>
          {data?.analysis.keyInsights.map((insight, index) => (
            <li key={index}>{insight}</li>
          ))}
        </ul>
        
        <h4>建議</h4>
        <ul>
          {data?.analysis.recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </div>

      {/* 搜尋結果 */}
      <div>
        <h3>相關文檔</h3>
        {data?.results.map(result => (
          <div key={result.id}>
            <h4>{result.title}</h4>
            <p>{result.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 自定義 RAG 搜尋
```typescript
import { useCustomRagSearch } from '@/hooks';

function CustomRagSearch({ query }: { query: string }) {
  const {
    data,
    loading,
    error,
    searchType,
    switchSearchType,
    allSearches
  } = useCustomRagSearch(query, 'smart', {
    maxResults: 10,
    minScore: 0.5
  });

  return (
    <div>
      <h2>自定義 RAG 搜尋</h2>
      
      {/* 搜尋類型切換 */}
      <div>
        <button onClick={() => switchSearchType('basic')}>基本搜尋</button>
        <button onClick={() => switchSearchType('smart')}>智能搜尋</button>
        <button onClick={() => switchSearchType('semantic')}>語義搜尋</button>
        <button onClick={() => switchSearchType('hybrid')}>混合搜尋</button>
      </div>
      
      <p>當前搜尋類型: {searchType}</p>
      
      {loading && <div>搜尋中...</div>}
      {error && <div>錯誤: {error}</div>}
      {data && (
        <div>
          <h3>搜尋結果</h3>
          {/* 根據搜尋類型顯示不同結果 */}
        </div>
      )}
    </div>
  );
}
```

## 快取管理 Hook 使用

### 快取監控
```typescript
import { useCache, useCacheMonitor } from '@/hooks';

function CacheManagement() {
  const { stats, items, clearAll, clearExpired } = useCache();
  const { isMonitoring, monitorStats, startMonitoring, stopMonitoring } = useCacheMonitor();

  return (
    <div>
      <h2>快取管理</h2>
      
      {/* 快取統計 */}
      <div>
        <h3>快取統計</h3>
        <p>快取項目數: {stats.size}</p>
        <p>總大小: {stats.totalSize} bytes</p>
        <p>命中率: {stats.hitRate}%</p>
        <p>未命中率: {stats.missRate}%</p>
      </div>

      {/* 快取項目列表 */}
      <div>
        <h3>快取項目</h3>
        {items.map(item => (
          <div key={item.key}>
            <p>鍵: {item.key}</p>
            <p>年齡: {item.age}ms</p>
            <p>狀態: {item.isExpired ? '已過期' : item.isStale ? '已過時' : '有效'}</p>
          </div>
        ))}
      </div>

      {/* 快取操作 */}
      <div>
        <button onClick={clearAll}>清除所有快取</button>
        <button onClick={clearExpired}>清除過期項目</button>
      </div>

      {/* 監控控制 */}
      <div>
        <h3>快取監控</h3>
        <button onClick={isMonitoring ? stopMonitoring : startMonitoring}>
          {isMonitoring ? '停止監控' : '開始監控'}
        </button>
        
        {isMonitoring && (
          <div>
            <p>請求數: {monitorStats.requests}</p>
            <p>命中數: {monitorStats.hits}</p>
            <p>未命中數: {monitorStats.misses}</p>
            <p>錯誤數: {monitorStats.errors}</p>
            <p>平均回應時間: {monitorStats.averageResponseTime}ms</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

### 快取策略管理
```typescript
import { useCacheStrategy } from '@/hooks';

function CacheStrategy() {
  const { strategy, strategies, getCurrentStrategy, switchStrategy } = useCacheStrategy();
  const currentStrategy = getCurrentStrategy();

  return (
    <div>
      <h2>快取策略管理</h2>
      
      {/* 策略選擇 */}
      <div>
        <h3>選擇策略</h3>
        <button onClick={() => switchStrategy('aggressive')}>激進策略</button>
        <button onClick={() => switchStrategy('balanced')}>平衡策略</button>
        <button onClick={() => switchStrategy('conservative')}>保守策略</button>
      </div>
      
      <p>當前策略: {strategy}</p>
      
      {/* 策略配置 */}
      <div>
        <h3>策略配置</h3>
        <p>預設快取時間: {currentStrategy.defaultCacheTime / 1000 / 60} 分鐘</p>
        <p>預設過期時間: {currentStrategy.defaultStaleTime / 1000 / 60} 分鐘</p>
        <p>重試次數: {currentStrategy.retryCount}</p>
        <p>預熱啟用: {currentStrategy.preloadEnabled ? '是' : '否'}</p>
      </div>
    </div>
  );
}
```

## 組合使用範例

### 完整的股票分析頁面
```typescript
import { 
  useTrendingThemes, 
  useThemeSearch, 
  useAiInvestmentAdvice,
  useRagSmartSearch,
  useCache
} from '@/hooks';

function StockAnalysisPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');
  
  // 趨勢主題
  const trendingThemes = useTrendingThemes({ useRealData: true });
  
  // 主題搜尋
  const themeSearch = useThemeSearch(searchQuery, { useRealData: false });
  
  // AI 投資建議
  const investmentAdvice = useAiInvestmentAdvice(selectedTheme);
  
  // RAG 智能搜尋
  const ragSearch = useRagSmartSearch(searchQuery);
  
  // 快取管理
  const { stats, clearAll } = useCache();

  return (
    <div>
      <h1>股票分析系統</h1>
      
      {/* 搜尋區域 */}
      <div>
        <input 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜尋主題或股票..."
        />
      </div>
      
      {/* 趨勢主題 */}
      <div>
        <h2>熱門主題</h2>
        {trendingThemes.loading && <div>載入中...</div>}
        {trendingThemes.data?.map(theme => (
          <div key={theme.id} onClick={() => setSelectedTheme(theme.id)}>
            <h3>{theme.name}</h3>
            <p>熱度: {theme.heatScore}</p>
          </div>
        ))}
      </div>
      
      {/* 搜尋結果 */}
      {searchQuery && (
        <div>
          <h2>搜尋結果</h2>
          {themeSearch.loading && <div>搜尋中...</div>}
          {themeSearch.data && (
            <div>
              <h3>{themeSearch.data.name}</h3>
              <p>{themeSearch.data.description}</p>
            </div>
          )}
        </div>
      )}
      
      {/* AI 分析 */}
      {selectedTheme && (
        <div>
          <h2>AI 分析</h2>
          {investmentAdvice.loading && <div>分析中...</div>}
          {investmentAdvice.data && (
            <div>
              <p>建議: {investmentAdvice.data.recommendation}</p>
              <p>信心度: {investmentAdvice.data.confidence}%</p>
            </div>
          )}
        </div>
      )}
      
      {/* RAG 分析 */}
      {searchQuery && (
        <div>
          <h2>RAG 智能分析</h2>
          {ragSearch.loading && <div>分析中...</div>}
          {ragSearch.data && (
            <div>
              <h3>分析摘要</h3>
              <p>{ragSearch.data.analysis.summary}</p>
            </div>
          )}
        </div>
      )}
      
      {/* 快取狀態 */}
      <div>
        <h3>快取狀態</h3>
        <p>快取項目: {stats.size}</p>
        <button onClick={clearAll}>清除快取</button>
      </div>
    </div>
  );
}
```

## 最佳實踐

### 1. 錯誤處理
```typescript
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);
  
  if (hasError) {
    return (
      <div>
        <h2>發生錯誤</h2>
        <button onClick={() => setHasError(false)}>重試</button>
      </div>
    );
  }
  
  return children;
}
```

### 2. 載入狀態管理
```typescript
function LoadingSpinner({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  if (loading) {
    return <div className="loading-spinner">載入中...</div>;
  }
  
  return <>{children}</>;
}
```

### 3. 快取優化
```typescript
function OptimizedComponent() {
  const { strategy, switchStrategy } = useCacheStrategy();
  
  // 根據網路狀況調整快取策略
  useEffect(() => {
    if (navigator.onLine) {
      switchStrategy('balanced');
    } else {
      switchStrategy('aggressive');
    }
  }, [switchStrategy]);
  
  return <div>優化組件</div>;
}
```

## 總結

優化後的 API Hook 系統提供了：

1. **統一的錯誤處理** - 標準化的錯誤類型和處理機制
2. **智能快取管理** - 多層快取策略和自動過期管理
3. **請求取消機制** - 防止記憶體洩漏和競態條件
4. **型別安全** - 完整的 TypeScript 型別定義
5. **重試機制** - 自動重試和指數退避
6. **效能優化** - 並行處理和智能快取
7. **易於使用** - 簡潔的 API 和豐富的功能

這些 Hook 可以大大提升開發效率和應用性能，同時保持良好的用戶體驗。
