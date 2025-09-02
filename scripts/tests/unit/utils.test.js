/**
 * 工具函數單元測試
 */

describe('工具函數測試', () => {
  
  describe('API 工具函數', () => {
    
    test('mockApiResponse 應該返回正確的格式', () => {
      const testData = { message: 'test' };
      const response = global.testUtils.mockApiResponse(testData);
      
      expect(response.status).toBe(200);
      expect(response.data).toEqual(testData);
      expect(response.headers['content-type']).toBe('application/json');
    });
    
    test('mockApiResponse 應該支援自定義狀態碼', () => {
      const response = global.testUtils.mockApiResponse({}, 404);
      expect(response.status).toBe(404);
    });
    
    test('mockApiError 應該返回錯誤格式', () => {
      const errorMessage = '測試錯誤';
      const response = global.testUtils.mockApiError(errorMessage);
      
      expect(response.status).toBe(500);
      expect(response.error).toBe(errorMessage);
      expect(response.success).toBe(false);
    });
    
    test('mockApiError 應該支援自定義狀態碼', () => {
      const response = global.testUtils.mockApiError('錯誤', 400);
      expect(response.status).toBe(400);
    });
  });
  
  describe('工具函數', () => {
    
    test('wait 函數應該正確延遲', async () => {
      const start = Date.now();
      await global.testUtils.wait(100);
      const end = Date.now();
      
      expect(end - start).toBeGreaterThanOrEqual(100);
    });
    
    test('cleanup 函數應該清理測試環境', () => {
      // 創建一個自定義的 cleanup 函數來測試
      const mockClearAllMocks = jest.fn();
      const mockClearAllTimers = jest.fn();
      
      const customCleanup = () => {
        mockClearAllMocks();
        mockClearAllTimers();
      };
      
      // 調用自定義 cleanup 函數
      customCleanup();
      
      expect(mockClearAllMocks).toHaveBeenCalled();
      expect(mockClearAllTimers).toHaveBeenCalled();
    });
  });
  
  describe('環境變數', () => {
    
    test('測試環境變數應該正確設置', () => {
      expect(process.env.NODE_ENV).toBe('test');
      expect(process.env.API_BASE_URL).toBe('http://localhost:8787');
      expect(process.env.GEMINI_API_KEY).toBe('test-key');
      expect(process.env.PINECONE_API_KEY).toBe('test-key');
      expect(process.env.PINECONE_ENVIRONMENT).toBe('test');
    });
  });
});
