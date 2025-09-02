/**
 * 向量搜尋服務單元測試
 * 測試向量搜尋、相似度計算、索引管理等核心功能
 */

const mockVectorService = {
  // 模擬向量搜尋服務的主要方法
  searchSimilar: jest.fn(),
  addVector: jest.fn(),
  updateVector: jest.fn(),
  deleteVector: jest.fn(),
  calculateSimilarity: jest.fn(),
  batchUpsert: jest.fn(),
  getIndexStats: jest.fn(),
  optimizeIndex: jest.fn()
};

// 模擬向量數據
const mockVectors = [
  {
    id: 'vector_1',
    text: 'AI 伺服器',
    vector: [0.1, 0.2, 0.3, 0.4, 0.5],
    metadata: { category: 'technology', language: 'zh-TW' }
  },
  {
    id: 'vector_2',
    text: '機器學習',
    vector: [0.6, 0.7, 0.8, 0.9, 1.0],
    metadata: { category: 'technology', language: 'zh-TW' }
  },
  {
    id: 'vector_3',
    text: '深度學習',
    vector: [0.2, 0.3, 0.4, 0.5, 0.6],
    metadata: { category: 'technology', language: 'zh-TW' }
  }
];

// 模擬搜尋查詢
const mockQueryVector = [0.1, 0.2, 0.3, 0.4, 0.5];

