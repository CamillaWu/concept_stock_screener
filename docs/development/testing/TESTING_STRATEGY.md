# 測試策略完整文檔

## 1. 測試策略設計原則

### 1.1 測試目標

- **品質保證**：確保代碼品質和功能正確性
- **回歸防護**：防止新功能引入現有功能問題
- **文檔化**：測試作為活文檔，說明系統行為
- **信心建立**：開發者對系統變更有信心

### 1.2 測試原則

- **測試金字塔**：單元測試 > 整合測試 > E2E 測試
- **測試優先**：測試驅動開發 (TDD) 或測試優先開發
- **自動化**：所有測試都應該自動化執行
- **快速反饋**：測試應該快速執行，提供即時反饋

## 2. 測試架構設計

### 2.1 測試分層架構

```
測試金字塔
    /\
   /  \     E2E 測試 (少量，慢)
  /____\    整合測試 (中等，中速)
 /______\   單元測試 (大量，快速)
```

### 2.2 測試類型分類

- **單元測試 (Unit Tests)**：測試單個函數或組件
- **整合測試 (Integration Tests)**：測試多個組件協作
- **端到端測試 (E2E Tests)**：測試完整用戶流程
- **性能測試 (Performance Tests)**：測試系統性能指標
- **安全測試 (Security Tests)**：測試安全漏洞
- **可訪問性測試 (Accessibility Tests)**：測試 A11y 合規性

## 3. 單元測試策略

### 3.1 測試框架配置

```typescript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/**/*.stories.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
  },
};
```

### 3.2 測試工具和庫

```typescript
// package.json 測試依賴
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "jest": "^29.0.0",
    "ts-jest": "^29.0.0",
    "jest-environment-jsdom": "^29.0.0",
    "msw": "^2.0.0",
    "faker": "^8.0.0"
  }
}
```

### 3.3 單元測試示例

```typescript
// SearchBar.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './SearchBar';
import { useSearchStore } from '@/store/searchStore';

// Mock store
jest.mock('@/store/searchStore');
const mockUseSearchStore = useSearchStore as jest.MockedFunction<typeof useSearchStore>;

describe('SearchBar', () => {
  const mockSearch = jest.fn();
  const mockSetQuery = jest.fn();

  beforeEach(() => {
    mockUseSearchStore.mockReturnValue({
      query: '',
      setQuery: mockSetQuery,
      search: mockSearch,
      isLoading: false,
      results: []
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render search input and button', () => {
    render(<SearchBar />);

    expect(screen.getByPlaceholderText('搜尋概念或股票...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '搜尋' })).toBeInTheDocument();
  });

  it('should update query when typing', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);

    const input = screen.getByPlaceholderText('搜尋概念或股票...');
    await user.type(input, 'AI概念');

    expect(mockSetQuery).toHaveBeenCalledWith('AI概念');
  });

  it('should trigger search when button is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);

    const button = screen.getByRole('button', { name: '搜尋' });
    await user.click(button);

    expect(mockSearch).toHaveBeenCalled();
  });

  it('should trigger search when Enter is pressed', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);

    const input = screen.getByPlaceholderText('搜尋概念或股票...');
    await user.type(input, '新能源{enter}');

    expect(mockSearch).toHaveBeenCalled();
  });

  it('should show loading state', () => {
    mockUseSearchStore.mockReturnValue({
      query: '',
      setQuery: mockSetQuery,
      search: mockSearch,
      isLoading: true,
      results: []
    });

    render(<SearchBar />);

    expect(screen.getByText('搜尋中...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '搜尋' })).toBeDisabled();
  });
});
```

### 3.4 Hook 測試示例

```typescript
// useApi.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useApi } from './useApi';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/stocks', (req, res, ctx) => {
    return res(
      ctx.json([
        { id: '1', name: '台積電', code: '2330' },
        { id: '2', name: '聯發科', code: '2454' },
      ])
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('useApi', () => {
  it('should fetch data successfully', async () => {
    const { result } = renderHook(() => useApi('/api/stocks'));

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toHaveLength(2);
    expect(result.current.error).toBeNull();
  });

  it('should handle error gracefully', async () => {
    server.use(
      rest.get('/api/stocks', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    const { result } = renderHook(() => useApi('/api/stocks'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.data).toBeNull();
  });
});
```

## 4. 整合測試策略

### 4.1 測試環境設置

