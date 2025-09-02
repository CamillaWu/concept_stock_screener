# 核心功能開發完整文檔

## 1. 功能開發原則

### 1.1 開發指導原則
- **完全重頭開始**：除了必要文件，所有代碼重新開發
- **功能優先**：優先實現核心功能，後續優化
- **代碼品質**：嚴格遵循 TypeScript 和 React 最佳實踐
- **測試驅動**：每個功能都有對應的測試覆蓋
- **文檔同步**：代碼和文檔同步更新

### 1.2 開發順序
1. **基礎架構**：類型定義、基礎組件、狀態管理
2. **核心功能**：AI 搜尋引擎、三欄式佈局
3. **進階功能**：市場指標、個人化功能
4. **優化完善**：效能優化、錯誤處理、響應式設計

## 2. AI 雙向搜尋引擎

### 2.1 功能概述
基於 PRD 的核心功能，實現「主題到個股」和「個股到主題」的雙向搜尋。

### 2.2 技術實現

#### **Gemini 2.5 Pro 整合**
```typescript
// packages/types/src/ai/index.ts
export interface GeminiConfig {
  apiKey: string;
  model: 'gemini-2.0-flash-exp' | 'gemini-1.5-flash';
  temperature: number;
  maxTokens: number;
}

export interface AIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}
```

#### **搜尋服務封裝**
```typescript
// apps/api/src/services/gemini.service.ts
export class GeminiService {
  private config: GeminiConfig;
  
  constructor(config: GeminiConfig) {
    this.config = config;
  }
  
  async searchThemeToStock(theme: string): Promise<AIResponse<StockConcept>> {
    const prompt = this.buildThemePrompt(theme);
    const response = await this.callGemini(prompt);
    return this.parseStockConceptResponse(response);
  }
  
  async searchStockToTheme(stock: string): Promise<AIResponse<StockAnalysisResult>> {
    const prompt = this.buildStockPrompt(stock);
    const response = await this.callGemini(prompt);
    return this.parseStockAnalysisResponse(response);
  }
  
  private buildThemePrompt(theme: string): string {
    return `你是一位專精於台股市場的金融分析師。
請分析「${theme}」這個投資主題，並提供以下資訊：
1. 主題說明（100字以內）
2. 市場熱度評分（0-100）
3. 相關個股清單（最多10檔）

每檔個股需包含：
- 股票代號
- 股票名稱
- 交易所（TWSE或TPEx）
- 入選理由（50字以內）

請以JSON格式回傳，格式如下：
{
  "theme": "主題名稱",
  "description": "主題說明",
  "heatScore": 85,
  "stocks": [
    {
      "ticker": "2330",
      "name": "台積電",
      "exchange": "TWSE",
      "reason": "全球晶圓代工龍頭，AI晶片主要供應商"
    }
  ]
}`;
  }
}
```

### 2.3 前端整合