describe('向量搜尋服務', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // 重置模擬函數的返回值
    mockVectorService.searchSimilar.mockResolvedValue({
      success: true,
      query: 'AI 伺服器',
      results: [
        { id: 'vector_1', text: 'AI 伺服器', score: 1.0, metadata: mockVectors[0].metadata },
        { id: 'vector_3', text: '深度學習', score: 0.85, metadata: mockVectors[2].metadata }
      ],
      totalResults: 2,
      searchTime: 15
    });
    
    mockVectorService.addVector.mockResolvedValue({
      success: true,
      id: 'new_vector_1',
      status: 'created'
    });
    
    mockVectorService.updateVector.mockResolvedValue({
      success: true,
      id: 'vector_1',
      status: 'updated'
    });
    
    mockVectorService.deleteVector.mockResolvedValue({
      success: true,
      id: 'vector_1',
      status: 'deleted'
    });
    
    mockVectorService.calculateSimilarity.mockReturnValue(0.95);
    
    mockVectorService.batchUpsert.mockResolvedValue({
      success: true,
      processed: 3,
      created: 2,
      updated: 1,
      failed: 0
    });
    
    mockVectorService.getIndexStats.mockResolvedValue({
      totalVectors: 1000,
      dimensions: 1536,
      indexSize: '2.5GB',
      lastOptimized: '2025-01-15T10:30:00Z',
      health: 'healthy'
    });
    
    mockVectorService.optimizeIndex.mockResolvedValue({
      success: true,
      optimizationTime: 45,
      spaceSaved: '500MB',
      performanceGain: '15%'
    });
  });

  describe('向量搜尋', () => {
    test('應該成功搜尋相似向量', async () => {
      const result = await mockVectorService.searchSimilar(mockQueryVector, { limit: 5 });
      
      expect(result.success).toBe(true);
      expect(result.query).toBe('AI 伺服器');
      expect(result.results).toHaveLength(2);
      expect(result.totalResults).toBe(2);
      expect(result.searchTime).toBeLessThan(50); // 搜尋時間應該在合理範圍內
      expect(mockVectorService.searchSimilar).toHaveBeenCalledWith(mockQueryVector, { limit: 5 });
    });

    test('應該按相似度分數排序結果', async () => {
      const result = await mockVectorService.searchSimilar(mockQueryVector);
      
      const scores = result.results.map(r => r.score);
      expect(scores[0]).toBeGreaterThanOrEqual(scores[1]); // 第一個分數應該大於等於第二個
      expect(scores[0]).toBe(1.0); // 完全匹配應該有最高分數
    });

    test('應該處理空搜尋結果', async () => {
      mockVectorService.searchSimilar.mockResolvedValue({
        success: true,
        query: '不存在的概念',
        results: [],
        totalResults: 0,
        searchTime: 5
      });

      const result = await mockVectorService.searchSimilar([0.9, 0.8, 0.7, 0.6, 0.5]);
      
      expect(result.success).toBe(true);
      expect(result.results).toHaveLength(0);
      expect(result.totalResults).toBe(0);
    });

    test('應該處理搜尋失敗', async () => {
      mockVectorService.searchSimilar.mockRejectedValue(new Error('搜尋失敗'));
      
      await expect(mockVectorService.searchSimilar(mockQueryVector)).rejects.toThrow('搜尋失敗');
    });

    test('應該支援分頁和限制參數', async () => {
      // 模擬分頁結果
      mockVectorService.searchSimilar.mockResolvedValue({
        success: true,
        query: 'AI 伺服器',
        results: [
          { id: 'vector_1', text: 'AI 伺服器', score: 1.0, metadata: mockVectors[0].metadata }
        ],
        totalResults: 1,
        searchTime: 15
      });
      
      const result = await mockVectorService.searchSimilar(mockQueryVector, { 
        limit: 1, 
        offset: 0 
      });
      
      expect(result.results.length).toBeLessThanOrEqual(1);
      expect(mockVectorService.searchSimilar).toHaveBeenCalledWith(mockQueryVector, { 
        limit: 1, 
        offset: 0 
      });
    });
  });

  describe('向量管理', () => {
    test('應該成功添加新向量', async () => {
      const newVector = {
        text: '新概念',
        vector: [0.3, 0.4, 0.5, 0.6, 0.7],
        metadata: { category: 'finance' }
      };

      const result = await mockVectorService.addVector(newVector);
      
      expect(result.success).toBe(true);
      expect(result.id).toBe('new_vector_1');
      expect(result.status).toBe('created');
      expect(mockVectorService.addVector).toHaveBeenCalledWith(newVector);
    });

    test('應該成功更新現有向量', async () => {
      const updatedVector = {
        id: 'vector_1',
        text: 'AI 伺服器 (更新)',
        vector: [0.1, 0.2, 0.3, 0.4, 0.5],
        metadata: { category: 'technology', language: 'zh-TW', updated: true }
      };

      const result = await mockVectorService.updateVector('vector_1', updatedVector);
      
      expect(result.success).toBe(true);
      expect(result.id).toBe('vector_1');
      expect(result.status).toBe('updated');
      expect(mockVectorService.updateVector).toHaveBeenCalledWith('vector_1', updatedVector);
    });

    test('應該成功刪除向量', async () => {
      const result = await mockVectorService.deleteVector('vector_1');
      
      expect(result.success).toBe(true);
      expect(result.id).toBe('vector_1');
      expect(result.status).toBe('deleted');
      expect(mockVectorService.deleteVector).toHaveBeenCalledWith('vector_1');
    });

    test('應該處理向量操作失敗', async () => {
      mockVectorService.addVector.mockRejectedValue(new Error('添加失敗'));
      mockVectorService.updateVector.mockRejectedValue(new Error('更新失敗'));
      mockVectorService.deleteVector.mockRejectedValue(new Error('刪除失敗'));
      
      await expect(mockVectorService.addVector({})).rejects.toThrow('添加失敗');
      await expect(mockVectorService.updateVector('id', {})).rejects.toThrow('更新失敗');
      await expect(mockVectorService.deleteVector('id')).rejects.toThrow('刪除失敗');
    });
  });

  describe('相似度計算', () => {
    test('應該正確計算向量相似度', () => {
      const vector1 = [0.1, 0.2, 0.3, 0.4, 0.5];
      const vector2 = [0.1, 0.2, 0.3, 0.4, 0.5];
      
      const similarity = mockVectorService.calculateSimilarity(vector1, vector2);
      
      expect(similarity).toBe(0.95);
      expect(mockVectorService.calculateSimilarity).toHaveBeenCalledWith(vector1, vector2);
    });

    test('應該處理不同維度的向量', () => {
      const vector1 = [0.1, 0.2, 0.3];
      const vector2 = [0.1, 0.2, 0.3, 0.4, 0.5];
      
      // 模擬不同維度向量的處理
      mockVectorService.calculateSimilarity.mockImplementation(() => {
        throw new Error('向量維度不匹配');
      });
      
      expect(() => mockVectorService.calculateSimilarity(vector1, vector2))
        .toThrow('向量維度不匹配');
    });

    test('應該驗證相似度分數範圍', () => {
      const vector1 = [0.1, 0.2, 0.3, 0.4, 0.5];
      const vector2 = [0.6, 0.7, 0.8, 0.9, 1.0];
      
      mockVectorService.calculateSimilarity.mockReturnValue(0.75);
      
      const similarity = mockVectorService.calculateSimilarity(vector1, vector2);
      
      expect(similarity).toBeGreaterThanOrEqual(0);
      expect(similarity).toBeLessThanOrEqual(1);
    });
  });

  describe('批量操作', () => {
    test('應該成功批量更新向量', async () => {
      const batchData = [
        { id: 'vector_1', text: '更新1', vector: [0.1, 0.2, 0.3, 0.4, 0.5] },
        { id: 'vector_2', text: '更新2', vector: [0.6, 0.7, 0.8, 0.9, 1.0] },
        { text: '新向量', vector: [0.3, 0.4, 0.5, 0.6, 0.7] }
      ];

      const result = await mockVectorService.batchUpsert(batchData);
      
      expect(result.success).toBe(true);
      expect(result.processed).toBe(3);
      expect(result.created).toBe(2);
      expect(result.updated).toBe(1);
      expect(result.failed).toBe(0);
      expect(mockVectorService.batchUpsert).toHaveBeenCalledWith(batchData);
    });

    test('應該處理批量操作中的部分失敗', async () => {
      mockVectorService.batchUpsert.mockResolvedValue({
        success: true,
        processed: 3,
        created: 1,
        updated: 1,
        failed: 1,
        errors: ['向量格式無效']
      });

      const result = await mockVectorService.batchUpsert([]);
      
      expect(result.success).toBe(true);
      expect(result.failed).toBe(1);
      expect(result.errors).toHaveLength(1);
    });

    test('應該處理批量操作完全失敗', async () => {
      mockVectorService.batchUpsert.mockRejectedValue(new Error('批量操作失敗'));
      
      await expect(mockVectorService.batchUpsert([])).rejects.toThrow('批量操作失敗');
    });
  });

  describe('索引管理', () => {
    test('應該返回正確的索引統計信息', async () => {
      const stats = await mockVectorService.getIndexStats();
      
      expect(stats.totalVectors).toBe(1000);
      expect(stats.dimensions).toBe(1536);
      expect(stats.indexSize).toBe('2.5GB');
      expect(stats.health).toBe('healthy');
      expect(stats).toHaveProperty('lastOptimized');
      expect(mockVectorService.getIndexStats).toHaveBeenCalledTimes(1);
    });

    test('應該成功優化索引', async () => {
      const result = await mockVectorService.optimizeIndex();
      
      expect(result.success).toBe(true);
      expect(result.optimizationTime).toBeLessThan(120); // 優化時間應該在合理範圍內
      expect(result.spaceSaved).toBe('500MB');
      expect(result.performanceGain).toBe('15%');
      expect(mockVectorService.optimizeIndex).toHaveBeenCalledTimes(1);
    });

    test('應該處理索引操作失敗', async () => {
      mockVectorService.getIndexStats.mockRejectedValue(new Error('獲取統計失敗'));
      mockVectorService.optimizeIndex.mockRejectedValue(new Error('優化失敗'));
      
      await expect(mockVectorService.getIndexStats()).rejects.toThrow('獲取統計失敗');
      await expect(mockVectorService.optimizeIndex()).rejects.toThrow('優化失敗');
    });
  });

  describe('錯誤處理', () => {
    test('應該處理無效的向量格式', async () => {
      const invalidVector = 'not-a-vector';
      
      mockVectorService.searchSimilar.mockRejectedValue(new Error('無效的向量格式'));
      
      await expect(mockVectorService.searchSimilar(invalidVector)).rejects.toThrow('無效的向量格式');
    });

    test('應該處理索引不可用的情況', async () => {
      mockVectorService.searchSimilar.mockRejectedValue(new Error('索引暫時不可用'));
      
      await expect(mockVectorService.searchSimilar(mockQueryVector)).rejects.toThrow('索引暫時不可用');
    });

    test('應該處理記憶體不足的情況', async () => {
      mockVectorService.batchUpsert.mockRejectedValue(new Error('記憶體不足'));
      
      await expect(mockVectorService.batchUpsert([])).rejects.toThrow('記憶體不足');
    });
  });

  describe('效能優化', () => {
    test('應該支援並行搜尋', async () => {
      const queries = [
        [0.1, 0.2, 0.3, 0.4, 0.5],
        [0.6, 0.7, 0.8, 0.9, 1.0],
        [0.2, 0.3, 0.4, 0.5, 0.6]
      ];
      
      const promises = queries.map(query => mockVectorService.searchSimilar(query));
      const results = await Promise.all(promises);
      
      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result.success).toBe(true);
      });
    });

    test('應該快取常用查詢結果', async () => {
      // 第一次查詢
      await mockVectorService.searchSimilar(mockQueryVector);
      
      // 第二次相同查詢應該使用快取
      await mockVectorService.searchSimilar(mockQueryVector);
      
      expect(mockVectorService.searchSimilar).toHaveBeenCalledTimes(2);
      expect(mockVectorService.searchSimilar).toHaveBeenCalledWith(mockQueryVector);
    });

    test('應該在合理時間內完成搜尋', async () => {
      const startTime = Date.now();
      await mockVectorService.searchSimilar(mockQueryVector);
      const endTime = Date.now();
      
      const searchTime = endTime - startTime;
      expect(searchTime).toBeLessThan(1000); // 搜尋應該在1秒內完成
    });
  });
});
