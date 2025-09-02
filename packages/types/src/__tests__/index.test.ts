import {
  // 基礎型別
  Exchange,
  SearchMode,
  SortOption,
  RiskLevel,
  Recommendation,
  Sentiment,
  
  // 基礎介面
  BaseEntity,
  BaseStock,
  
  // 股票相關型別
  Stock,
  StockConcept,
  ThemeForStock,
  StockAnalysisResult,
  StockPriceData,
  
  // 市場資料型別
  MarketData,
  
  // API 回應型別
  ApiResponse,
  PaginatedResponse,
  SearchResult,
  
  // 篩選和排序型別
  FilterOptions,
  SortOptions,
  
  // 投資組合型別
  PortfolioItem,
  PortfolioOptimizationRequest,
  
  // AI 分析型別
  AIAnalysisRequest,
  AIAnalysisResult,
  
  // RAG 和向量搜尋型別
  VectorSearchResult,
  RAGManifest,
  
  // 快取和系統型別
  CacheEntry,
  SystemEvent,
  UserPreferences
} from '../index';

describe('基礎型別測試', () => {
  test('Exchange 型別應該包含正確的值', () => {
    const exchanges: Exchange[] = ['TWSE', 'TPEx'];
    expect(exchanges).toHaveLength(2);
    expect(exchanges).toContain('TWSE');
    expect(exchanges).toContain('TPEx');
  });

  test('SearchMode 型別應該包含正確的值', () => {
    const modes: SearchMode[] = ['theme', 'stock'];
    expect(modes).toHaveLength(2);
    expect(modes).toContain('theme');
    expect(modes).toContain('stock');
  });

  test('SortOption 型別應該包含正確的值', () => {
    const options: SortOption[] = ['popular', 'latest', 'heat', 'strength', 'sentiment'];
    expect(options).toHaveLength(5);
    expect(options).toContain('popular');
    expect(options).toContain('latest');
    expect(options).toContain('heat');
    expect(options).toContain('strength');
    expect(options).toContain('sentiment');
  });

  test('RiskLevel 型別應該包含正確的值', () => {
    const levels: RiskLevel[] = ['low', 'medium', 'high'];
    expect(levels).toHaveLength(3);
    expect(levels).toContain('low');
    expect(levels).toContain('medium');
    expect(levels).toContain('high');
  });

  test('Recommendation 型別應該包含正確的值', () => {
    const recommendations: Recommendation[] = ['buy', 'hold', 'sell'];
    expect(recommendations).toHaveLength(3);
    expect(recommendations).toContain('buy');
    expect(recommendations).toContain('hold');
    expect(recommendations).toContain('sell');
  });

  test('Sentiment 型別應該包含正確的值', () => {
    const sentiments: Sentiment[] = ['positive', 'negative', 'neutral'];
    expect(sentiments).toHaveLength(3);
    expect(sentiments).toContain('positive');
    expect(sentiments).toContain('negative');
    expect(sentiments).toContain('neutral');
  });
});

describe('基礎介面測試', () => {
  test('BaseEntity 應該有正確的屬性', () => {
    const entity: BaseEntity = {
      id: 'test-id',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    };

    expect(entity.id).toBe('test-id');
    expect(entity.createdAt).toBe('2024-01-01T00:00:00Z');
    expect(entity.updatedAt).toBe('2024-01-01T00:00:00Z');
  });

  test('BaseStock 應該繼承 BaseEntity 並添加股票屬性', () => {
    const stock: BaseStock = {
      id: 'stock-1',
      ticker: '2330',
      symbol: 'TSMC',
      name: '台積電',
      exchange: 'TWSE',
      createdAt: '2024-01-01T00:00:00Z'
    };

    expect(stock.id).toBe('stock-1');
    expect(stock.ticker).toBe('2330');
    expect(stock.symbol).toBe('TSMC');
    expect(stock.name).toBe('台積電');
    expect(stock.exchange).toBe('TWSE');
    expect(stock.createdAt).toBe('2024-01-01T00:00:00Z');
  });
});