```typescript
// test-utils/setup.ts
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

export function renderWithProviders(
  ui: React.ReactElement,
  {
    queryClient = createTestQueryClient(),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    );
  }

  return {
    queryClient,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
```

### 4.2 API 整合測試

```typescript
// api.test.ts
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { renderHook, waitFor } from '@testing-library/react';
import { useStockData } from '@/hooks/useStockData';
import { renderWithProviders } from '@/test-utils/setup';

const server = setupServer(
  rest.get('/api/stocks/search', (req, res, ctx) => {
    const query = req.url.searchParams.get('q');

    if (query === 'AI') {
      return res(
        ctx.json({
          stocks: [
            {
              id: '1',
              name: '台積電',
              code: '2330',
              concepts: ['AI', '半導體'],
            },
            {
              id: '2',
              name: '聯發科',
              code: '2454',
              concepts: ['AI', 'IC設計'],
            },
          ],
          total: 2,
        })
      );
    }

    return res(ctx.json({ stocks: [], total: 0 }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Stock API Integration', () => {
  it('should search stocks by concept', async () => {
    const { result } = renderHook(() => useStockData(), {
      wrapper: renderWithProviders,
    });

    result.current.searchStocks('AI');

    await waitFor(() => {
      expect(result.current.stocks).toHaveLength(2);
    });

    expect(result.current.stocks[0].name).toBe('台積電');
    expect(result.current.stocks[1].name).toBe('聯發科');
  });

  it('should handle empty search results', async () => {
    const { result } = renderHook(() => useStockData(), {
      wrapper: renderWithProviders,
    });

    result.current.searchStocks('不存在的概念');

    await waitFor(() => {
      expect(result.current.stocks).toHaveLength(0);
    });
  });
});
```

### 4.3 組件整合測試

```typescript
// StockList.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { StockList } from './StockList';
import { renderWithProviders } from '@/test-utils/setup';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/stocks', (req, res, ctx) => {
    return res(
      ctx.json([
        { id: '1', name: '台積電', code: '2330', price: 500 },
        { id: '2', name: '聯發科', code: '2454', price: 800 }
      ])
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('StockList Integration', () => {
  it('should render stock list with data', async () => {
    renderWithProviders(<StockList />);

    await waitFor(() => {
      expect(screen.getByText('台積電')).toBeInTheDocument();
      expect(screen.getByText('聯發科')).toBeInTheDocument();
    });
  });

  it('should handle stock selection', async () => {
    const mockOnSelect = jest.fn();
    renderWithProviders(<StockList onSelect={mockOnSelect} />);

    await waitFor(() => {
      expect(screen.getByText('台積電')).toBeInTheDocument();
    });

    screen.getByText('台積電').click();
    expect(mockOnSelect).toHaveBeenCalledWith({
      id: '1',
      name: '台積電',
      code: '2330',
      price: 500
    });
  });
});
```

## 5. 端到端測試策略

### 5.1 Playwright 配置

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### 5.2 E2E 測試示例

```typescript
// e2e/search-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Search Flow', () => {
  test('should search for AI concept stocks', async ({ page }) => {
    // 導航到首頁
    await page.goto('/');

    // 等待頁面加載
    await page.waitForSelector('[data-testid="search-input"]');

    // 輸入搜索查詢
    await page.fill('[data-testid="search-input"]', 'AI概念');

    // 點擊搜索按鈕
    await page.click('[data-testid="search-button"]');

    // 等待搜索結果加載
    await page.waitForSelector('[data-testid="stock-list"]');

    // 驗證搜索結果
    const stockItems = await page.locator('[data-testid="stock-item"]').count();
    expect(stockItems).toBeGreaterThan(0);

    // 驗證結果包含預期內容
    const firstStock = page.locator('[data-testid="stock-item"]').first();
    await expect(firstStock).toContainText('AI');
  });

  test('should filter stocks by concept strength', async ({ page }) => {
    await page.goto('/');

    // 搜索概念
    await page.fill('[data-testid="search-input"]', '新能源');
    await page.click('[data-testid="search-button"]');

    // 等待結果加載
    await page.waitForSelector('[data-testid="stock-list"]');

    // 點擊概念強度篩選器
    await page.click('[data-testid="concept-strength-filter"]');

    // 選擇高強度
    await page.click('text=高強度');

    // 驗證篩選結果
    await page.waitForSelector('[data-testid="stock-list"]');
    const filteredStocks = await page
      .locator('[data-testid="stock-item"]')
      .count();
    expect(filteredStocks).toBeGreaterThan(0);
  });

  test('should save favorite stocks', async ({ page }) => {
    await page.goto('/');

    // 搜索股票
    await page.fill('[data-testid="search-input"]', '台積電');
    await page.click('[data-testid="search-button"]');

    // 等待結果加載
    await page.waitForSelector('[data-testid="stock-item"]');

    // 點擊收藏按鈕
    const firstStock = page.locator('[data-testid="stock-item"]').first();
    await firstStock.locator('[data-testid="favorite-button"]').click();

    // 驗證收藏狀態
    await expect(
      firstStock.locator('[data-testid="favorite-button"]')
    ).toHaveAttribute('data-favorited', 'true');

    // 導航到收藏頁面
    await page.click('[data-testid="favorites-tab"]');

    // 驗證收藏列表
    await page.waitForSelector('[data-testid="favorites-list"]');
    await expect(page.locator('[data-testid="favorites-list"]')).toContainText(
      '台積電'
    );
  });
});
```

