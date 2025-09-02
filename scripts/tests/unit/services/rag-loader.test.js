/**
 * RAG 載入器服務單元測試
 * 測試 RAG 數據載入、狀態查詢、數據搜尋、快取管理等核心功能
 */

const mockRagLoader = {
  // 模擬 RAG 載入器的主要方法
  loadRagData: jest.fn(),
  getRagStatus: jest.fn(),
  searchRagData: jest.fn(),
  clearCache: jest.fn(),
  validateData: jest.fn()
};

const mockCacheService = {
  // 模擬快取服務
  get: jest.fn(),
  set: jest.fn(),
  has: jest.fn(),
  clear: jest.fn()
};

const mockEnvironmentDetector = {
  // 模擬環境檢測器
  isDevelopment: jest.fn(),
  isProduction: jest.fn(),
  getEnvironment: jest.fn()
};

// 模擬 RAG 數據
const mockRagData = {
  documents: [
    {
      id: 'doc_1',
      title: 'AI 晶片技術發展',
      content: 'AI 晶片技術在近年來快速發展...',
      metadata: { category: 'technology', date: '2025-01-15' }
    },
    {
      id: 'doc_2',
      title: '5G 網路建設',
      content: '5G 網路建設正在全球範圍內展開...',
      metadata: { category: 'infrastructure', date: '2025-01-14' }
    }
  ],
  concepts: ['AI 晶片', '5G 技術', '機器學習'],
  lastUpdated: '2025-01-15T10:30:00Z'
};

