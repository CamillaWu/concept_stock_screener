import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { geminiService } from './services/gemini';
import { realStockDataService } from './services/real-stock-data';
import { cacheService } from './services/cache';
import { vectorService } from './services/vector';
import { ragLoaderService } from './services/rag-loader';
import type { StockConcept, StockAnalysisResult, ApiResponse } from '@concepts-radar/types';

// 設置開發環境標記
(globalThis as any).__DEV__ = true;

const app = new Hono();

// CORS 設定
app.use('*', cors({
  origin: (origin) => {
    // 允許所有來源，或者你可以設定特定的域名
    return origin || '*';
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// 健康檢查
app.get('/', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 趨勢主題 API - 整合真實資料
app.get('/trending', async (c) => {
  try {
    const sortBy = c.req.query('sort') as 'popular' | 'latest' || 'popular';
    const useRealData = c.req.query('real') === 'true';
    
    // 先檢查快取
    const cacheKey = `trending:${sortBy}:${useRealData}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return c.json(cached);
    }

    let themes: StockConcept[];

    if (useRealData) {
      // 使用真實台股資料
      console.log('使用真實台股資料');
      themes = await realStockDataService.getRealTrendingThemes();
      
      // 如果真實資料不足，補充 AI 生成的資料
      if (themes.length < 10) {
        console.log('真實資料不足，補充 AI 資料');
        const aiThemes = await geminiService.fetchTrendingThemes(sortBy);
        themes = [...themes, ...aiThemes.slice(0, 15 - themes.length)];
      }
    } else {
      // 使用 AI 生成的資料
      console.log('使用 AI 生成資料');
      themes = await geminiService.fetchTrendingThemes(sortBy, c.env);
    }
    
    // 儲存到快取
    await cacheService.set(cacheKey, themes, 300); // 5分鐘快取
    
    return c.json(themes);
  } catch (error) {
    console.error('Trending API error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch trending themes',
      code: 'internal_error'
    }, 500);
  }
});

// 搜尋 API - 整合真實資料
app.get('/search', async (c) => {
  try {
    const mode = c.req.query('mode') as 'theme' | 'stock';
    const query = c.req.query('q');
    const useRealData = c.req.query('real') === 'true';
    
    if (!mode || !query) {
      return c.json({
        success: false,
        error: 'Missing required parameters',
        code: 'invalid_mode'
      }, 400);
    }

    if (!['theme', 'stock'].includes(mode)) {
      return c.json({
        success: false,
        error: 'Invalid mode parameter',
        code: 'invalid_mode'
      }, 400);
    }

    // 檢查快取
    const cacheKey = `search:${mode}:${query}:${useRealData}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return c.json(cached);
    }

    let result: StockConcept | StockAnalysisResult;

    if (mode === 'theme') {
      if (useRealData) {
        // 使用真實資料搜尋主題
        const stocks = await realStockDataService.getStocksByIndustry(query);
        if (stocks.length > 0) {
          result = {
            id: `real-${query}`,
            theme: query,
            name: query,
            description: `與 ${query} 相關的台股概念股`,
            heatScore: Math.floor(Math.random() * 30) + 70,
            stocks: stocks
          };
        } else {
          // 如果真實資料沒有找到，使用 AI
          result = await geminiService.fetchStockConcepts(query);
        }
      } else {
        result = await geminiService.fetchStockConcepts(query);
      }
    } else {
      if (useRealData) {
        // 使用真實資料搜尋股票
        result = await realStockDataService.getStockConceptAnalysis(query);
        if (!result) {
          // 如果真實資料沒有找到，使用 AI
          result = await geminiService.fetchConceptsForStock(query);
        }
      } else {
        result = await geminiService.fetchConceptsForStock(query);
      }
    }

    // 儲存到快取
    await cacheService.set(cacheKey, result, 600); // 10分鐘快取

    return c.json(result);
  } catch (error) {
    console.error('Search API error:', error);
    return c.json({
      success: false,
      error: 'Search failed',
      code: 'internal_error'
    }, 500);
  }
});

// 新增：股票即時價格 API
app.get('/stock-price/:ticker', async (c) => {
  try {
    const ticker = c.req.param('ticker');
    
    if (!ticker) {
      return c.json({
        success: false,
        error: 'Missing ticker parameter',
        code: 'invalid_ticker'
      }, 400);
    }

    // 檢查快取
    const cacheKey = `stock-price:${ticker}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return c.json(cached);
    }

    const priceData = await realStockDataService.getStockPrice(ticker);
    
    if (!priceData) {
      return c.json({
        success: false,
        error: 'Stock not found',
        code: 'no_results'
      }, 404);
    }

    // 儲存到快取
    await cacheService.set(cacheKey, priceData, 60); // 1分鐘快取
    
    return c.json(priceData);
  } catch (error) {
    console.error('Stock price API error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch stock price',
      code: 'internal_error'
    }, 500);
  }
});

// 新增：市場概況 API
app.get('/market-overview', async (c) => {
  try {
    // 檢查快取
    const cacheKey = 'market-overview';
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return c.json(cached);
    }

    const marketData = await realStockDataService.getMarketOverview();
    
    if (!marketData) {
      return c.json({
        success: false,
        error: 'Market data not available',
        code: 'no_results'
      }, 404);
    }

    // 儲存到快取
    await cacheService.set(cacheKey, marketData, 300); // 5分鐘快取
    
    return c.json(marketData);
  } catch (error) {
    console.error('Market overview API error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch market overview',
      code: 'internal_error'
    }, 500);
  }
});

// 新增：股票列表 API
app.get('/stocks', async (c) => {
  try {
    const industry = c.req.query('industry');
    
    // 檢查快取
    const cacheKey = `stocks:${industry || 'all'}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return c.json(cached);
    }

    let stocks;
    if (industry) {
      stocks = await realStockDataService.getStocksByIndustry(industry);
    } else {
      const stockList = await realStockDataService.getStockList();
      stocks = stockList.slice(0, 100).map(stock => ({
        ticker: stock.code,
        symbol: stock.code,
        name: stock.name,
        exchange: stock.market as 'TWSE' | 'TPEx',
        reason: `屬於${stock.industry}產業`,
        heatScore: Math.floor(Math.random() * 40) + 60,
        concepts: [stock.industry]
      }));
    }

    // 儲存到快取
    await cacheService.set(cacheKey, stocks, 1800); // 30分鐘快取
    
    return c.json(stocks);
  } catch (error) {
    console.error('Stocks API error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch stocks',
      code: 'internal_error'
    }, 500);
  }
});

// 概念強度分析 API
app.get('/concept-strength', async (c) => {
  try {
    const theme = c.req.query('theme');
    
    if (!theme) {
      return c.json({
        success: false,
        error: 'Missing theme parameter',
        code: 'invalid_theme'
      }, 400);
    }

    // 檢查快取
    const cacheKey = `concept-strength:${theme}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return c.json(cached);
    }

    // 呼叫 Gemini API
    const strength = await geminiService.analyzeConceptStrength(theme);
    
    // 儲存到快取
    await cacheService.set(cacheKey, strength, 1800); // 30分鐘快取
    
    return c.json(strength);
  } catch (error) {
    console.error('Concept strength API error:', error);
    return c.json({
      success: false,
      error: 'Failed to analyze concept strength',
      code: 'internal_error'
    }, 500);
  }
});

// 情緒分析 API
app.get('/sentiment', async (c) => {
  try {
    const theme = c.req.query('theme');
    
    if (!theme) {
      return c.json({
        success: false,
        error: 'Missing theme parameter',
        code: 'invalid_theme'
      }, 400);
    }

    // 檢查快取
    const cacheKey = `sentiment:${theme}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return c.json(cached);
    }

    // 呼叫 Gemini API
    const sentiment = await geminiService.analyzeSentiment(theme);
    
    // 儲存到快取
    await cacheService.set(cacheKey, sentiment, 1800); // 30分鐘快取
    
    return c.json(sentiment);
  } catch (error) {
    console.error('Sentiment API error:', error);
    return c.json({
      success: false,
      error: 'Failed to analyze sentiment',
      code: 'internal_error'
    }, 500);
  }
});

// 個股歸因分析 API
app.get('/stock-attribution', async (c) => {
  try {
    const stockId = c.req.query('stockId');
    const theme = c.req.query('theme');
    
    if (!stockId || !theme) {
      return c.json({
        success: false,
        error: 'Missing required parameters',
        code: 'invalid_parameters'
      }, 400);
    }

    // 檢查快取
    const cacheKey = `stock-attribution:${stockId}:${theme}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return c.json(cached);
    }

    // 呼叫 Gemini API
    const attribution = await geminiService.analyzeStockAttribution(stockId, theme);
    
    // 儲存到快取
    await cacheService.set(cacheKey, attribution, 3600); // 1小時快取
    
    return c.json(attribution);
  } catch (error) {
    console.error('Stock attribution API error:', error);
    return c.json({
      success: false,
      error: 'Failed to get stock attribution',
      code: 'internal_error'
    }, 500);
  }
});

// 綜合主題分析 API
app.get('/theme-analysis', async (c) => {
  try {
    const theme = c.req.query('theme');
    
    if (!theme) {
      return c.json({
        success: false,
        error: 'Missing theme parameter',
        code: 'invalid_theme'
      }, 400);
    }

    // 檢查快取
    const cacheKey = `theme-analysis:${theme}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return c.json(cached);
    }

    // 呼叫 Gemini API
    const analysis = await geminiService.analyzeConceptStrength(theme);
    
    // 儲存到快取
    await cacheService.set(cacheKey, analysis, 1800); // 30分鐘快取
    
    return c.json(analysis);
  } catch (error) {
    console.error('Theme analysis API error:', error);
    return c.json({
      success: false,
      error: 'Failed to analyze theme',
      code: 'internal_error'
    }, 500);
  }
});

