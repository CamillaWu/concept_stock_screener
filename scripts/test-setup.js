// 概念股篩選系統 - 測試環境設置
// 此文件在每個測試文件執行前運行

// 導入 jest-dom 匹配器
import '@testing-library/jest-dom';

// 設置測試環境
process.env.NODE_ENV = 'test';

// 模擬環境變數
process.env.GEMINI_API_KEY = 'test-gemini-api-key';
process.env.PINECONE_API_KEY = 'test-pinecone-api-key';
process.env.PINECONE_ENVIRONMENT = 'test-environment';
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8787';

// 設置測試超時
jest.setTimeout(30000);

// 全局測試工具
global.testUtils = {
  // 創建模擬數據
  createMockData: (type = 'default') => {
    const mockData = {
      default: {
        id: 'test-id',
        name: 'test-name',
        timestamp: new Date().toISOString(),
      },
      stock: {
        symbol: '2330',
        name: '台積電',
        price: 580.0,
        change: 15.0,
        changePercent: 0.026,
        volume: 50000000,
        marketCap: 15000000000000,
        sector: '半導體',
        industry: '晶圓代工',
      },
      concept: {
        id: 'ai-chips',
        name: 'AI 晶片概念',
        description: '人工智慧晶片相關概念股',
        keywords: ['AI', '晶片', '半導體', '人工智慧'],
        stocks: ['2330', '2317', '2454'],
        marketCap: 25000000000000,
        trend: 'up',
      },
      search: {
        query: 'AI 晶片',
        results: {
          stocks: [],
          concepts: [],
          total: 0,
          suggestions: ['AI', '晶片', '半導體'],
          message: '找到 0 個相關結果',
        },
      },
    };

    return mockData[type] || mockData.default;
  },

  // 創建模擬 API 響應
  createMockApiResponse: (data, success = true, message = 'Success') => ({
    success,
    data,
    message,
    timestamp: new Date().toISOString(),
    ...(success ? {} : { error: 'Test error' }),
  }),

  // 創建模擬錯誤
  createMockError: (message = 'Test error', status = 500) => ({
    message,
    status,
    timestamp: new Date().toISOString(),
  }),

  // 創建模擬請求
  createMockRequest: (method = 'GET', url = '/api/test', body = null) => ({
    method,
    url,
    body,
    headers: {
      'content-type': 'application/json',
      authorization: 'Bearer test-token',
    },
    params: {},
    query: {},
  }),

  // 創建模擬響應
  createMockResponse: () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnThis(),
    };

    // 添加狀態碼檢查
    res.status.mockImplementation(code => {
      res.statusCode = code;
      return res;
    });

    return res;
  },

  // 創建模擬環境
  createMockEnv: () => ({
    GEMINI_API_KEY: 'test-gemini-key',
    PINECONE_API_KEY: 'test-pinecone-key',
    PINECONE_ENVIRONMENT: 'test-env',
    NODE_ENV: 'test',
  }),

  // 創建模擬上下文
  createMockContext: () => ({
    params: {},
    query: {},
    env: {},
    waitUntil: jest.fn(),
  }),
};

// 模擬 console 方法
global.console = {
  ...console,
  // 在測試中靜默 console.log
  log: jest.fn(),
  // 在測試中靜默 console.warn
  warn: jest.fn(),
  // 在測試中靜默 console.error
  error: jest.fn(),
  // 保留 console.info 用於調試
  info: console.info,
  // 保留 console.debug 用於調試
  debug: console.debug,
};

// 模擬 fetch API
global.fetch = jest.fn();

// 模擬 localStorage
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};

// 模擬 sessionStorage
global.sessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};

// 模擬 matchMedia
global.matchMedia = jest.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));

// 模擬 IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// 模擬 ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// 模擬 MutationObserver
global.MutationObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  takeRecords: jest.fn(),
}));

// 測試後清理
afterEach(() => {
  // 清除所有模擬
  jest.clearAllMocks();

  // 重置 fetch 模擬
  if (global.fetch) {
    global.fetch.mockClear();
  }

  // 重置 localStorage 模擬
  if (
    global.localStorage &&
    global.localStorage.getItem &&
    global.localStorage.getItem.mockClear
  ) {
    global.localStorage.getItem.mockClear();
    global.localStorage.setItem.mockClear();
    global.localStorage.removeItem.mockClear();
    global.localStorage.clear.mockClear();
  }

  // 重置 sessionStorage 模擬
  if (
    global.sessionStorage &&
    global.sessionStorage.getItem &&
    global.sessionStorage.getItem.mockClear
  ) {
    global.sessionStorage.getItem.mockClear();
    global.sessionStorage.setItem.mockClear();
    global.sessionStorage.removeItem.mockClear();
    global.sessionStorage.clear.mockClear();
  }
});

// 測試套件後清理
afterAll(() => {
  // 恢復 console 方法
  global.console = console;

  // 清理模擬
  jest.restoreAllMocks();
});

// 導出測試工具
module.exports = global.testUtils;
