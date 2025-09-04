// 根目錄 Jest 測試設置文件
// 這個文件用於所有測試的全局設置

import '@testing-library/jest-dom';

// 設置測試環境
process.env.NODE_ENV = 'test';

// 設置測試超時
jest.setTimeout(30000);

// 模擬 console 方法（在測試中靜默）
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  info: console.info,
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

// 創建穩定的 mock observer 類
class MockIntersectionObserver {
  constructor() {
    this.observe = jest.fn();
    this.unobserve = jest.fn();
    this.disconnect = jest.fn();
  }
}

class MockResizeObserver {
  constructor() {
    this.observe = jest.fn();
    this.unobserve = jest.fn();
    this.disconnect = jest.fn();
  }
}

class MockMutationObserver {
  constructor() {
    this.observe = jest.fn();
    this.disconnect = jest.fn();
    this.takeRecords = jest.fn();
  }
}

// 模擬 IntersectionObserver
global.IntersectionObserver = MockIntersectionObserver;

// 模擬 ResizeObserver
global.ResizeObserver = MockResizeObserver;

// 模擬 MutationObserver
global.MutationObserver = MockMutationObserver;

// 測試後清理
afterEach(() => {
  jest.clearAllMocks();
});