### 5.3 視覺回歸測試

```typescript
// e2e/visual-regression.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('homepage should match snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 截圖比較
    await expect(page).toHaveScreenshot('homepage.png');
  });

  test('search results should match snapshot', async ({ page }) => {
    await page.goto('/');
    await page.fill('[data-testid="search-input"]', 'AI概念');
    await page.click('[data-testid="search-button"]');
    await page.waitForSelector('[data-testid="stock-list"]');

    // 截圖比較
    await expect(page).toHaveScreenshot('search-results.png');
  });

  test('mobile layout should match snapshot', async ({ page }) => {
    // 設置移動設備視口
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 截圖比較
    await expect(page).toHaveScreenshot('homepage-mobile.png');
  });
});
```

## 6. 性能測試策略

### 6.1 Lighthouse CI 配置

```yaml
# .lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/search?q=AI',
        'http://localhost:3000/stocks/2330'
      ],
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage'
      }
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.8 }],
        'categories:seo': ['warn', { minScore: 0.8 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};
```

### 6.2 負載測試配置

```typescript
// performance/load-test.ts
import { check } from 'k6';
import http from 'k6/http';

export const options = {
  stages: [
    { duration: '2m', target: 100 }, // 爬升到100用戶
    { duration: '5m', target: 100 }, // 維持100用戶
    { duration: '2m', target: 200 }, // 爬升到200用戶
    { duration: '5m', target: 200 }, // 維持200用戶
    { duration: '2m', target: 0 }, // 降回0用戶
  ],
  thresholds: {
    http_req_duration: ['p(95)<800'], // 95%的請求應該在800ms內完成
    http_req_failed: ['rate<0.01'], // 錯誤率應該小於1%
  },
};

export default function () {
  const baseUrl = __ENV.BASE_URL || 'http://localhost:3000';

  // 測試首頁
  const homeResponse = http.get(`${baseUrl}/`);
  check(homeResponse, {
    'homepage status is 200': r => r.status === 200,
    'homepage loads fast': r => r.timings.duration < 1000,
  });

  // 測試搜索API
  const searchResponse = http.get(`${baseUrl}/api/search?q=AI`);
  check(searchResponse, {
    'search API status is 200': r => r.status === 200,
    'search API responds fast': r => r.timings.duration < 500,
  });

  // 測試股票詳情頁面
  const stockResponse = http.get(`${baseUrl}/stocks/2330`);
  check(stockResponse, {
    'stock page status is 200': r => r.status === 200,
    'stock page loads fast': r => r.timings.duration < 1500,
  });
}
```

### 6.3 性能監控

```typescript
// performance/monitor.ts
import { performance } from 'perf_hooks';

export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  // 記錄性能指標
  recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
  }

  // 獲取性能統計
  getStats(name: string): PerformanceStats {
    const values = this.metrics.get(name) || [];

    if (values.length === 0) {
      return { count: 0, avg: 0, p95: 0, p99: 0 };
    }

    const sorted = values.sort((a, b) => a - b);
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const p95Index = Math.floor(values.length * 0.95);
    const p99Index = Math.floor(values.length * 0.99);

    return {
      count: values.length,
      avg: Math.round(avg * 100) / 100,
      p95: sorted[p95Index] || 0,
      p99: sorted[p99Index] || 0,
    };
  }

  // 性能裝飾器
  static measure<T extends any[], R>(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: T): Promise<R> {
      const start = performance.now();
      try {
        const result = await originalMethod.apply(this, args);
        const duration = performance.now() - start;

        // 記錄性能指標
        if (this.performanceMonitor) {
          this.performanceMonitor.recordMetric(
            `${propertyKey}_duration`,
            duration
          );
        }

        return result;
      } catch (error) {
        const duration = performance.now() - start;

        if (this.performanceMonitor) {
          this.performanceMonitor.recordMetric(
            `${propertyKey}_error_duration`,
            duration
          );
        }

        throw error;
      }
    };

    return descriptor;
  }
}
```