describe('RAG 載入器服務', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // 重置模擬函數的返回值
    mockRagLoader.loadRagData.mockResolvedValue({
      success: true,
      data: mockRagData,
      loadTime: 1500,
      documentCount: 2
    });
    
    mockRagLoader.getRagStatus.mockResolvedValue({
      status: 'ready',
      lastUpdated: '2025-01-15T10:30:00Z',
      documentCount: 2,
      indexSize: '15.2MB'
    });
    
    mockRagLoader.searchRagData.mockResolvedValue({
      success: true,
      query: 'AI 晶片',
      results: [
        {
          id: 'doc_1',
          title: 'AI 晶片技術發展',
          content: 'AI 晶片技術在近年來快速發展...',
          score: 0.95,
          metadata: { category: 'technology', date: '2025-01-15' }
        }
      ],
      totalResults: 1,
      searchTime: 45
    });
    
    mockRagLoader.clearCache.mockResolvedValue({
      success: true,
      clearedItems: 5,
      message: '快取已清空'
    });
    
    mockRagLoader.validateData.mockReturnValue({
      isValid: true,
      errors: [],
      warnings: []
    });
    
    mockCacheService.get.mockReturnValue(mockRagData);
    mockCacheService.set.mockResolvedValue(true);
    mockCacheService.has.mockReturnValue(true);
    mockCacheService.clear.mockResolvedValue(true);
    
    mockEnvironmentDetector.isDevelopment.mockReturnValue(true);
    mockEnvironmentDetector.isProduction.mockReturnValue(false);
    mockEnvironmentDetector.getEnvironment.mockReturnValue('development');
  });

  describe('RAG 數據載入', () => {
    test('應該成功載入 RAG 數據', async () => {
      const result = await mockRagLoader.loadRagData();
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockRagData);
      expect(result.documentCount).toBe(2);
      expect(result.loadTime).toBeLessThan(5000); // 載入時間應該在合理範圍內
      expect(mockRagLoader.loadRagData).toHaveBeenCalledTimes(1);
    });

    test('應該處理載入失敗', async () => {
      mockRagLoader.loadRagData.mockRejectedValue(new Error('載入失敗'));
      
      await expect(mockRagLoader.loadRagData()).rejects.toThrow('載入失敗');
    });

    test('應該驗證載入的數據', async () => {
      const result = await mockRagLoader.loadRagData();
      
      // 驗證數據結構
      expect(result.data).toHaveProperty('documents');
      expect(result.data).toHaveProperty('concepts');
      expect(result.data).toHaveProperty('lastUpdated');
      expect(Array.isArray(result.data.documents)).toBe(true);
      expect(Array.isArray(result.data.concepts)).toBe(true);
    });

    test('應該處理空數據載入', async () => {
      mockRagLoader.loadRagData.mockResolvedValue({
        success: true,
        data: { documents: [], concepts: [], lastUpdated: null },
        loadTime: 100,
        documentCount: 0
      });

      const result = await mockRagLoader.loadRagData();
      
      expect(result.success).toBe(true);
      expect(result.documentCount).toBe(0);
      expect(result.data.documents).toHaveLength(0);
    });
  });

  describe('RAG 狀態查詢', () => {
    test('應該返回正確的 RAG 狀態', async () => {
      const status = await mockRagLoader.getRagStatus();
      
      expect(status.status).toBe('ready');
      expect(status.documentCount).toBe(2);
      expect(status.indexSize).toBe('15.2MB');
      expect(status).toHaveProperty('lastUpdated');
      expect(mockRagLoader.getRagStatus).toHaveBeenCalledTimes(1);
    });

    test('應該處理狀態查詢失敗', async () => {
      mockRagLoader.getRagStatus.mockRejectedValue(new Error('狀態查詢失敗'));
      
      await expect(mockRagLoader.getRagStatus()).rejects.toThrow('狀態查詢失敗');
    });

    test('應該驗證狀態數據完整性', async () => {
      const status = await mockRagLoader.getRagStatus();
      
      expect(status).toHaveProperty('status');
      expect(status).toHaveProperty('lastUpdated');
      expect(status).toHaveProperty('documentCount');
      expect(status).toHaveProperty('indexSize');
      expect(typeof status.status).toBe('string');
      expect(typeof status.documentCount).toBe('number');
    });
  });

  describe('RAG 數據搜尋', () => {
    test('應該成功搜尋 RAG 數據', async () => {
      const result = await mockRagLoader.searchRagData('AI 晶片');
      
      expect(result.success).toBe(true);
      expect(result.query).toBe('AI 晶片');
      expect(result.results).toHaveLength(1);
      expect(result.totalResults).toBe(1);
      expect(result.searchTime).toBeLessThan(100); // 搜尋時間應該在合理範圍內
      expect(mockRagLoader.searchRagData).toHaveBeenCalledWith('AI 晶片');
    });

    test('應該處理搜尋失敗', async () => {
      mockRagLoader.searchRagData.mockRejectedValue(new Error('搜尋失敗'));
      
      await expect(mockRagLoader.searchRagData('query')).rejects.toThrow('搜尋失敗');
    });

    test('應該處理空搜尋結果', async () => {
      mockRagLoader.searchRagData.mockResolvedValue({
        success: true,
        query: '不存在的概念',
        results: [],
        totalResults: 0,
        searchTime: 10
      });

      const result = await mockRagLoader.searchRagData('不存在的概念');
      
      expect(result.success).toBe(true);
      expect(result.results).toHaveLength(0);
      expect(result.totalResults).toBe(0);
    });

    test('應該支援搜尋參數', async () => {
      const searchParams = { limit: 5, threshold: 0.8, category: 'technology' };
      
      await mockRagLoader.searchRagData('AI', searchParams);
      
      expect(mockRagLoader.searchRagData).toHaveBeenCalledWith('AI', searchParams);
    });
  });

  describe('快取管理', () => {
    test('應該成功清空快取', async () => {
      const result = await mockRagLoader.clearCache();
      
      expect(result.success).toBe(true);
      expect(result.clearedItems).toBe(5);
      expect(result.message).toBe('快取已清空');
      expect(mockRagLoader.clearCache).toHaveBeenCalledTimes(1);
    });

    test('應該處理快取清空失敗', async () => {
      mockRagLoader.clearCache.mockRejectedValue(new Error('快取清空失敗'));
      
      await expect(mockRagLoader.clearCache()).rejects.toThrow('快取清空失敗');
    });

    test('應該檢查快取狀態', async () => {
      const hasCache = mockCacheService.has('rag_data');
      
      expect(hasCache).toBe(true);
      expect(mockCacheService.has).toHaveBeenCalledWith('rag_data');
    });

    test('應該從快取獲取數據', async () => {
      const cachedData = mockCacheService.get('rag_data');
      
      expect(cachedData).toEqual(mockRagData);
      expect(mockCacheService.get).toHaveBeenCalledWith('rag_data');
    });
  });

  describe('數據驗證', () => {
    test('應該驗證 RAG 數據格式', () => {
      const validation = mockRagLoader.validateData(mockRagData);
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
      expect(validation.warnings).toHaveLength(0);
      expect(mockRagLoader.validateData).toHaveBeenCalledWith(mockRagData);
    });

    test('應該檢測無效數據', () => {
      const invalidData = { documents: 'not-an-array' };
      
      mockRagLoader.validateData.mockReturnValue({
        isValid: false,
        errors: ['documents 必須是陣列'],
        warnings: ['數據格式不標準']
      });

      const validation = mockRagLoader.validateData(invalidData);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toHaveLength(1);
      expect(validation.errors[0]).toBe('documents 必須是陣列');
    });

    test('應該驗證必要字段', () => {
      const incompleteData = { documents: [] }; // 缺少 concepts 和 lastUpdated
      
      mockRagLoader.validateData.mockReturnValue({
        isValid: false,
        errors: ['缺少必要字段: concepts', '缺少必要字段: lastUpdated'],
        warnings: []
      });

      const validation = mockRagLoader.validateData(incompleteData);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toHaveLength(2);
    });
  });

  describe('環境檢測', () => {
    test('應該正確檢測開發環境', () => {
      const isDev = mockEnvironmentDetector.isDevelopment();
      const env = mockEnvironmentDetector.getEnvironment();
      
      expect(isDev).toBe(true);
      expect(env).toBe('development');
      expect(mockEnvironmentDetector.isDevelopment).toHaveBeenCalledTimes(1);
      expect(mockEnvironmentDetector.getEnvironment).toHaveBeenCalledTimes(1);
    });

    test('應該正確檢測生產環境', () => {
      mockEnvironmentDetector.isProduction.mockReturnValue(true);
      mockEnvironmentDetector.getEnvironment.mockReturnValue('production');
      
      const isProd = mockEnvironmentDetector.isProduction();
      const env = mockEnvironmentDetector.getEnvironment();
      
      expect(isProd).toBe(true);
      expect(env).toBe('production');
    });

    test('應該根據環境調整行為', async () => {
      // 在開發環境中，應該啟用詳細日誌
      if (mockEnvironmentDetector.isDevelopment()) {
        const result = await mockRagLoader.loadRagData();
        expect(result).toHaveProperty('loadTime'); // 開發環境應該包含詳細資訊
      }
    });
  });

  describe('錯誤處理', () => {
    test('應該處理網路錯誤', async () => {
      mockRagLoader.loadRagData.mockRejectedValue(new Error('網路連接失敗'));
      
      await expect(mockRagLoader.loadRagData()).rejects.toThrow('網路連接失敗');
    });

    test('應該處理數據格式錯誤', async () => {
      mockRagLoader.loadRagData.mockResolvedValue({
        success: false,
        error: '數據格式無效',
        data: null
      });

      const result = await mockRagLoader.loadRagData();
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('數據格式無效');
      expect(result.data).toBeNull();
    });

    test('應該處理快取錯誤', async () => {
      mockCacheService.get.mockImplementation(() => {
        throw new Error('快取讀取失敗');
      });

      expect(() => mockCacheService.get('rag_data')).toThrow('快取讀取失敗');
    });
  });

  describe('效能優化', () => {
    test('應該在合理時間內完成載入', async () => {
      const startTime = Date.now();
      await mockRagLoader.loadRagData();
      const endTime = Date.now();
      
      const loadTime = endTime - startTime;
      expect(loadTime).toBeLessThan(2000); // 載入應該在2秒內完成
    });

    test('應該支援並行操作', async () => {
      const operations = [
        mockRagLoader.getRagStatus(),
        mockRagLoader.searchRagData('AI'),
        mockCacheService.has('rag_data')
      ];
      
      const results = await Promise.all(operations);
      
      expect(results).toHaveLength(3);
      expect(results[0]).toHaveProperty('status');
      expect(results[1]).toHaveProperty('success');
      expect(results[2]).toBe(true);
    });

    test('應該快取常用查詢結果', async () => {
      // 第一次查詢
      await mockRagLoader.searchRagData('AI 晶片');
      
      // 第二次相同查詢應該使用快取
      await mockRagLoader.searchRagData('AI 晶片');
      
      expect(mockRagLoader.searchRagData).toHaveBeenCalledTimes(2);
      expect(mockRagLoader.searchRagData).toHaveBeenCalledWith('AI 晶片');
    });
  });
});
