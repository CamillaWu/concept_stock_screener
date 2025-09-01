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

// 向量搜尋 API
app.get('/vector-search', async (c) => {
  try {
    const query = c.req.query('q');
    const topK = parseInt(c.req.query('topK') || '10');
    const type = c.req.query('type');
    const themeId = c.req.query('themeId');
    const ticker = c.req.query('ticker');
    
    if (!query) {
      return c.json({
        success: false,
        error: 'Missing query parameter',
        code: 'invalid_query'
      }, 400);
    }

    // 檢查快取
    const cacheKey = `vector-search:${query}:${topK}:${type}:${themeId}:${ticker}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return c.json(cached);
    }

    // 準備搜尋選項
    const searchOptions: any = {
      topK,
      includeMetadata: true
    };

    if (type || themeId || ticker) {
      searchOptions.filter = {};
      if (type) searchOptions.filter.type = type;
      if (themeId) searchOptions.filter.theme_id = themeId;
      if (ticker) searchOptions.filter.ticker = ticker;
    }

    // 執行向量搜尋
    const results = await vectorService.search(query, searchOptions, c.env);
    
    // 儲存到快取
    await cacheService.set(cacheKey, results, 600); // 10分鐘快取
    
    return c.json({
      success: true,
      query,
      results,
      total: results.length
    });
  } catch (error) {
    console.error('Vector search API error:', error);
    return c.json({
      success: false,
      error: 'Failed to perform vector search',
      code: 'internal_error'
    }, 500);
  }
});

// 向量索引統計 API
app.get('/vector-stats', async (c) => {
  try {
    const stats = await vectorService.getIndexStats(c.env);
    return c.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Vector stats API error:', error);
    return c.json({
      success: false,
      error: 'Failed to get vector stats',
      code: 'internal_error'
    }, 500);
  }
});

// 載入 RAG 文件到向量資料庫 API
app.post('/vector-load', async (c) => {
  try {
    const count = await vectorService.loadRAGDocuments(c.env);
    return c.json({
      success: true,
      message: `Successfully loaded ${count} documents to vector database`,
      count
    });
  } catch (error) {
    console.error('Vector load API error:', error);
    return c.json({
      success: false,
      error: 'Failed to load documents to vector database',
      code: 'internal_error'
    }, 500);
  }
});

// 清空向量資料庫 API
app.delete('/vector-clear', async (c) => {
  try {
    const result = await vectorService.clearIndex(c.env);
    return c.json({
      success: true,
      message: 'Successfully cleared vector database',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Vector clear API error:', error);
    return c.json({
      success: false,
      error: 'Failed to clear vector database',
      code: 'internal_error'
    }, 500);
  }
});

// 主題相關股票搜尋 API
app.get('/theme-stocks', async (c) => {
  try {
    const theme = c.req.query('theme');
    const topK = parseInt(c.req.query('topK') || '10');
    
    if (!theme) {
      return c.json({
        success: false,
        error: 'Missing theme parameter',
        code: 'invalid_theme'
      }, 400);
    }

    // 檢查快取
    const cacheKey = `theme-stocks:${theme}:${topK}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return c.json(cached);
    }

    // 搜尋相關股票
    const results = await vectorService.search(theme, {
      topK,
      filter: { type: 'theme_to_stock' }
    }, c.env);
    
    // 儲存到快取
    await cacheService.set(cacheKey, results, 600); // 10分鐘快取
    
    return c.json({
      success: true,
      theme,
      results,
      total: results.length
    });
  } catch (error) {
    console.error('Theme stocks API error:', error);
    return c.json({
      success: false,
      error: 'Failed to search theme stocks',
      code: 'internal_error'
    }, 500);
  }
});