## 7. 安全測試策略

### 7.1 依賴安全掃描

```json
// package.json 腳本
{
  "scripts": {
    "security:audit": "npm audit --audit-level=moderate",
    "security:fix": "npm audit fix",
    "security:check": "npm audit --audit-level=high --json > security-report.json"
  }
}
```

### 7.2 安全測試示例

```typescript
// security/security.test.ts
import { test, expect } from '@playwright/test';

test.describe('Security Tests', () => {
  test('should not expose sensitive information in response headers', async ({
    page,
  }) => {
    const response = await page.goto('/');

    // 檢查不應該暴露的頭部
    const headers = response?.headers();
    expect(headers).not.toHaveProperty('x-powered-by');
    expect(headers).not.toHaveProperty('server');
  });

  test('should prevent XSS attacks', async ({ page }) => {
    await page.goto('/');

    // 嘗試注入惡意腳本
    const maliciousInput = '<script>alert("xss")</script>';
    await page.fill('[data-testid="search-input"]', maliciousInput);

    // 檢查頁面是否正確轉義
    const pageContent = await page.content();
    expect(pageContent).toContain('&lt;script&gt;');
    expect(pageContent).not.toContain('<script>');
  });

  test('should prevent CSRF attacks', async ({ page }) => {
    await page.goto('/');

    // 檢查是否有 CSRF token
    const csrfToken = await page.locator('[name="csrf-token"]').count();
    expect(csrfToken).toBeGreaterThan(0);
  });
});
```

## 8. 可訪問性測試策略

### 8.1 A11y 測試配置

```typescript
// a11y/a11y.test.ts
import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('homepage should meet accessibility standards', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('search functionality should be keyboard accessible', async ({
    page,
  }) => {
    await page.goto('/');

    // 使用 Tab 鍵導航
    await page.keyboard.press('Tab');
    expect(await page.locator('[data-testid="search-input"]')).toBeFocused();

    // 使用 Enter 鍵搜索
    await page.keyboard.press('Enter');
    await page.waitForSelector('[data-testid="search-results"]');
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/');

    // 檢查搜索輸入框的 ARIA 標籤
    const searchInput = page.locator('[data-testid="search-input"]');
    await expect(searchInput).toHaveAttribute('aria-label', '搜尋概念或股票');

    // 檢查搜索按鈕的 ARIA 標籤
    const searchButton = page.locator('[data-testid="search-button"]');
    await expect(searchButton).toHaveAttribute('aria-label', '執行搜尋');
  });
});
```

## 9. 測試數據管理

### 9.1 測試數據工廠

```typescript
// test-utils/factories.ts
import { faker } from '@faker-js/faker';

export class StockFactory {
  static create(overrides: Partial<Stock> = {}): Stock {
    return {
      id: faker.string.uuid(),
      name: faker.company.name(),
      code: faker.string.numeric(4),
      price: faker.number.float({ min: 10, max: 1000, precision: 0.01 }),
      concepts: faker.helpers.arrayElements(
        ['AI', '新能源', '半導體', '醫療'],
        { min: 1, max: 3 }
      ),
      marketCap: faker.number.float({ min: 1000000000, max: 1000000000000 }),
      ...overrides,
    };
  }

  static createMany(count: number, overrides: Partial<Stock> = {}): Stock[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }
}

export class ConceptFactory {
  static create(overrides: Partial<Concept> = {}): Concept {
    return {
      id: faker.string.uuid(),
      name: faker.helpers.arrayElement(['AI', '新能源', '半導體', '醫療']),
      description: faker.lorem.sentence(),
      strength: faker.number.float({ min: 0.1, max: 1.0, precision: 0.01 }),
      ...overrides,
    };
  }
}
```

### 9.2 Mock 服務器配置