#### **搜尋組件**
```typescript
// apps/web/src/components/SearchBar/SearchBar.tsx
interface SearchBarProps {
  onSearch: (query: string, mode: SearchMode) => void;
  loading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<SearchMode>('theme');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), mode);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setMode('theme')}
          className={`px-4 py-2 rounded-lg ${
            mode === 'theme' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          主題搜尋
        </button>
        <button
          type="button"
          onClick={() => setMode('stock')}
          className={`px-4 py-2 rounded-lg ${
            mode === 'stock' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          個股搜尋
        </button>
      </div>
      
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            mode === 'theme' 
              ? '搜尋主題，如：光通訊' 
              : '輸入股號/名稱，如：2330 或 台積電'
          }
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="absolute right-2 top-2 px-4 py-1 bg-blue-600 text-white rounded-md disabled:bg-gray-400"
        >
          {loading ? '搜尋中...' : '搜尋'}
        </button>
      </div>
    </form>
  );
};
```

## 3. 三欄式佈局系統

### 3.1 佈局架構

#### **主佈局組件**
```typescript
// apps/web/src/components/Layout/AppLayout.tsx
interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* 左側邊欄 */}
      <aside className={`
        ${sidebarOpen ? 'w-80' : 'w-20'} 
        bg-white border-r border-gray-200 
        transition-all duration-300 ease-in-out
      `}>
        <Sidebar 
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      </aside>
      
      {/* 中間主內容 */}
      <main className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 p-4">
          <SearchBar onSearch={handleSearch} />
        </header>
        
        <div className="flex-1 flex">
          {/* 主題分析面板 */}
          <section className="flex-1 p-6 overflow-y-auto">
            {children}
          </section>
          
          {/* 右側詳情面板 */}
          {detailPanelOpen && (
            <aside className="w-96 bg-white border-l border-gray-200">
              <DetailPanel 
                onClose={() => setDetailPanelOpen(false)}
              />
            </aside>
          )}
        </div>
      </main>
    </div>
  );
};
```

### 3.2 響應式設計

#### **斷點配置**
```typescript
// apps/web/src/hooks/useBreakpoint.ts
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('desktop');
  
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1280) {
        setBreakpoint('desktop');
      } else if (width >= 1024) {
        setBreakpoint('tablet-large');
      } else if (width >= 768) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('mobile');
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return breakpoint;
};
```

#### **響應式佈局邏輯**
```typescript
// apps/web/src/components/Layout/ResponsiveLayout.tsx
export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ 
  children, 
  breakpoint 
}) => {
  if (breakpoint === 'mobile') {
    return <MobileLayout>{children}</MobileLayout>;
  }
  
  if (breakpoint === 'tablet') {
    return <TabletLayout>{children}</TabletLayout>;
  }
  
  return <DesktopLayout>{children}</DesktopLayout>;
};
```

## 4. 市場指標系統

### 4.1 熱度指標 (Heat Bar)

#### **組件實現**
```typescript
// apps/web/src/components/HeatBar/HeatBar.tsx
interface HeatBarProps {
  score: number;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  className?: string;
}

export const HeatBar: React.FC<HeatBarProps> = ({ 
  score, 
  size = 'medium', 
  showLabel = true,
  className = '' 
}) => {
  const getColor = (score: number) => {
    if (score >= 80) return 'from-red-500 to-orange-500';
    if (score >= 60) return 'from-orange-500 to-yellow-500';
    if (score >= 40) return 'from-yellow-500 to-green-500';
    return 'from-green-500 to-blue-500';
  };
  
  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'small': return 'h-2';
      case 'large': return 'h-4';
      default: return 'h-3';
    }
  };
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`flex-1 bg-gray-200 rounded-full overflow-hidden ${getSizeClasses(size)}`}>
        <div 
          className={`h-full bg-gradient-to-r ${getColor(score)} transition-all duration-300`}
          style={{ width: `${score}%` }}
        />
      </div>
      
      {showLabel && (
        <span className="text-sm font-medium text-gray-700 min-w-[3rem]">
          {score}
        </span>
      )}
    </div>
  );
};
```

### 4.2 概念強度排名

#### **計算邏輯**
```typescript
// apps/web/src/utils/conceptStrength.ts
export interface ConceptStrengthMetrics {
  marketCapRatio: number;      // 市值佔比
  priceChangeContribution: number; // 漲幅貢獻度
  discussionIntensity: number;     // 討論熱度
}

export const calculateConceptStrength = (
  metrics: ConceptStrengthMetrics
): number => {
  const weights = {
    marketCapRatio: 0.4,
    priceChangeContribution: 0.3,
    discussionIntensity: 0.3
  };
  
  return (
    metrics.marketCapRatio * weights.marketCapRatio +
    metrics.priceChangeContribution * weights.priceChangeContribution +
    metrics.discussionIntensity * weights.discussionIntensity
  );
};
```

## 5. 狀態管理系統

### 5.1 Zustand 狀態管理

#### **應用狀態**
```typescript
// apps/web/src/store/appStore.ts
interface AppState {
  // 搜尋狀態
  searchQuery: string;
  searchMode: SearchMode;
  searchResults: SearchResults | null;
  searchLoading: boolean;
  
  // 佈局狀態
  sidebarOpen: boolean;
  detailPanelOpen: boolean;
  selectedTheme: string | null;
  selectedStock: string | null;
  
  // 響應式狀態
  breakpoint: Breakpoint;
  
  // 操作
  setSearchQuery: (query: string) => void;
  setSearchMode: (mode: SearchMode) => void;
  setSearchResults: (results: SearchResults | null) => void;
  setSearchLoading: (loading: boolean) => void;
  toggleSidebar: () => void;
  toggleDetailPanel: () => void;
  selectTheme: (theme: string) => void;
  selectStock: (stock: string) => void;
  setBreakpoint: (breakpoint: Breakpoint) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // 初始狀態
  searchQuery: '',
  searchMode: 'theme',
  searchResults: null,
  searchLoading: false,
  sidebarOpen: true,
  detailPanelOpen: false,
  selectedTheme: null,
  selectedStock: null,
  breakpoint: 'desktop',
  
  // 操作
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchMode: (mode) => set({ searchMode: mode }),
  setSearchResults: (results) => set({ searchResults: results }),
  setSearchLoading: (loading) => set({ searchLoading: loading }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleDetailPanel: () => set((state) => ({ detailPanelOpen: !state.detailPanelOpen })),
  selectTheme: (theme) => set({ selectedTheme: theme }),
  selectStock: (stock) => set({ selectedStock: stock }),
  setBreakpoint: (breakpoint) => set({ breakpoint })
}));
```

### 5.2 本地存儲管理

#### **收藏功能**
```typescript
// apps/web/src/hooks/useFavorites.ts
export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  
  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse favorites:', error);
        setFavorites([]);
      }
    }
  }, []);
  
  const addFavorite = (theme: string) => {
    const newFavorites = [...favorites, theme];
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };
  
  const removeFavorite = (theme: string) => {
    const newFavorites = favorites.filter(f => f !== theme);
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };
  
  const isFavorite = (theme: string) => favorites.includes(theme);
  
  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite
  };
};
```

## 6. 錯誤處理系統

### 6.1 錯誤邊界

#### **錯誤邊界組件**
```typescript
// apps/web/src/components/ErrorBoundary/ErrorBoundary.tsx
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>, 
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              發生錯誤
            </h1>
            <p className="text-gray-600 mb-6">
              很抱歉，應用程式發生錯誤。請重新整理頁面或聯繫支援團隊。
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              重新整理
            </button>
          </div>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

### 6.2 API 錯誤處理

#### **錯誤處理 Hook**
```typescript
// apps/web/src/hooks/useApiError.ts
export const useApiError = () => {
  const [error, setError] = useState<string | null>(null);
  
  const handleError = (error: unknown) => {
    if (error instanceof Error) {
      setError(error.message);
    } else if (typeof error === 'string') {
      setError(error);
    } else {
      setError('發生未知錯誤');
    }
  };
  
  const clearError = () => setError(null);
  
  return {
    error,
    handleError,
    clearError
  };
};
```

## 7. 測試策略

### 7.1 測試配置

#### **Jest 配置**
```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

### 7.2 組件測試

#### **搜尋組件測試**
```typescript
// apps/web/src/components/SearchBar/__tests__/SearchBar.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from '../SearchBar';

describe('SearchBar', () => {
  const mockOnSearch = jest.fn();
  
  beforeEach(() => {
    mockOnSearch.mockClear();
  });
  
  it('renders search input and buttons', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    expect(screen.getByPlaceholderText(/搜尋主題/)).toBeInTheDocument();
    expect(screen.getByText('主題搜尋')).toBeInTheDocument();
    expect(screen.getByText('個股搜尋')).toBeInTheDocument();
    expect(screen.getByText('搜尋')).toBeInTheDocument();
  });
  
  it('calls onSearch when form is submitted', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText(/搜尋主題/);
    const submitButton = screen.getByText('搜尋');
    
    fireEvent.change(input, { target: { value: 'AI' } });
    fireEvent.click(submitButton);
    
    expect(mockOnSearch).toHaveBeenCalledWith('AI', 'theme');
  });
  
  it('switches between search modes', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const stockButton = screen.getByText('個股搜尋');
    fireEvent.click(stockButton);
    
    expect(screen.getByPlaceholderText(/輸入股號/)).toBeInTheDocument();
  });
});
```

## 8. 效能優化

### 8.1 代碼分割

#### **動態導入**
```typescript
// apps/web/src/components/LazyComponents.tsx
import dynamic from 'next/dynamic';

export const LazyDetailPanel = dynamic(
  () => import('./DetailPanel/DetailPanel').then(mod => ({ default: mod.DetailPanel })),
  {
    loading: () => <DetailPanelSkeleton />,
    ssr: false
  }
);

export const LazyStockDetailPanel = dynamic(
  () => import('./StockDetailPanel/StockDetailPanel').then(mod => ({ default: mod.StockDetailPanel })),
  {
    loading: () => <StockDetailPanelSkeleton />,
    ssr: false
  }
);
```

### 8.2 記憶化優化

#### **React.memo 和 useMemo**
```typescript
// apps/web/src/components/ThemeCard/ThemeCard.tsx
export const ThemeCard = React.memo<ThemeCardProps>(({ 
  theme, 
  onSelect, 
  isFavorite,
  onToggleFavorite 
}) => {
  const heatBarColor = useMemo(() => {
    return theme.heatScore >= 80 ? 'red' : 
           theme.heatScore >= 60 ? 'orange' : 
           theme.heatScore >= 40 ? 'yellow' : 'green';
  }, [theme.heatScore]);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{theme.theme}</h3>
        <button
          onClick={() => onToggleFavorite(theme.theme)}
          className={`text-2xl ${isFavorite ? 'text-yellow-500' : 'text-gray-300'}`}
        >
          ★
        </button>
      </div>
      
      <p className="text-gray-600 text-sm mb-3">{theme.description}</p>
      
      <HeatBar score={theme.heatScore} size="small" />
      
      <div className="mt-3">
        <button
          onClick={() => onSelect(theme.theme)}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          查看詳情
        </button>
      </div>
    </div>
  );
});

ThemeCard.displayName = 'ThemeCard';
```

## 9. 成功標準

### 9.1 功能完整性
- ✅ AI 雙向搜尋正常工作
- ✅ 三欄式佈局響應式設計
- ✅ 市場指標系統完整
- ✅ 狀態管理穩定可靠

### 9.2 代碼品質
- ✅ TypeScript 類型檢查通過
- ✅ ESLint 檢查無錯誤
- ✅ 測試覆蓋率達到 80% 以上
- ✅ 代碼文檔完整

### 9.3 用戶體驗
- ✅ 搜尋響應時間 < 800ms
- ✅ 頁面載入時間 < 2.5s
- ✅ 響應式設計在所有設備正常
- ✅ 錯誤處理用戶友好

## 10. 後續優化

### 10.1 短期優化 (1-2 週)
- 效能監控和優化
- 錯誤追蹤和分析
- 用戶行為分析

### 10.2 中期優化 (3-4 週)
- 進階搜尋功能
- 個人化推薦
- 社交功能

### 10.3 長期優化 (6-8 週)
- 機器學習優化
- 多語言支持
- 移動應用開發
