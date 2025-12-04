// Jest global test setup
// Provides minimal browser/runtime shims for handler and UI tests

import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'util';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

// Lightweight Response polyfill for Cloudflare Worker handler tests
if (typeof global.Response === 'undefined') {
  class MockResponse {
    constructor(body, init = {}) {
      this.body = body;
      this.status = init.status ?? 200;
      this.headers = init.headers ?? {};
    }

    get ok() {
      return this.status >= 200 && this.status < 300;
    }

    async json() {
      return this.body ? JSON.parse(this.body) : null;
    }

    async text() {
      return this.body ?? '';
    }
  }

  global.Response = MockResponse;
}

process.env.NODE_ENV = 'test';

// Extend Jest default timeout to accommodate async handlers
jest.setTimeout(30000);

// Silence console noise while retaining info/debug paths
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  info: console.info,
  debug: console.debug,
};

// Minimal fetch stub; override per test when needed
global.fetch = jest.fn();

// Storage shims used by hooks/components
const createStorageMock = () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
});

global.localStorage = createStorageMock();
global.sessionStorage = createStorageMock();

// matchMedia shim for responsive components
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

// Stable observer mocks for React components relying on browser observers
class MockIntersectionObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

class MockResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

class MockMutationObserver {
  observe = jest.fn();
  disconnect = jest.fn();
  takeRecords = jest.fn();
}

global.IntersectionObserver = MockIntersectionObserver;
global.ResizeObserver = MockResizeObserver;
global.MutationObserver = MockMutationObserver;

afterEach(() => {
  jest.clearAllMocks();
});