// 股票相關主題搜尋 API
app.get('/stock-themes', async (c) => {
  try {
    const stock = c.req.query('stock');
    const topK = parseInt(c.req.query('topK') || '10');
    
    if (!stock) {
      return c.json({
        success: false,
        error: 'Missing stock parameter',
        code: 'invalid_stock'
      }, 400);
    }

    // 檢查快取
    const cacheKey = `stock-themes:${stock}:${topK}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return c.json(cached);
    }

    // 搜尋相關主題
    const results = await vectorService.search(stock, {
      topK,
      filter: { type: 'theme_to_stock' }
    }, c.env);
    
    // 儲存到快取
    await cacheService.set(cacheKey, results, 600); // 10分鐘快取
    
    return c.json({
      success: true,
      stock,
      results,
      total: results.length
    });
  } catch (error) {
    console.error('Stock themes API error:', error);
    return c.json({
      success: false,
      error: 'Failed to search stock themes',
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

    const stocks = await ragLoaderService.getStocksByTheme(themeName);
    const limitedStocks = stocks.slice(0, topK);

    const response = {
      success: true,
      data: {
        theme: themeName,
        stocks: limitedStocks.map(stock => ({
          ticker: stock.ticker,
          stock_name: stock.stock_name,
          score: 1.0, // 預設分數
          content: stock.text
        })),
        count: limitedStocks.length
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

    const themes = await ragLoaderService.getThemesByStock(stockName);
    const limitedThemes = themes.slice(0, topK);

    const response = {
      success: true,
      data: {
        stock: stockName,
        themes: limitedThemes.map(theme => ({
          theme_name: theme.theme_name,
          score: 1.0, // 預設分數
          content: theme.text
        })),
        count: limitedThemes.length
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
        const overviews = await ragLoaderService.getThemeOverviews();
        const themeOverview = overviews.find(overview => overview.theme_name === themeName);
        if (themeOverview) {
          themes.push({
            name: themeName,
            overview: themeOverview.text,
            score: 1.0 // 預設分數
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

// 🚀 AI 功能增強：智能投資建議
app.get('/ai/investment-advice', async (c) => {
  try {
    const stockId = c.req.query('stockId');
    const theme = c.req.query('theme');
    const marketContext = c.req.query('marketContext');
    
    if (!stockId || !theme) {
      return c.json({
        success: false,
        error: 'Missing required parameters: stockId and theme',
        code: 'invalid_parameters'
      }, 400);
    }

    // 檢查快取
    const cacheKey = `ai-investment-advice:${stockId}:${theme}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return c.json(cached);
    }

    const advice = await geminiService.generateInvestmentAdvice(stockId, theme, marketContext);
    
    const response = {
      success: true,
      data: advice
    };

    // 儲存到快取
    await cacheService.set(cacheKey, response, 1800); // 30分鐘快取
    
    return c.json(response);
  } catch (error) {
    console.error('AI investment advice failed:', error);
    return c.json({
      success: false,
      error: 'Failed to generate investment advice',
      code: 'internal_error'
    }, 500);
  }
});

// 🚀 AI 功能增強：風險評估分析
app.get('/ai/risk-assessment', async (c) => {
  try {
    const stockId = c.req.query('stockId');
    const theme = c.req.query('theme');
    
    if (!stockId || !theme) {
      return c.json({
        success: false,
        error: 'Missing required parameters: stockId and theme',
        code: 'invalid_parameters'
      }, 400);
    }

    // 檢查快取
    const cacheKey = `ai-risk-assessment:${stockId}:${theme}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return c.json(cached);
    }

    const assessment = await geminiService.analyzeRiskAssessment(stockId, theme);
    
    const response = {
      success: true,
      data: assessment
    };

    // 儲存到快取
    await cacheService.set(cacheKey, response, 3600); // 1小時快取
    
    return c.json(response);
  } catch (error) {
    console.error('AI risk assessment failed:', error);
    return c.json({
      success: false,
      error: 'Failed to analyze risk assessment',
      code: 'internal_error'
    }, 500);
  }
});

// 🚀 AI 功能增強：市場趨勢預測
app.get('/ai/market-trend', async (c) => {
  try {
    const theme = c.req.query('theme');
    const timeframe = c.req.query('timeframe') as 'short' | 'medium' | 'long' || 'medium';
    
    if (!theme) {
      return c.json({
        success: false,
        error: 'Missing required parameter: theme',
        code: 'invalid_parameters'
      }, 400);
    }

    // 檢查快取
    const cacheKey = `ai-market-trend:${theme}:${timeframe}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return c.json(cached);
    }

    const prediction = await geminiService.predictMarketTrend(theme, timeframe);
    
    const response = {
      success: true,
      data: prediction
    };

    // 儲存到快取
    await cacheService.set(cacheKey, response, 7200); // 2小時快取
    
    return c.json(response);
  } catch (error) {
    console.error('AI market trend prediction failed:', error);
    return c.json({
      success: false,
      error: 'Failed to predict market trend',
      code: 'internal_error'
    }, 500);
  }
});

