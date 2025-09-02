/**
 * 股票類型定義單元測試
 * 測試股票相關類型定義、驗證和轉換功能
 */

// 模擬類型定義
const StockTypes = {
  Stock: {
    id: 'string',
    ticker: 'string',
    name: 'string',
    price: 'number',
    change: 'number',
    changePercent: 'number',
    volume: 'number',
    marketCap: 'number',
    sector: 'string',
    industry: 'string',
    isFavorite: 'boolean',
    hasAnomaly: 'boolean',
    sentiment: 'string'
  },
  
  ConceptStock: {
    id: 'string',
    ticker: 'string',
    name: 'string',
    concept: 'string',
    relevanceScore: 'number',
    marketCap: 'number',
    sector: 'string',
    lastUpdated: 'string'
  },
  
  StockDetail: {
    id: 'string',
    ticker: 'string',
    name: 'string',
    price: 'number',
    change: 'number',
    changePercent: 'number',
    volume: 'number',
    marketCap: 'number',
    pe: 'number',
    dividend: 'number',
    sector: 'string',
    industry: 'string',
    description: 'string',
    financials: 'object',
    news: 'array',
    analysis: 'object'
  },
  
  Concept: {
    id: 'string',
    name: 'string',
    description: 'string',
    category: 'string',
    stocks: 'array',
    marketTrend: 'string',
    lastUpdated: 'string'
  },
  
  SearchResult: {
    query: 'string',
    results: 'array',
    totalResults: 'number',
    searchTime: 'number',
    filters: 'object'
  }
};