// RAG 相關 API
app.get('/rag/manifest.json', async (c) => {
  try {
    // 使用 RAG loader service 來載入 manifest
    const manifest = await ragLoaderService.loadManifest();
    return c.json(manifest);
  } catch (error) {
    console.error('Failed to serve manifest:', error);
    return c.json({
      theme_overview: 15,
      theme_to_stock: 75,
      total: 90,
      fields: ['doc_id', 'type', 'title', 'text', 'source_urls', 'theme_id', 'theme_name'],
      note: 'Fallback manifest - API endpoint error'
    });
  }
});

app.get('/rag/docs.jsonl', async (c) => {
  try {
    // 使用 RAG loader service 來載入 documents
    const documents = await ragLoaderService.loadDocuments();
    
    // 將 documents 轉換為 JSONL 格式
    const jsonlContent = documents.map(doc => JSON.stringify(doc)).join('\n');
    
    console.log(`Serving ${documents.length} RAG documents as JSONL`);
    return c.text(jsonlContent);
  } catch (error) {
    console.error('Failed to serve RAG documents:', error);
    return c.json({ error: 'Failed to serve RAG documents' }, 500);
  }
});

// 檢查 RAG 狀態
app.get('/rag/status', async (c) => {
  try {
    const pineconeApiKey = c.env?.PINECONE_API_KEY || (globalThis as any).PINECONE_API_KEY;
    const pineconeEnvironment = c.env?.PINECONE_ENVIRONMENT || (globalThis as any).PINECONE_ENVIRONMENT;
    
    // 檢查 RAG 資料載入狀態
    const ragValidation = await ragLoaderService.validateRAGData();
    
    // 檢查向量服務狀態
    let vectorServiceStatus = 'unknown';
    try {
      await vectorService.initializeIndex(c.env);
      vectorServiceStatus = 'available';
    } catch (error) {
      vectorServiceStatus = 'unavailable';
    }
    
    return c.json({
      success: true,
      data: {
        // Pinecone 配置狀態
        pineconeConfigured: !!(pineconeApiKey && pineconeEnvironment),
        indexName: 'concept-radar',
        pineconeEnvironment: pineconeEnvironment || 'not_set',
        apiKeySet: !!pineconeApiKey,
        
        // RAG 資料狀態
        ragDataValid: ragValidation.isValid,
        ragStats: ragValidation.stats,
        
        // 向量服務狀態
        vectorServiceStatus,
        
        // 環境資訊
        environment: typeof globalThis !== 'undefined' && 'Cloudflare' in globalThis ? 'cloudflare' : 'local',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('RAG status check failed:', error);
    return c.json({
      success: false,
      error: 'Failed to check RAG status',
      code: 'internal_error'
    }, 500);
  }
});

// 向量搜尋 API
app.get('/vector-search', async (c) => {
  try {
    const query = c.req.query('q');
    const limit = parseInt(c.req.query('limit') || '5');
    
    if (!query) {
      return c.json({
        success: false,
        error: 'Missing query parameter',
        code: 'invalid_query'
      }, 400);
    }

    const results = await vectorService.search(query, { topK: limit }, c.env);
    return c.json(results);
  } catch (error) {
    console.error('Vector search API error:', error);
    return c.json({
      success: false,
      error: 'Vector search failed',
      code: 'internal_error'
    }, 500);
  }
});

// 🎯 整合 RAG + AI 的智能搜尋 API
app.get('/smart-search', async (c) => {
  try {
    const query = c.req.query('q');
    const mode = c.req.query('mode') as 'theme' | 'stock' | 'general';
    const useAI = c.req.query('ai') !== 'false'; // 預設使用 AI
    
    if (!query) {
      return c.json({
        success: false,
        error: 'Missing query parameter',
        code: 'invalid_query'
      }, 400);
    }

    // 檢查快取
    const cacheKey = `smart-search:${mode}:${query}:${useAI}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return c.json(cached);
    }

    // 1. 先從 RAG 資料庫搜尋相關資料
    const ragResults = await vectorService.search(query, { topK: 10 }, c.env);
    
    // 2. 如果啟用 AI，使用 Gemini 生成豐富內容
    let aiContent = null;
    if (useAI) {
      try {
        if (mode === 'theme') {
          aiContent = await geminiService.fetchStockConcepts(query);
        } else if (mode === 'stock') {
          aiContent = await geminiService.fetchConceptsForStock(query);
        } else {
          // 通用模式：結合 RAG 資料生成分析
          const ragContext = ragResults.map(r => r.content).join('\n\n');
          aiContent = await geminiService.generateAnalysisWithRAG(query, ragContext);
        }
      } catch (aiError) {
        console.warn('AI generation failed, using RAG only:', aiError);
      }
    }

    // 3. 整合結果
    const response = {
      success: true,
      data: {
        query,
        mode,
        ragResults: {
          count: ragResults.length,
          documents: ragResults.map(r => ({
            doc_id: r.doc_id,
            title: r.metadata.title,
            theme_name: r.metadata.theme_name,
            stock_name: r.metadata.stock_name,
            ticker: r.metadata.ticker,
            score: r.score,
            content: r.content
          }))
        },
        aiContent,
        summary: {
          totalResults: ragResults.length,
          hasAIAnalysis: !!aiContent,
          timestamp: new Date().toISOString()
        }
      }
    };

    // 儲存到快取
    await cacheService.set(cacheKey, response, 1800); // 30分鐘快取
    
    return c.json(response);
  } catch (error) {
    console.error('Smart search API error:', error);
    return c.json({
      success: false,
      error: 'Smart search failed',
      code: 'internal_error'
    }, 500);
  }
});

// 搜尋主題相關股票
app.get('/rag/stocks-by-theme', async (c) => {
  try {
    const themeName = c.req.query('theme');
    const topK = parseInt(c.req.query('topK') || '10');
    
    if (!themeName) {
      return c.json({
        success: false,
        error: 'Missing theme parameter',
        code: 'invalid_theme'
      }, 400);
    }

    // 檢查快取
    const cacheKey = `rag-stocks-by-theme:${themeName}:${topK}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return c.json(cached);
    }

    const results = await vectorService.searchStocksByTheme(themeName, topK, c.env);

    const response = {
      success: true,
      data: {
        theme: themeName,
        stocks: results.map(r => ({
          ticker: r.metadata.ticker,
          stock_name: r.metadata.stock_name,
          score: r.score,
          content: r.content
        })),
        count: results.length
      }
    };

    // 儲存到快取
    await cacheService.set(cacheKey, response, 3600); // 1小時快取
    
    return c.json(response);
  } catch (error) {
    console.error('RAG stocks by theme search failed:', error);
    return c.json({
      success: false,
      error: 'Failed to search stocks by theme',
      code: 'internal_error'
    }, 500);
  }
});

// 搜尋股票相關主題
app.get('/rag/themes-by-stock', async (c) => {
  try {
    const stockName = c.req.query('stock');
    const topK = parseInt(c.req.query('topK') || '10');
    
    if (!stockName) {
      return c.json({
        success: false,
        error: 'Missing stock parameter',
        code: 'invalid_stock'
      }, 400);
    }

    // 檢查快取
    const cacheKey = `rag-themes-by-stock:${stockName}:${topK}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return c.json(cached);
    }

    const results = await vectorService.searchThemesByStock(stockName, topK, c.env);

    const response = {
      success: true,
      data: {
        stock: stockName,
        themes: results.map(r => ({
          theme_name: r.metadata.theme_name,
          score: r.score,
          content: r.content
        })),
        count: results.length
      }
    };

    // 儲存到快取
    await cacheService.set(cacheKey, response, 3600); // 1小時快取
    
    return c.json(response);
  } catch (error) {
    console.error('RAG themes by stock search failed:', error);
    return c.json({
      success: false,
      error: 'Failed to search themes by stock',
      code: 'internal_error'
    }, 500);
  }
});

// 取得所有主題
app.get('/rag/themes', async (c) => {
  try {
    // 檢查快取
    const cacheKey = 'rag-all-themes';
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return c.json(cached);
    }

    const themeNames = await ragLoaderService.getAllThemeNames();
    const themes = [];

    // 取得每個主題的概覽
    for (const themeName of themeNames) {
      const overview = await vectorService.searchThemeOverview(themeName, c.env);
      if (overview.length > 0) {
        themes.push({
          name: themeName,
          overview: overview[0].content,
          score: overview[0].score
        });
      }
    }

    const response = {
      success: true,
      data: {
        themes,
        count: themes.length
      }
    };

    // 儲存到快取
    await cacheService.set(cacheKey, response, 7200); // 2小時快取
    
    return c.json(response);
  } catch (error) {
    console.error('RAG themes fetch failed:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch themes',
      code: 'internal_error'
    }, 500);
  }
});

// 載入 RAG 資料到向量資料庫
app.post('/rag/load', async (c) => {
  try {
    // 載入 RAG 文件
    const documents = await ragLoaderService.loadDocuments();
    
    if (documents.length === 0) {
      return c.json({
        success: false,
        error: 'No RAG documents found',
        code: 'no_documents'
      }, 404);
    }

    // 將文件載入到向量服務
    const result = await vectorService.upsertDocuments(documents, c.env);
    
    return c.json({
      success: true,
      data: {
        loadedCount: result,
        totalDocuments: documents.length,
        message: `Successfully loaded ${result} documents to vector database`
      }
    });
  } catch (error) {
    console.error('Load RAG data failed:', error);
    return c.json({
      success: false,
      error: 'Failed to load RAG data',
      code: 'internal_error'
    }, 500);
  }
});

// 向量化 RAG 資料（別名端點）
app.post('/rag/vectorize', async (c) => {
  try {
    // 載入 RAG 文件
    const documents = await ragLoaderService.loadDocuments();
    
    if (documents.length === 0) {
      return c.json({
        success: false,
        error: 'No RAG documents found',
        code: 'no_documents'
      }, 404);
    }

    // 將文件載入到向量服務
    const result = await vectorService.upsertDocuments(documents, c.env);
    
    return c.json({
      success: true,
      data: {
        loadedCount: result,
        totalDocuments: documents.length,
        message: `Successfully vectorized ${result} documents`
      }
    });
  } catch (error) {
    console.error('Vectorize RAG data failed:', error);
    return c.json({
      success: false,
      error: 'Failed to vectorize RAG data',
      code: 'internal_error'
    }, 500);
  }
});

// 清除向量資料
app.delete('/rag/vectors', async (c) => {
  try {
    const result = await vectorService.clearAllVectors();
    return c.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Clear vectors failed:', error);
    return c.json({
      success: false,
      error: 'Failed to clear vectors',
      code: 'internal_error'
    }, 500);
  }
});

export default app;