// 🚀 AI 功能增強：投資組合優化建議
app.post('/ai/portfolio-optimization', async (c) => {
  try {
    const body = await c.req.json();
    const { portfolio, riskTolerance } = body;
    
    if (!portfolio || !Array.isArray(portfolio) || !riskTolerance) {
      return c.json({
        success: false,
        error: 'Missing or invalid parameters: portfolio array and riskTolerance required',
        code: 'invalid_parameters'
      }, 400);
    }

    // 驗證 portfolio 格式
    const isValidPortfolio = portfolio.every(item => 
      item.ticker && typeof item.weight === 'number' && item.weight >= 0 && item.weight <= 1
    );
    
    if (!isValidPortfolio) {
      return c.json({
        success: false,
        error: 'Invalid portfolio format: each item must have ticker and weight (0-1)',
        code: 'invalid_portfolio'
      }, 400);
    }

    // 檢查權重總和
    const totalWeight = portfolio.reduce((sum, item) => sum + item.weight, 0);
    if (Math.abs(totalWeight - 1) > 0.01) {
      return c.json({
        success: false,
        error: 'Portfolio weights must sum to 1.0',
        code: 'invalid_weights'
      }, 400);
    }

    // 檢查快取
    const cacheKey = `ai-portfolio-optimization:${JSON.stringify(portfolio)}:${riskTolerance}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return c.json(cached);
    }

    const optimization = await geminiService.optimizePortfolio(portfolio, riskTolerance);
    
    const response = {
      success: true,
      data: optimization
    };

    // 儲存到快取
    await cacheService.set(cacheKey, response, 14400); // 4小時快取
    
    return c.json(response);
  } catch (error) {
    console.error('AI portfolio optimization failed:', error);
    return c.json({
      success: false,
      error: 'Failed to optimize portfolio',
      code: 'internal_error'
    }, 500);
  }
});

// 🚀 AI 功能增強：概念強度分析
app.get('/ai/concept-strength', async (c) => {
  try {
    const theme = c.req.query('theme');
    
    if (!theme) {
      return c.json({
        success: false,
        error: 'Missing required parameter: theme',
        code: 'invalid_parameters'
      }, 400);
    }

    // 檢查快取
    const cacheKey = `ai-concept-strength:${theme}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return c.json(cached);
    }

    const strength = await geminiService.analyzeConceptStrength(theme);
    
    const response = {
      success: true,
      data: strength
    };

    // 儲存到快取
    await cacheService.set(cacheKey, response, 3600); // 1小時快取
    
    return c.json(response);
  } catch (error) {
    console.error('AI concept strength analysis failed:', error);
    return c.json({
      success: false,
      error: 'Failed to analyze concept strength',
      code: 'internal_error'
    }, 500);
  }
});

// 🚀 AI 功能增強：情緒分析
app.get('/ai/sentiment', async (c) => {
  try {
    const theme = c.req.query('theme');
    
    if (!theme) {
      return c.json({
        success: false,
        error: 'Missing required parameter: theme',
        code: 'invalid_parameters'
      }, 400);
    }

    // 檢查快取
    const cacheKey = `ai-sentiment:${theme}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return c.json(cached);
    }

    const sentiment = await geminiService.analyzeSentiment(theme);
    
    const response = {
      success: true,
      data: sentiment
    };

    // 儲存到快取
    await cacheService.set(cacheKey, response, 1800); // 30分鐘快取
    
    return c.json(response);
  } catch (error) {
    console.error('AI sentiment analysis failed:', error);
    return c.json({
      success: false,
      error: 'Failed to analyze sentiment',
      code: 'internal_error'
    }, 500);
  }
});

// 🚀 AI 功能增強：個股歸因分析
app.get('/ai/stock-attribution', async (c) => {
  try {
    const stockId = c.req.query('stockId');
    const theme = c.req.query('theme');
    
    if (!stockId || !theme) {
      return c.json({
        success: false,
        error: 'Missing required parameters: stockId and theme',
        code: 'invalid_parameters'
      }, 400);
    }

    // 檢查快取
    const cacheKey = `ai-stock-attribution:${stockId}:${theme}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return c.json(cached);
    }

    const attribution = await geminiService.analyzeStockAttribution(stockId, theme);
    
    const response = {
      success: true,
      data: attribution
    };

    // 儲存到快取
    await cacheService.set(cacheKey, response, 3600); // 1小時快取
    
    return c.json(response);
  } catch (error) {
    console.error('AI stock attribution analysis failed:', error);
    return c.json({
      success: false,
      error: 'Failed to analyze stock attribution',
      code: 'internal_error'
    }, 500);
  }
});

