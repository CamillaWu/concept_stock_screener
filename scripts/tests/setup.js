// Jest 測試設置文件

// 設置測試環境變數
process.env.NODE_ENV = 'test';
process.env.API_BASE_URL = 'http://localhost:8787';
process.env.GEMINI_API_KEY = 'test-key';
process.env.PINECONE_API_KEY = 'test-key';
process.env.PINECONE_ENVIRONMENT = 'test';

// 全局測試工具函數
global.testUtils = {
  // 模擬 API 回應
  mockApiResponse: (data, status = 200) => ({
    status,
    data,
    headers: { 'content-type': 'application/json' }
  }),
  
  // 模擬錯誤回應
  mockApiError: (message, status = 500) => ({
    status,
    error: message,
    success: false
  }),
  
  // 等待函數
  wait: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // 清理函數
  cleanup: () => {
    // 清理測試數據
    jest.clearAllMocks();
    jest.clearAllTimers();
  }
};

// 測試前後處理
beforeAll(() => {
  console.log('🚀 開始測試套件');
});

afterAll(() => {
  console.log('✅ 測試套件完成');
});

beforeEach(() => {
  // 每個測試前的設置
  global.testUtils.cleanup();
});

afterEach(() => {
  // 每個測試後的清理
  global.testUtils.cleanup();
});

// 處理未捕獲的異常
process.on('unhandledRejection', (reason, promise) => {
  console.error('未處理的 Promise 拒絕:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('未捕獲的異常:', error);
});