describe('股票相關型別測試', () => {
  test('Stock 應該包含所有必要的股票屬性', () => {
    const stock: Stock = {
      id: 'stock-1',
      ticker: '2330',
      symbol: 'TSMC',
      name: '台積電',
      exchange: 'TWSE',
      reason: 'AI 伺服器概念股龍頭',
      heatScore: 95,
      concepts: ['AI', '伺服器', '半導體'],
      currentPrice: 500,
      change: 10,
      changePercent: 2.04,
      volume: 1000000,
      marketCap: 1000000000000,
      pe: 25,
      pb: 5
    };

    expect(stock.id).toBe('stock-1');
    expect(stock.ticker).toBe('2330');
    expect(stock.reason).toBe('AI 伺服器概念股龍頭');
    expect(stock.heatScore).toBe(95);
    expect(stock.concepts).toEqual(['AI', '伺服器', '半導體']);
    expect(stock.currentPrice).toBe(500);
    expect(stock.change).toBe(10);
    expect(stock.changePercent).toBe(2.04);
  });

  test('StockConcept 應該包含主題和相關股票', () => {
    const concept: StockConcept = {
      id: 'concept-1',
      theme: 'AI 伺服器',
      name: 'AI 伺服器',
      description: '人工智慧伺服器相關概念股',
      heatScore: 90,
      stocks: [
        {
          id: 'stock-1',
          ticker: '2330',
          symbol: 'TSMC',
          name: '台積電',
          exchange: 'TWSE'
        }
      ],
      tags: ['AI', '伺服器', '科技'],
      category: '科技'
    };

    expect(concept.id).toBe('concept-1');
    expect(concept.theme).toBe('AI 伺服器');
    expect(concept.heatScore).toBe(90);
    expect(concept.stocks).toHaveLength(1);
    expect(concept.tags).toEqual(['AI', '伺服器', '科技']);
    expect(concept.category).toBe('科技');
  });

  test('ThemeForStock 應該包含股票在特定主題中的資訊', () => {
    const theme: ThemeForStock = {
      id: 'theme-1',
      theme: 'AI 伺服器',
      name: 'AI 伺服器',
      description: '台積電在 AI 伺服器供應鏈中扮演關鍵角色',
      heatScore: 90,
      relevanceScore: 95,
      category: '科技'
    };

    expect(theme.id).toBe('theme-1');
    expect(theme.theme).toBe('AI 伺服器');
    expect(theme.heatScore).toBe(90);
    expect(theme.relevanceScore).toBe(95);
    expect(theme.category).toBe('科技');
  });

  test('StockAnalysisResult 應該包含股票分析結果', () => {
    const analysis: StockAnalysisResult = {
      id: 'analysis-1',
      stock: {
        ticker: '2330',
        name: '台積電'
      },
      themes: [
        {
          id: 'theme-1',
          theme: 'AI 伺服器',
          name: 'AI 伺服器',
          heatScore: 90,
          relevanceScore: 95,
          category: '科技'
        }
      ],
      summary: '台積電是 AI 伺服器概念股龍頭',
      riskLevel: 'low',
      recommendation: 'buy',
      sentiment: 'positive'
    };

    expect(analysis.id).toBe('analysis-1');
    expect(analysis.stock.ticker).toBe('2330');
    expect(analysis.stock.name).toBe('台積電');
    expect(analysis.themes).toHaveLength(1);
    expect(analysis.summary).toBe('台積電是 AI 伺服器概念股龍頭');
    expect(analysis.riskLevel).toBe('low');
    expect(analysis.recommendation).toBe('buy');
    expect(analysis.sentiment).toBe('positive');
  });

  test('StockPriceData 應該包含完整的價格資訊', () => {
    const priceData: StockPriceData = {
      id: 'price-1',
      ticker: '2330',
      symbol: 'TSMC',
      name: '台積電',
      exchange: 'TWSE',
      price: 500,
      change: 10,
      changePercent: 2.04,
      volume: 1000000,
      marketCap: 1000000000000,
      pe: 25,
      pb: 5,
      high: 510,
      low: 490,
      open: 495,
      previousClose: 490
    };

    expect(priceData.price).toBe(500);
    expect(priceData.change).toBe(10);
    expect(priceData.changePercent).toBe(2.04);
    expect(priceData.high).toBe(510);
    expect(priceData.low).toBe(490);
    expect(priceData.open).toBe(495);
    expect(priceData.previousClose).toBe(490);
  });
});