// 模擬類型驗證器
const TypeValidator = {
  // 驗證 Stock 類型
  validateStock: (data) => {
    const errors = [];
    
    if (!data.id || typeof data.id !== 'string') {
      errors.push('id 必須是非空字串');
    }
    
    if (!data.ticker || typeof data.ticker !== 'string') {
      errors.push('ticker 必須是非空字串');
    }
    
    if (!data.name || typeof data.name !== 'string') {
      errors.push('name 必須是非空字串');
    }
    
    if (typeof data.price !== 'number' || data.price < 0) {
      errors.push('price 必須是非負數');
    }
    
    if (typeof data.change !== 'number') {
      errors.push('change 必須是數字');
    }
    
    if (typeof data.changePercent !== 'number') {
      errors.push('changePercent 必須是數字');
    }
    
    if (typeof data.volume !== 'number' || data.volume < 0) {
      errors.push('volume 必須是非負數');
    }
    
    if (typeof data.marketCap !== 'number' || data.marketCap < 0) {
      errors.push('marketCap 必須是非負數');
    }
    
    if (!data.sector || typeof data.sector !== 'string') {
      errors.push('sector 必須是非空字串');
    }
    
    if (!data.industry || typeof data.industry !== 'string') {
      errors.push('industry 必須是非空字串');
    }
    
    if (typeof data.isFavorite !== 'boolean') {
      errors.push('isFavorite 必須是布林值');
    }
    
    if (typeof data.hasAnomaly !== 'boolean') {
      errors.push('hasAnomaly 必須是布林值');
    }
    
    if (!data.sentiment || typeof data.sentiment !== 'string') {
      errors.push('sentiment 必須是非空字串');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },
  
  // 驗證 ConceptStock 類型
  validateConceptStock: (data) => {
    const errors = [];
    
    if (!data.id || typeof data.id !== 'string') {
      errors.push('id 必須是非空字串');
    }
    
    if (!data.ticker || typeof data.ticker !== 'string') {
      errors.push('ticker 必須是非空字串');
    }
    
    if (!data.name || typeof data.name !== 'string') {
      errors.push('name 必須是非空字串');
    }
    
    if (!data.concept || typeof data.concept !== 'string') {
      errors.push('concept 必須是非空字串');
    }
    
    if (typeof data.relevanceScore !== 'number' || data.relevanceScore < 0 || data.relevanceScore > 1) {
      errors.push('relevanceScore 必須是0到1之間的數字');
    }
    
    if (typeof data.marketCap !== 'number' || data.marketCap < 0) {
      errors.push('marketCap 必須是非負數');
    }
    
    if (!data.sector || typeof data.sector !== 'string') {
      errors.push('sector 必須是非空字串');
    }
    
    if (!data.lastUpdated || typeof data.lastUpdated !== 'string') {
      errors.push('lastUpdated 必須是非空字串');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },
  
  // 驗證 StockDetail 類型
  validateStockDetail: (data) => {
    const errors = [];
    
    // 基本 Stock 驗證
    const stockValidation = TypeValidator.validateStock(data);
    if (!stockValidation.isValid) {
      errors.push(...stockValidation.errors);
    }
    
    // 額外的 StockDetail 驗證
    if (typeof data.pe !== 'number' || data.pe < 0) {
      errors.push('pe 必須是非負數');
    }
    
    if (typeof data.dividend !== 'number' || data.dividend < 0) {
      errors.push('dividend 必須是非負數');
    }
    
    if (!data.description || typeof data.description !== 'string') {
      errors.push('description 必須是非空字串');
    }
    
    if (!data.financials || typeof data.financials !== 'object') {
      errors.push('financials 必須是物件');
    }
    
    if (!Array.isArray(data.news)) {
      errors.push('news 必須是陣列');
    }
    
    if (!data.analysis || typeof data.analysis !== 'object') {
      errors.push('analysis 必須是物件');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },
  
  // 驗證 Concept 類型
  validateConcept: (data) => {
    const errors = [];
    
    if (!data.id || typeof data.id !== 'string') {
      errors.push('id 必須是非空字串');
    }
    
    if (!data.name || typeof data.name !== 'string') {
      errors.push('name 必須是非空字串');
    }
    
    if (!data.description || typeof data.description !== 'string') {
      errors.push('description 必須是非空字串');
    }
    
    if (!data.category || typeof data.category !== 'string') {
      errors.push('category 必須是非空字串');
    }
    
    if (!Array.isArray(data.stocks)) {
      errors.push('stocks 必須是陣列');
    }
    
    if (!data.marketTrend || typeof data.marketTrend !== 'string') {
      errors.push('marketTrend 必須是非空字串');
    }
    
    if (!data.lastUpdated || typeof data.lastUpdated !== 'string') {
      errors.push('lastUpdated 必須是非空字串');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },
  
  // 驗證 SearchResult 類型
  validateSearchResult: (data) => {
    const errors = [];
    
    if (!data.query || typeof data.query !== 'string') {
      errors.push('query 必須是非空字串');
    }
    
    if (!Array.isArray(data.results)) {
      errors.push('results 必須是陣列');
    }
    
    if (typeof data.totalResults !== 'number' || data.totalResults < 0) {
      errors.push('totalResults 必須是非負數');
    }
    
    if (typeof data.searchTime !== 'number' || data.searchTime < 0) {
      errors.push('searchTime 必須是非負數');
    }
    
    if (!data.filters || typeof data.filters !== 'object') {
      errors.push('filters 必須是物件');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

// 模擬類型轉換器
const TypeConverter = {
  // 轉換為 Stock 類型
  toStock: (rawData) => {
    return {
      id: String(rawData.id || ''),
      ticker: String(rawData.ticker || ''),
      name: String(rawData.name || ''),
      price: Number(rawData.price) || 0,
      change: Number(rawData.change) || 0,
      changePercent: Number(rawData.changePercent) || 0,
      volume: Number(rawData.volume) || 0,
      marketCap: Number(rawData.marketCap) || 0,
      sector: String(rawData.sector || ''),
      industry: String(rawData.industry || ''),
      isFavorite: Boolean(rawData.isFavorite),
      hasAnomaly: Boolean(rawData.hasAnomaly),
      sentiment: String(rawData.sentiment || 'neutral')
    };
  },
  
  // 轉換為 ConceptStock 類型
  toConceptStock: (rawData) => {
    return {
      id: String(rawData.id || ''),
      ticker: String(rawData.ticker || ''),
      name: String(rawData.name || ''),
      concept: String(rawData.concept || ''),
      relevanceScore: Number(rawData.relevanceScore) || 0,
      marketCap: Number(rawData.marketCap) || 0,
      sector: String(rawData.sector || ''),
      lastUpdated: String(rawData.lastUpdated || new Date().toISOString())
    };
  },
  
  // 轉換為 StockDetail 類型
  toStockDetail: (rawData) => {
    const baseStock = TypeConverter.toStock(rawData);
    
    return {
      ...baseStock,
      pe: Number(rawData.pe) || 0,
      dividend: Number(rawData.dividend) || 0,
      description: String(rawData.description || ''),
      financials: rawData.financials || {},
      news: Array.isArray(rawData.news) ? rawData.news : [],
      analysis: rawData.analysis || {}
    };
  },
  
  // 轉換為 Concept 類型
  toConcept: (rawData) => {
    return {
      id: String(rawData.id || ''),
      name: String(rawData.name || ''),
      description: String(rawData.description || ''),
      category: String(rawData.category || ''),
      stocks: Array.isArray(rawData.stocks) ? rawData.stocks : [],
      marketTrend: String(rawData.marketTrend || 'neutral'),
      lastUpdated: String(rawData.lastUpdated || new Date().toISOString())
    };
  },
  
  // 轉換為 SearchResult 類型
  toSearchResult: (rawData) => {
    return {
      query: String(rawData.query || ''),
      results: Array.isArray(rawData.results) ? rawData.results : [],
      totalResults: Number(rawData.totalResults) || 0,
      searchTime: Number(rawData.searchTime) || 0,
      filters: rawData.filters || {}
    };
  }
};

describe('股票類型定義', () => {
  describe('Stock 類型', () => {
    test('應該驗證有效的股票數據', () => {
      const validStock = {
        id: 'stock_1',
        ticker: 'TSLA',
        name: 'Tesla Inc',
        price: 245.50,
        change: 12.30,
        changePercent: 5.28,
        volume: 45000000,
        marketCap: 780000000000,
        sector: 'Automotive',
        industry: 'Electric Vehicles',
        isFavorite: true,
        hasAnomaly: false,
        sentiment: 'positive'
      };
      
      const validation = TypeValidator.validateStock(validStock);
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    test('應該檢測無效的股票數據', () => {
      const invalidStock = {
        id: null,
        ticker: '',
        name: 123,
        price: -100,
        change: 'invalid',
        changePercent: null,
        volume: -50000000,
        marketCap: 'invalid',
        sector: undefined,
        industry: 456,
        isFavorite: 'yes',
        hasAnomaly: 'no',
        sentiment: null
      };
      
      const validation = TypeValidator.validateStock(invalidStock);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
      expect(validation.errors).toContain('id 必須是非空字串');
      expect(validation.errors).toContain('price 必須是非負數');
      expect(validation.errors).toContain('change 必須是數字');
    });

    test('應該轉換原始數據為 Stock 類型', () => {
      const rawData = {
        id: 123,
        ticker: 'TSLA',
        name: 'Tesla Inc',
        price: '245.50',
        change: '12.30',
        changePercent: '5.28',
        volume: '45000000',
        marketCap: '780000000000',
        sector: 'Automotive',
        industry: 'Electric Vehicles',
        isFavorite: 1,
        hasAnomaly: 0,
        sentiment: 'positive'
      };
      
      const stock = TypeConverter.toStock(rawData);
      
      expect(typeof stock.id).toBe('string');
      expect(typeof stock.price).toBe('number');
      expect(typeof stock.isFavorite).toBe('boolean');
      expect(stock.id).toBe('123');
      expect(stock.price).toBe(245.50);
      expect(stock.isFavorite).toBe(true);
      expect(stock.hasAnomaly).toBe(false);
    });
  });

  describe('ConceptStock 類型', () => {
    test('應該驗證有效的概念股票數據', () => {
      const validConceptStock = {
        id: 'concept_1',
        ticker: 'NVDA',
        name: 'NVIDIA Corporation',
        concept: 'AI 晶片',
        relevanceScore: 0.95,
        marketCap: 2200000000000,
        sector: 'Technology',
        lastUpdated: '2025-01-15T10:30:00Z'
      };
      
      const validation = TypeValidator.validateConceptStock(validConceptStock);
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    test('應該檢測無效的概念股票數據', () => {
      const invalidConceptStock = {
        id: '',
        ticker: null,
        name: undefined,
        concept: 123,
        relevanceScore: 1.5, // 超出範圍
        marketCap: -1000000,
        sector: 456,
        lastUpdated: null
      };
      
      const validation = TypeValidator.validateConceptStock(invalidConceptStock);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('relevanceScore 必須是0到1之間的數字');
      expect(validation.errors).toContain('marketCap 必須是非負數');
    });

    test('應該轉換原始數據為 ConceptStock 類型', () => {
      const rawData = {
        id: 456,
        ticker: 'NVDA',
        name: 'NVIDIA Corporation',
        concept: 'AI 晶片',
        relevanceScore: '0.95',
        marketCap: '2200000000000',
        sector: 'Technology',
        lastUpdated: '2025-01-15T10:30:00Z'
      };
      
      const conceptStock = TypeConverter.toConceptStock(rawData);
      
      expect(typeof conceptStock.id).toBe('string');
      expect(typeof conceptStock.relevanceScore).toBe('number');
      expect(conceptStock.relevanceScore).toBe(0.95);
    });
  });

  describe('StockDetail 類型', () => {
    test('應該驗證有效的股票詳細數據', () => {
      const validStockDetail = {
        id: 'stock_1',
        ticker: 'AAPL',
        name: 'Apple Inc',
        price: 185.90,
        change: 3.20,
        changePercent: 1.75,
        volume: 55000000,
        marketCap: 2900000000000,
        sector: 'Technology',
        industry: 'Consumer Electronics',
        isFavorite: true,
        hasAnomaly: false,
        sentiment: 'positive',
        pe: 25.5,
        dividend: 2.8,
        description: 'Apple Inc. 是一家美國跨國科技公司',
        financials: { revenue: 394328000000, profit: 96995000000 },
        news: [{ title: 'Apple 發布新產品', date: '2025-01-15' }],
        analysis: { rating: 'buy', targetPrice: 200 }
      };
      
      const validation = TypeValidator.validateStockDetail(validStockDetail);
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    test('應該檢測無效的股票詳細數據', () => {
      const invalidStockDetail = {
        id: 'stock_1',
        ticker: 'AAPL',
        name: 'Apple Inc',
        price: 185.90,
        change: 3.20,
        changePercent: 1.75,
        volume: 55000000,
        marketCap: 2900000000000,
        sector: 'Technology',
        industry: 'Consumer Electronics',
        isFavorite: true,
        hasAnomaly: false,
        sentiment: 'positive',
        pe: -5, // 無效 PE
        dividend: 'invalid', // 無效股息
        description: null, // 空描述
        financials: 'not-an-object', // 非物件
        news: 'not-an-array', // 非陣列
        analysis: null // 空分析
      };
      
      const validation = TypeValidator.validateStockDetail(invalidStockDetail);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('pe 必須是非負數');
      expect(validation.errors).toContain('dividend 必須是非負數');
      expect(validation.errors).toContain('description 必須是非空字串');
    });

    test('應該轉換原始數據為 StockDetail 類型', () => {
      const rawData = {
        id: 'stock_1',
        ticker: 'AAPL',
        name: 'Apple Inc',
        price: '185.90',
        change: '3.20',
        changePercent: '1.75',
        volume: '55000000',
        marketCap: '2900000000000',
        sector: 'Technology',
        industry: 'Consumer Electronics',
        isFavorite: 1,
        hasAnomaly: 0,
        sentiment: 'positive',
        pe: '25.5',
        dividend: '2.8',
        description: 'Apple Inc. 是一家美國跨國科技公司',
        financials: { revenue: 394328000000, profit: 96995000000 },
        news: [{ title: 'Apple 發布新產品', date: '2025-01-15' }],
        analysis: { rating: 'buy', targetPrice: 200 }
      };
      
      const stockDetail = TypeConverter.toStockDetail(rawData);
      
      expect(typeof stockDetail.pe).toBe('number');
      expect(typeof stockDetail.dividend).toBe('number');
      expect(stockDetail.pe).toBe(25.5);
      expect(stockDetail.dividend).toBe(2.8);
    });
  });

  describe('Concept 類型', () => {
    test('應該驗證有效的概念數據', () => {
      const validConcept = {
        id: 'concept_1',
        name: 'AI 晶片',
        description: '人工智慧晶片技術相關概念',
        category: 'Technology',
        stocks: ['NVDA', 'AMD', 'INTC'],
        marketTrend: 'bullish',
        lastUpdated: '2025-01-15T10:30:00Z'
      };
      
      const validation = TypeValidator.validateConcept(validConcept);
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    test('應該檢測無效的概念數據', () => {
      const invalidConcept = {
        id: null,
        name: '',
        description: undefined,
        category: 123,
        stocks: 'not-an-array',
        marketTrend: null,
        lastUpdated: 456
      };
      
      const validation = TypeValidator.validateConcept(invalidConcept);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('stocks 必須是陣列');
    });

    test('應該轉換原始數據為 Concept 類型', () => {
      const rawData = {
        id: 789,
        name: 'AI 晶片',
        description: '人工智慧晶片技術相關概念',
        category: 'Technology',
        stocks: ['NVDA', 'AMD', 'INTC'],
        marketTrend: 'bullish',
        lastUpdated: '2025-01-15T10:30:00Z'
      };
      
      const concept = TypeConverter.toConcept(rawData);
      
      expect(typeof concept.id).toBe('string');
      expect(concept.id).toBe('789');
      expect(Array.isArray(concept.stocks)).toBe(true);
    });
  });

  describe('SearchResult 類型', () => {
    test('應該驗證有效的搜尋結果數據', () => {
      const validSearchResult = {
        query: 'AI 晶片',
        results: [
          { id: 'stock_1', ticker: 'NVDA', name: 'NVIDIA' },
          { id: 'stock_2', ticker: 'AMD', name: 'AMD' }
        ],
        totalResults: 2,
        searchTime: 150,
        filters: { sector: 'Technology', minPrice: 100 }
      };
      
      const validation = TypeValidator.validateSearchResult(validSearchResult);
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    test('應該檢測無效的搜尋結果數據', () => {
      const invalidSearchResult = {
        query: null,
        results: 'not-an-array',
        totalResults: -5,
        searchTime: 'invalid',
        filters: null
      };
      
      const validation = TypeValidator.validateSearchResult(invalidSearchResult);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('results 必須是陣列');
      expect(validation.errors).toContain('totalResults 必須是非負數');
    });

    test('應該轉換原始數據為 SearchResult 類型', () => {
      const rawData = {
        query: 'AI 晶片',
        results: [
          { id: 'stock_1', ticker: 'NVDA', name: 'NVIDIA' },
          { id: 'stock_2', ticker: 'AMD', name: 'AMD' }
        ],
        totalResults: '2',
        searchTime: '150',
        filters: { sector: 'Technology', minPrice: 100 }
      };
      
      const searchResult = TypeConverter.toSearchResult(rawData);
      
      expect(typeof searchResult.totalResults).toBe('number');
      expect(typeof searchResult.searchTime).toBe('number');
      expect(searchResult.totalResults).toBe(2);
      expect(searchResult.searchTime).toBe(150);
    });
  });

  describe('邊界情況', () => {
    test('應該處理空數據', () => {
      const emptyStock = {};
      const validation = TypeValidator.validateStock(emptyStock);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    test('應該處理極端數值', () => {
      const extremeStock = {
        id: 'stock_1',
        ticker: 'TEST',
        name: 'Test Stock',
        price: 0,
        change: -999999,
        changePercent: -99.99,
        volume: 0,
        marketCap: 0,
        sector: 'Test',
        industry: 'Test',
        isFavorite: false,
        hasAnomaly: false,
        sentiment: 'neutral'
      };
      
      const validation = TypeValidator.validateStock(extremeStock);
      
      expect(validation.isValid).toBe(true); // 極端值仍然是有效的
    });

    test('應該處理特殊字符', () => {
      const specialStock = {
        id: 'stock_1',
        ticker: 'TEST',
        name: 'Test Stock (特殊) - 測試@#$%',
        price: 100,
        change: 5,
        changePercent: 5.26,
        volume: 1000000,
        marketCap: 1000000000,
        sector: 'Test Sector',
        industry: 'Test Industry',
        isFavorite: true,
        hasAnomaly: false,
        sentiment: 'positive'
      };
      
      const validation = TypeValidator.validateStock(specialStock);
      
      expect(validation.isValid).toBe(true);
    });
  });

  describe('類型轉換邊界情況', () => {
    test('應該處理 null 和 undefined 值', () => {
      const rawData = {
        id: null,
        ticker: undefined,
        name: 'Test Stock',
        price: null,
        change: undefined,
        changePercent: null,
        volume: undefined,
        marketCap: null,
        sector: null,
        industry: undefined,
        isFavorite: null,
        hasAnomaly: undefined,
        sentiment: null
      };
      
      const stock = TypeConverter.toStock(rawData);
      
      expect(stock.id).toBe('');
      expect(stock.ticker).toBe('');
      expect(stock.price).toBe(0);
      expect(stock.isFavorite).toBe(false);
    });

    test('應該處理空字串和零值', () => {
      const rawData = {
        id: '',
        ticker: '',
        name: '',
        price: 0,
        change: 0,
        changePercent: 0,
        volume: 0,
        marketCap: 0,
        sector: '',
        industry: '',
        isFavorite: 0,
        hasAnomaly: 0,
        sentiment: ''
      };
      
      const stock = TypeConverter.toStock(rawData);
      
      expect(stock.id).toBe('');
      expect(stock.price).toBe(0);
      expect(stock.isFavorite).toBe(false);
      expect(stock.sentiment).toBe('neutral'); // 默認值
    });
  });
});