```typescript
// test-utils/mocks.ts
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { StockFactory, ConceptFactory } from './factories';

export const handlers = [
  // 股票搜索 API
  rest.get('/api/stocks/search', (req, res, ctx) => {
    const query = req.url.searchParams.get('q');
    const page = parseInt(req.url.searchParams.get('page') || '1');
    const limit = parseInt(req.url.searchParams.get('limit') || '10');

    const stocks = StockFactory.createMany(limit);

    return res(
      ctx.delay(100), // 模擬網絡延遲
      ctx.json({
        stocks,
        total: 100,
        page,
        limit,
        totalPages: Math.ceil(100 / limit),
      })
    );
  }),

  // 概念列表 API
  rest.get('/api/concepts', (req, res, ctx) => {
    const concepts = ConceptFactory.createMany(20);

    return res(ctx.delay(50), ctx.json(concepts));
  }),

  // 股票詳情 API
  rest.get('/api/stocks/:id', (req, res, ctx) => {
    const { id } = req.params;
    const stock = StockFactory.create({ id: id as string });

    return res(ctx.delay(80), ctx.json(stock));
  }),
];

export const server = setupServer(...handlers);
```

## 10. 測試執行和報告

### 10.1 測試腳本配置

```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:performance": "k6 run performance/load-test.ts",
    "test:lighthouse": "lhci autorun",
    "test:security": "npm run security:audit",
    "test:a11y": "playwright test a11y/",
    "test:all": "npm run test && npm run test:e2e && npm run test:performance"
  }
}
```

### 10.2 測試報告配置

```typescript
// jest.config.js 報告配置
module.exports = {
  // ... 其他配置
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        pageTitle: '測試報告',
        outputPath: './test-report.html',
        includeFailureMsg: true,
        includeConsoleLog: true,
      },
    ],
    [
      'jest-junit',
      {
        outputDirectory: './reports/junit',
        outputName: 'junit.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: true,
      },
    ],
  ],
};
```

## 11. 持續測試集成

### 11.1 GitHub Actions 測試工作流

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - uses: actions/checkout@v4

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Run type checking
        run: npm run type-check

      - name: Run unit tests
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload Playwright results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report-${{ matrix.node-version }}
          path: playwright-report/
          retention-days: 30
```

### 11.2 測試質量門檻

```typescript
// test-quality-gates.ts
export const QUALITY_GATES = {
  // 測試覆蓋率門檻
  coverage: {
    statements: 80,
    branches: 80,
    functions: 80,
    lines: 80,
  },

  // 性能門檻
  performance: {
    maxResponseTime: 800, // 800ms
    maxLCP: 2500, // 2.5s
    maxCLS: 0.1, // 0.1
    maxFID: 100, // 100ms
  },

  // 可訪問性門檻
  accessibility: {
    minScore: 0.9, // 90%
  },

  // 安全門檻
  security: {
    maxVulnerabilities: 0, // 0個漏洞
    maxAuditLevel: 'moderate', // 最高中等風險
  },
};
```

## 12. 成功標準和 KPI

### 12.1 測試覆蓋率指標

- **代碼覆蓋率**：≥ 80%
- **分支覆蓋率**：≥ 80%
- **函數覆蓋率**：≥ 80%

> **最新快照 (2025-09-25)**：語句 88.78% / 分支 87.78% / 函數 91.34% / 行數 88.88%，僅剩 packages/ui/src/components/table 內的 renderer helpers 存在分支缺口；後續增補測試時需優先涵蓋此處。

### 12.2 測試執行指標

- **單元測試執行時間**：< 30秒
- **整合測試執行時間**：< 2分鐘
- **E2E 測試執行時間**：< 10分鐘

### 12.3 測試質量指標

- **測試通過率**：100%
- **測試穩定性**：> 95%
- **測試維護性**：高

## 13. 後續步驟

### 13.1 立即執行

1. 設置 Jest 測試環境
2. 配置 Playwright E2E 測試
3. 建立測試數據工廠

### 13.2 短期目標 (1-2 週)

1. 完成核心組件單元測試
2. 實現基本 E2E 測試流程
3. 建立測試報告系統

### 13.3 中期目標 (3-4 週)

1. 完成所有組件測試覆蓋
2. 實現性能測試和監控
3. 建立持續測試集成

### 13.4 長期目標 (6-8 週)

1. 實現完整的測試自動化
2. 建立測試質量門檻
3. 優化測試執行效率