describe('市場資料型別測試', () => {
  test('MarketData 應該包含市場概況資訊', () => {
    const marketData: MarketData = {
      date: '2024-01-01',
      totalVolume: 1000000000,
      totalValue: 5000000000000,
      upCount: 800,
      downCount: 200,
      unchangedCount: 100,
      indexValue: 15000,
      indexChange: 150,
      indexChangePercent: 1.01
    };

    expect(marketData.date).toBe('2024-01-01');
    expect(marketData.totalVolume).toBe(1000000000);
    expect(marketData.totalValue).toBe(5000000000000);
    expect(marketData.upCount).toBe(800);
    expect(marketData.downCount).toBe(200);
    expect(marketData.unchangedCount).toBe(100);
    expect(marketData.indexValue).toBe(15000);
    expect(marketData.indexChange).toBe(150);
    expect(marketData.indexChangePercent).toBe(1.01);
  });
});

describe('API 回應型別測試', () => {
  test('ApiResponse 應該包含基本的回應結構', () => {
    const response: ApiResponse<string> = {
      success: true,
      data: 'test data',
      timestamp: '2024-01-01T00:00:00Z'
    };

    expect(response.success).toBe(true);
    expect(response.data).toBe('test data');
    expect(response.timestamp).toBe('2024-01-01T00:00:00Z');
  });

  test('PaginatedResponse 應該包含分頁資訊', () => {
    const paginatedResponse: PaginatedResponse<string> = {
      success: true,
      data: ['item1', 'item2', 'item3'],
      pagination: {
        page: 1,
        limit: 10,
        total: 25,
        totalPages: 3
      }
    };

    expect(paginatedResponse.success).toBe(true);
    expect(paginatedResponse.data).toHaveLength(3);
    expect(paginatedResponse.pagination.page).toBe(1);
    expect(paginatedResponse.pagination.limit).toBe(10);
    expect(paginatedResponse.pagination.total).toBe(25);
    expect(paginatedResponse.pagination.totalPages).toBe(3);
  });

  test('SearchResult 應該包含搜尋結果資訊', () => {
    const searchResult: SearchResult<string> = {
      query: 'AI',
      results: ['result1', 'result2'],
      total: 2,
      searchTime: 150,
      suggestions: ['AI 伺服器', 'AI 晶片']
    };

    expect(searchResult.query).toBe('AI');
    expect(searchResult.results).toHaveLength(2);
    expect(searchResult.total).toBe(2);
    expect(searchResult.searchTime).toBe(150);
    expect(searchResult.suggestions).toEqual(['AI 伺服器', 'AI 晶片']);
  });
});

describe('篩選和排序型別測試', () => {
  test('FilterOptions 應該包含所有篩選選項', () => {
    const filterOptions: FilterOptions = {
      favorites: true,
      anomalies: false,
      sentimentPositive: true,
      sentimentNegative: false,
      exchange: 'TWSE',
      minHeatScore: 50,
      maxHeatScore: 100,
      categories: ['科技', '金融']
    };

    expect(filterOptions.favorites).toBe(true);
    expect(filterOptions.anomalies).toBe(false);
    expect(filterOptions.sentimentPositive).toBe(true);
    expect(filterOptions.sentimentNegative).toBe(false);
    expect(filterOptions.exchange).toBe('TWSE');
    expect(filterOptions.minHeatScore).toBe(50);
    expect(filterOptions.maxHeatScore).toBe(100);
    expect(filterOptions.categories).toEqual(['科技', '金融']);
  });

  test('SortOptions 應該包含排序欄位和方向', () => {
    const sortOptions: SortOptions = {
      field: 'heatScore',
      direction: 'desc'
    };

    expect(sortOptions.field).toBe('heatScore');
    expect(sortOptions.direction).toBe('desc');
  });
});

