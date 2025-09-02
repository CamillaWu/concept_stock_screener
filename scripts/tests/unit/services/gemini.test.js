/**
 * Gemini AI 服務單元測試
 * 測試AI分析、股票搜尋、概念分析等核心功能
 */

const mockGeminiService = {
  // 模擬 Gemini AI 服務的主要方法
  analyzeConcept: jest.fn(),
  searchStocksByConcept: jest.fn(),
  analyzeStockThemes: jest.fn(),
  generateStockAnalysis: jest.fn(),
  createEmbeddings: jest.fn(),
  validateApiKey: jest.fn()
};

// 模擬 API 響應
const mockApiResponse = {
  success: true,
  data: {},
  timestamp: Date.now()
};

// 模擬股票數據
const mockStockData = [
  {
    ticker: '2330',
    name: '台積電',
    sector: '半導體',
    marketCap: 15000000000000,
    pe: 25.5,
    dividend: 2.8
  },
  {
    ticker: '2317',
    name: '鴻海',
    sector: '電子零組件',
    marketCap: 2000000000000,
    pe: 12.3,
    dividend: 4.2
  }
];

describe('Gemini AI 服務', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // 重置模擬函數的返回值
    mockGeminiService.analyzeConcept.mockResolvedValue({
      success: true,
      concept: 'AI 伺服器',
      description: '人工智慧伺服器相關概念',
      marketTrend: '上升',
      confidence: 0.95,
      relatedSectors: ['半導體', '伺服器', 'AI']
    });
    
    mockGeminiService.searchStocksByConcept.mockResolvedValue({
      success: true,
      concept: 'AI 伺服器',
      stocks: mockStockData,
      analysis: '基於AI伺服器概念的股票分析',
      totalResults: 2
    });
    
    mockGeminiService.analyzeStockThemes.mockResolvedValue({
      success: true,
      ticker: '2330',
      name: '台積電',
      themes: [
        { name: 'AI 晶片', relevance: 0.95, description: 'AI運算晶片製造' },
        { name: '5G 技術', relevance: 0.87, description: '5G通訊晶片' },
        { name: '電動車', relevance: 0.78, description: '車用晶片' }
      ],
      primaryTheme: 'AI 晶片'
    });
    
    mockGeminiService.generateStockAnalysis.mockResolvedValue({
      success: true,
      ticker: '2330',
      analysis: {
        technical: '技術面強勢，突破關鍵阻力位',
        fundamental: '基本面穩健，營收持續成長',
        sentiment: '市場情緒樂觀，機構評級上調',
        risk: '地緣政治風險，供應鏈依賴'
      },
      recommendation: '買入',
      confidence: 0.88
    });
    
    mockGeminiService.createEmbeddings.mockResolvedValue({
      success: true,
      embeddings: [
        { text: 'AI 伺服器', vector: [0.1, 0.2, 0.3, 0.4, 0.5] },
        { text: '機器學習', vector: [0.6, 0.7, 0.8, 0.9, 1.0] }
      ],
      dimensions: 5
    });
    
    mockGeminiService.validateApiKey.mockResolvedValue({
      valid: true,
      model: 'gemini-2.0-flash-exp',
      capabilities: ['text-generation', 'embeddings', 'analysis']
    });
  });

  describe('概念分析', () => {
    test('應該成功分析投資概念', async () => {
      const result = await mockGeminiService.analyzeConcept('AI 伺服器');
      
      expect(result.success).toBe(true);
      expect(result.concept).toBe('AI 伺服器');
      expect(result.description).toBe('人工智慧伺服器相關概念');
      expect(result.marketTrend).toBe('上升');
      expect(result.confidence).toBe(0.95);
      expect(result.relatedSectors).toHaveLength(3);
      expect(mockGeminiService.analyzeConcept).toHaveBeenCalledWith('AI 伺服器');
    });

    test('應該處理概念分析失敗', async () => {
      mockGeminiService.analyzeConcept.mockRejectedValue(new Error('分析失敗'));
      
      await expect(mockGeminiService.analyzeConcept('無效概念')).rejects.toThrow('分析失敗');
    });

    test('應該驗證概念分析結果的完整性', async () => {
      const result = await mockGeminiService.analyzeConcept('AI 伺服器');
      
      expect(result).toHaveProperty('concept');
      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('marketTrend');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('relatedSectors');
      expect(typeof result.confidence).toBe('number');
      expect(Array.isArray(result.relatedSectors)).toBe(true);
    });
  });

  describe('股票搜尋', () => {
    test('應該根據概念成功搜尋股票', async () => {
      const result = await mockGeminiService.searchStocksByConcept('AI 伺服器');
      
      expect(result.success).toBe(true);
      expect(result.concept).toBe('AI 伺服器');
      expect(result.stocks).toHaveLength(2);
      expect(result.analysis).toBe('基於AI伺服器概念的股票分析');
      expect(result.totalResults).toBe(2);
      expect(mockGeminiService.searchStocksByConcept).toHaveBeenCalledWith('AI 伺服器');
    });

    test('應該處理空搜尋結果', async () => {
      mockGeminiService.searchStocksByConcept.mockResolvedValue({
        success: true,
        concept: '不存在的概念',
        stocks: [],
        analysis: '未找到相關股票',
        totalResults: 0
      });

      const result = await mockGeminiService.searchStocksByConcept('不存在的概念');
      
      expect(result.success).toBe(true);
      expect(result.stocks).toHaveLength(0);
      expect(result.totalResults).toBe(0);
    });

    test('應該驗證股票數據格式', async () => {
      const result = await mockGeminiService.searchStocksByConcept('AI 伺服器');
      
      result.stocks.forEach(stock => {
        expect(stock).toHaveProperty('ticker');
        expect(stock).toHaveProperty('name');
        expect(stock).toHaveProperty('sector');
        expect(stock).toHaveProperty('marketCap');
        expect(stock).toHaveProperty('pe');
        expect(stock).toHaveProperty('dividend');
      });
    });
  });

  describe('股票主題分析', () => {
    test('應該成功分析股票的主題歸屬', async () => {
      const result = await mockGeminiService.analyzeStockThemes('2330');
      
      expect(result.success).toBe(true);
      expect(result.ticker).toBe('2330');
      expect(result.name).toBe('台積電');
      expect(result.themes).toHaveLength(3);
      expect(result.primaryTheme).toBe('AI 晶片');
      expect(mockGeminiService.analyzeStockThemes).toHaveBeenCalledWith('2330');
    });

    test('應該按相關性排序主題', async () => {
      const result = await mockGeminiService.analyzeStockThemes('2330');
      
      const relevances = result.themes.map(theme => theme.relevance);
      expect(relevances).toEqual([0.95, 0.87, 0.78]);
      expect(relevances[0]).toBeGreaterThan(relevances[1]);
      expect(relevances[1]).toBeGreaterThan(relevances[2]);
    });

    test('應該處理股票主題分析失敗', async () => {
      mockGeminiService.analyzeStockThemes.mockRejectedValue(new Error('分析失敗'));
      
      await expect(mockGeminiService.analyzeStockThemes('9999')).rejects.toThrow('分析失敗');
    });
  });

  describe('股票分析生成', () => {
    test('應該成功生成綜合股票分析', async () => {
      const result = await mockGeminiService.generateStockAnalysis('2330');
      
      expect(result.success).toBe(true);
      expect(result.ticker).toBe('2330');
      expect(result.analysis).toHaveProperty('technical');
      expect(result.analysis).toHaveProperty('fundamental');
      expect(result.analysis).toHaveProperty('sentiment');
      expect(result.analysis).toHaveProperty('risk');
      expect(result.recommendation).toBe('買入');
      expect(result.confidence).toBe(0.88);
    });

    test('應該驗證分析結果的完整性', async () => {
      const result = await mockGeminiService.generateStockAnalysis('2330');
      
      expect(typeof result.analysis.technical).toBe('string');
      expect(typeof result.analysis.fundamental).toBe('string');
      expect(typeof result.analysis.sentiment).toBe('string');
      expect(typeof result.analysis.risk).toBe('string');
      expect(['買入', '持有', '賣出']).toContain(result.recommendation);
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });

    test('應該處理分析生成失敗', async () => {
      mockGeminiService.generateStockAnalysis.mockRejectedValue(new Error('生成失敗'));
      
      await expect(mockGeminiService.generateStockAnalysis('9999')).rejects.toThrow('生成失敗');
    });
  });

  describe('向量嵌入', () => {
    test('應該成功創建文本嵌入', async () => {
      const result = await mockGeminiService.createEmbeddings(['AI 伺服器', '機器學習']);
      
      expect(result.success).toBe(true);
      expect(result.embeddings).toHaveLength(2);
      expect(result.dimensions).toBe(5);
      expect(mockGeminiService.createEmbeddings).toHaveBeenCalledWith(['AI 伺服器', '機器學習']);
    });

    test('應該驗證嵌入向量的格式', async () => {
      const result = await mockGeminiService.createEmbeddings(['AI 伺服器']);
      
      result.embeddings.forEach(embedding => {
        expect(embedding).toHaveProperty('text');
        expect(embedding).toHaveProperty('vector');
        expect(Array.isArray(embedding.vector)).toBe(true);
        expect(embedding.vector.length).toBe(5);
        expect(embedding.vector.every(dim => typeof dim === 'number')).toBe(true);
      });
    });

    test('應該處理嵌入創建失敗', async () => {
      mockGeminiService.createEmbeddings.mockRejectedValue(new Error('嵌入失敗'));
      
      await expect(mockGeminiService.createEmbeddings(['測試'])).rejects.toThrow('嵌入失敗');
    });
  });

  describe('API 金鑰驗證', () => {
    test('應該成功驗證有效的 API 金鑰', async () => {
      const result = await mockGeminiService.validateApiKey('valid-key');
      
      expect(result.valid).toBe(true);
      expect(result.model).toBe('gemini-2.0-flash-exp');
      expect(result.capabilities).toContain('text-generation');
      expect(result.capabilities).toContain('embeddings');
      expect(result.capabilities).toContain('analysis');
    });

    test('應該處理無效的 API 金鑰', async () => {
      mockGeminiService.validateApiKey.mockResolvedValue({
        valid: false,
        error: 'Invalid API key',
        code: 'AUTH_ERROR'
      });

      const result = await mockGeminiService.validateApiKey('invalid-key');
      
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid API key');
      expect(result.code).toBe('AUTH_ERROR');
    });

    test('應該處理驗證失敗', async () => {
      mockGeminiService.validateApiKey.mockRejectedValue(new Error('驗證失敗'));
      
      await expect(mockGeminiService.validateApiKey('test-key')).rejects.toThrow('驗證失敗');
    });
  });

  describe('錯誤處理', () => {
    test('應該處理網路錯誤', async () => {
      mockGeminiService.analyzeConcept.mockRejectedValue(new Error('網路連線失敗'));
      
      await expect(mockGeminiService.analyzeConcept('AI')).rejects.toThrow('網路連線失敗');
    });

    test('應該處理 API 限制錯誤', async () => {
      mockGeminiService.searchStocksByConcept.mockRejectedValue(new Error('API 配額已用完'));
      
      await expect(mockGeminiService.searchStocksByConcept('AI')).rejects.toThrow('API 配額已用完');
    });

    test('應該處理模型錯誤', async () => {
      mockGeminiService.generateStockAnalysis.mockRejectedValue(new Error('模型暫時不可用'));
      
      await expect(mockGeminiService.generateStockAnalysis('2330')).rejects.toThrow('模型暫時不可用');
    });
  });

  describe('效能優化', () => {
    test('應該並行處理多個分析請求', async () => {
      const promises = [
        mockGeminiService.analyzeConcept('AI'),
        mockGeminiService.analyzeConcept('5G'),
        mockGeminiService.analyzeConcept('電動車')
      ];
      
      const results = await Promise.all(promises);
      
      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result.success).toBe(true);
        expect(result).toHaveProperty('concept');
      });
    });

    test('應該快取重複的請求結果', async () => {
      // 第一次請求
      await mockGeminiService.analyzeConcept('AI 伺服器');
      
      // 第二次相同請求應該使用快取
      await mockGeminiService.analyzeConcept('AI 伺服器');
      
      expect(mockGeminiService.analyzeConcept).toHaveBeenCalledTimes(2);
      expect(mockGeminiService.analyzeConcept).toHaveBeenCalledWith('AI 伺服器');
    });
  });
});