// 🎯 新增：RAG + AI 混合分析端點
app.get('/ai/rag-analysis', async (c) => {
  try {
    const query = c.req.query('q');
    const useAI = c.req.query('ai') !== 'false'; // 預設啟用 AI
    const maxContextLength = parseInt(c.req.query('maxLength') || '4000');
    
    if (!query) {
      return c.json({
        success: false,
        error: 'Missing query parameter',
        code: 'missing_query'
      }, 400);
    }

    // 檢查快取
    const cacheKey = `ai-rag-analysis:${query}:${useAI}:${maxContextLength}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return c.json(cached);
    }

    // 1. 從 RAG 資料庫搜尋相關資料
    const ragDocuments = await ragLoaderService.searchDocuments(query);
    
    // 2. 生成 RAG 上下文
    const ragContext = await ragLoaderService.generateRAGContext(query, maxContextLength);
    
    // 3. 生成 RAG 摘要
    const ragSummary = await ragLoaderService.generateRAGSummary(query);
    
    // 4. 如果啟用 AI，使用 Gemini 生成豐富分析
    let aiAnalysis = null;
    if (useAI && ragDocuments.length > 0) {
      try {
        aiAnalysis = await geminiService.generateAnalysisWithRAG(query, ragContext);
      } catch (aiError) {
        console.warn('AI analysis failed, using RAG only:', aiError);
      }
    }

    // 5. 整合結果
    const response = {
      success: true,
      data: {
        query,
        timestamp: new Date().toISOString(),
        ragData: {
          context: ragContext,
          summary: ragSummary,
          documents: ragDocuments.map(doc => ({
            doc_id: doc.doc_id,
            type: doc.type,
            title: doc.title,
            theme_name: doc.theme_name,
            stock_name: doc.stock_name,
            ticker: doc.ticker,
            content: doc.text.substring(0, 200) + '...'
          }))
        },
        aiAnalysis,
        analysis: {
          hasRAGData: ragDocuments.length > 0,
          hasAIAnalysis: !!aiAnalysis,
          totalDocuments: ragDocuments.length,
          confidence: aiAnalysis?.confidence || 0.5
        }
      }
    };

    // 儲存到快取（較短時間，因為 AI 分析可能變化）
    await cacheService.set(cacheKey, response, 900); // 15分鐘快取
    
    return c.json(response);
  } catch (error) {
    console.error('RAG + AI Analysis API error:', error);
    return c.json({
      success: false,
      error: 'Analysis failed',
      code: 'internal_error'
    }, 500);
  }
});

// 🎯 新增：智能概念股搜尋（結合 RAG + AI）
app.get('/ai/smart-stock-search', async (c) => {
  try {
    const query = c.req.query('q');
    const theme = c.req.query('theme');
    const useAI = c.req.query('ai') !== 'false';
    
    if (!query && !theme) {
      return c.json({
        success: false,
        error: 'Missing query or theme parameter',
        code: 'missing_params'
      }, 400);
    }

    // 檢查快取
    const cacheKey = `smart-stock-search:${query || ''}:${theme || ''}:${useAI}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return c.json(cached);
    }

    let stocks = [];
    let analysis = null;

    if (theme) {
      // 根據主題搜尋股票
      stocks = await ragLoaderService.getStocksByTheme(theme);
    } else {
      // 根據查詢搜尋股票
      const documents = await ragLoaderService.searchDocuments(query);
      stocks = documents.filter(doc => doc.type === 'theme_to_stock');
    }

    // 如果啟用 AI，生成股票分析
    if (useAI && stocks.length > 0) {
      try {
        const stockContext = stocks.map(stock => 
          `${stock.stock_name} (${stock.ticker}): ${stock.text}`
        ).join('\n\n');
        
        analysis = await geminiService.generateAnalysisWithRAG(
          query || theme, 
          `相關股票資料：\n${stockContext}`
        );
      } catch (aiError) {
        console.warn('AI stock analysis failed:', aiError);
      }
    }

    const response = {
      success: true,
      data: {
        query: query || theme,
        searchType: theme ? 'theme' : 'query',
        stocks: stocks.map(stock => ({
          ticker: stock.ticker,
          name: stock.stock_name,
          theme: stock.theme_name,
          description: stock.text,
          type: stock.type
        })),
        aiAnalysis: analysis,
        summary: {
          totalStocks: stocks.length,
          hasAIAnalysis: !!analysis,
          confidence: analysis?.confidence || 0.5
        }
      }
    };

    // 儲存到快取
    await cacheService.set(cacheKey, response, 1800); // 30分鐘快取
    
    return c.json(response);
  } catch (error) {
    console.error('Smart stock search API error:', error);
    return c.json({
      success: false,
      error: 'Smart search failed',
      code: 'internal_error'
    }, 500);
  }
});

export default app;