describe('投資組合型別測試', () => {
  test('PortfolioItem 應該包含投資組合項目資訊', () => {
    const portfolioItem: PortfolioItem = {
      ticker: '2330',
      weight: 0.3,
      shares: 1000,
      cost: 450,
      currentValue: 500
    };

    expect(portfolioItem.ticker).toBe('2330');
    expect(portfolioItem.weight).toBe(0.3);
    expect(portfolioItem.shares).toBe(1000);
    expect(portfolioItem.cost).toBe(450);
    expect(portfolioItem.currentValue).toBe(500);
  });

  test('PortfolioOptimizationRequest 應該包含投資組合優化請求', () => {
    const optimizationRequest: PortfolioOptimizationRequest = {
      portfolio: [
        { ticker: '2330', weight: 0.3 },
        { ticker: '2317', weight: 0.2 }
      ],
      riskTolerance: 'medium',
      targetReturn: 0.08,
      constraints: {
        maxWeight: 0.4,
        minWeight: 0.05,
        maxSectorWeight: 0.5
      }
    };

    expect(optimizationRequest.portfolio).toHaveLength(2);
    expect(optimizationRequest.riskTolerance).toBe('medium');
    expect(optimizationRequest.targetReturn).toBe(0.08);
    expect(optimizationRequest.constraints?.maxWeight).toBe(0.4);
    expect(optimizationRequest.constraints?.minWeight).toBe(0.05);
    expect(optimizationRequest.constraints?.maxSectorWeight).toBe(0.5);
  });
});

describe('AI 分析型別測試', () => {
  test('AIAnalysisRequest 應該包含 AI 分析請求', () => {
    const aiRequest: AIAnalysisRequest = {
      query: '分析台積電的投資價值',
      context: 'AI 伺服器概念股分析',
      maxLength: 500,
      includeSentiment: true,
      includeRisk: true
    };

    expect(aiRequest.query).toBe('分析台積電的投資價值');
    expect(aiRequest.context).toBe('AI 伺服器概念股分析');
    expect(aiRequest.maxLength).toBe(500);
    expect(aiRequest.includeSentiment).toBe(true);
    expect(aiRequest.includeRisk).toBe(true);
  });

  test('AIAnalysisResult 應該包含 AI 分析結果', () => {
    const aiResult: AIAnalysisResult = {
      analysis: '台積電是 AI 伺服器概念股龍頭，具有強勁的成長潛力',
      sentiment: 'positive',
      riskLevel: 'low',
      confidence: 0.85,
      keywords: ['台積電', 'AI', '伺服器', '成長'],
      summary: '台積電投資價值高，風險低'
    };

    expect(aiResult.analysis).toBe('台積電是 AI 伺服器概念股龍頭，具有強勁的成長潛力');
    expect(aiResult.sentiment).toBe('positive');
    expect(aiResult.riskLevel).toBe('low');
    expect(aiResult.confidence).toBe(0.85);
    expect(aiResult.keywords).toEqual(['台積電', 'AI', '伺服器', '成長']);
    expect(aiResult.summary).toBe('台積電投資價值高，風險低');
  });
});

describe('RAG 和向量搜尋型別測試', () => {
  test('VectorSearchResult 應該包含向量搜尋結果', () => {
    const vectorResult: VectorSearchResult = {
      doc_id: 'doc-1',
      score: 0.95,
      metadata: {
        type: 'theme',
        title: 'AI 伺服器概念股分析',
        theme_name: 'AI 伺服器',
        tags: ['AI', '伺服器', '科技'],
        category: '科技'
      },
      content: 'AI 伺服器是未來科技發展的重要趨勢...'
    };

    expect(vectorResult.doc_id).toBe('doc-1');
    expect(vectorResult.score).toBe(0.95);
    expect(vectorResult.metadata.type).toBe('theme');
    expect(vectorResult.metadata.title).toBe('AI 伺服器概念股分析');
    expect(vectorResult.metadata.theme_name).toBe('AI 伺服器');
    expect(vectorResult.metadata.tags).toEqual(['AI', '伺服器', '科技']);
    expect(vectorResult.metadata.category).toBe('科技');
    expect(vectorResult.content).toBe('AI 伺服器是未來科技發展的重要趨勢...');
  });

  test('RAGManifest 應該包含 RAG 系統資訊', () => {
    const manifest: RAGManifest = {
      theme_overview: 150,
      theme_to_stock: 500,
      total: 650,
      fields: ['type', 'title', 'theme_name', 'tags', 'category'],
      note: 'RAG 系統已更新至最新版本',
      last_updated: '2024-01-01T00:00:00Z'
    };

    expect(manifest.theme_overview).toBe(150);
    expect(manifest.theme_to_stock).toBe(500);
    expect(manifest.total).toBe(650);
    expect(manifest.fields).toEqual(['type', 'title', 'theme_name', 'tags', 'category']);
    expect(manifest.note).toBe('RAG 系統已更新至最新版本');
    expect(manifest.last_updated).toBe('2024-01-01T00:00:00Z');
  });
});

describe('快取和系統型別測試', () => {
  test('CacheEntry 應該包含快取項目資訊', () => {
    const cacheEntry: CacheEntry<string> = {
      data: 'cached data',
      timestamp: Date.now(),
      ttl: 3600000
    };

    expect(cacheEntry.data).toBe('cached data');
    expect(typeof cacheEntry.timestamp).toBe('number');
    expect(cacheEntry.ttl).toBe(3600000);
  });

  test('SystemEvent 應該包含系統事件資訊', () => {
    const systemEvent: SystemEvent = {
      id: 'event-1',
      type: 'data_update',
      severity: 'info',
      message: '股票資料已更新',
      timestamp: '2024-01-01T00:00:00Z',
      metadata: {
        updatedCount: 100,
        source: 'api'
      }
    };

    expect(systemEvent.id).toBe('event-1');
    expect(systemEvent.type).toBe('data_update');
    expect(systemEvent.severity).toBe('info');
    expect(systemEvent.message).toBe('股票資料已更新');
    expect(systemEvent.timestamp).toBe('2024-01-01T00:00:00Z');
    expect(systemEvent.metadata?.updatedCount).toBe(100);
    expect(systemEvent.metadata?.source).toBe('api');
  });
});

describe('用戶偏好設定測試', () => {
  test('UserPreferences 應該包含用戶偏好設定', () => {
    const preferences: UserPreferences = {
      defaultSort: 'popular',
      defaultSearchMode: 'theme',
      favoriteThemes: ['AI 伺服器', '電動車'],
      favoriteStocks: ['2330', '2317'],
      uiTheme: 'dark',
      notifications: {
        priceAlerts: true,
        themeUpdates: true,
        marketNews: false
      }
    };

    expect(preferences.defaultSort).toBe('popular');
    expect(preferences.defaultSearchMode).toBe('theme');
    expect(preferences.favoriteThemes).toEqual(['AI 伺服器', '電動車']);
    expect(preferences.favoriteStocks).toEqual(['2330', '2317']);
    expect(preferences.uiTheme).toBe('dark');
    expect(preferences.notifications.priceAlerts).toBe(true);
    expect(preferences.notifications.themeUpdates).toBe(true);
    expect(preferences.notifications.marketNews).toBe(false);
  });
});

describe('型別相容性測試', () => {
  test('Stock 應該與 BaseStock 相容', () => {
    const baseStock: BaseStock = {
      id: 'stock-1',
      ticker: '2330',
      symbol: 'TSMC',
      name: '台積電',
      exchange: 'TWSE'
    };

    const stock: Stock = baseStock; // 應該可以賦值
    expect(stock.id).toBe('stock-1');
    expect(stock.ticker).toBe('2330');
  });

  test('StockConcept 應該與 BaseEntity 相容', () => {
    const baseEntity: BaseEntity = {
      id: 'concept-1'
    };

    const concept: StockConcept = {
      ...baseEntity,
      theme: 'AI 伺服器',
      name: 'AI 伺服器',
      heatScore: 90,
      stocks: []
    };

    expect(concept.id).toBe('concept-1');
    expect(concept.theme).toBe('AI 伺服器');
  });
});

describe('型別約束測試', () => {
  test('泛型約束應該正確工作', () => {
    // 測試 ApiResponse 的泛型約束
    const stringResponse: ApiResponse<string> = {
      success: true,
      data: 'test'
    };

    const numberResponse: ApiResponse<number> = {
      success: true,
      data: 42
    };

    const stockResponse: ApiResponse<Stock> = {
      success: true,
      data: {
        id: 'stock-1',
        ticker: '2330',
        symbol: 'TSMC',
        name: '台積電',
        exchange: 'TWSE'
      }
    };

    expect(stringResponse.data).toBe('test');
    expect(numberResponse.data).toBe(42);
    expect(stockResponse.data?.ticker).toBe('2330');
  });

  test('聯合型別應該正確工作', () => {
    // 測試 Exchange 聯合型別
    const validExchanges: Exchange[] = ['TWSE', 'TPEx'];
    const invalidExchange = 'NYSE'; // 這會導致 TypeScript 錯誤

    expect(validExchanges).toContain('TWSE');
    expect(validExchanges).toContain('TPEx');
  });
});
