import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { geminiService } from './services/gemini';
import { cacheService } from './services/cache';
import { vectorService } from './services/vector';
import { ragLoaderService } from './services/rag-loader';
import type { StockConcept, StockAnalysisResult, ApiResponse } from '@concepts-radar/types';

const app = new Hono();

// 中間件
app.use('*', logger());
app.use('*', cors({
  origin: (origin) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'https://concept-stock-screener.vercel.app',
      'https://concept-stock-screener-eyydzobsi-camilla-wus-projects.vercel.app'
    ];
    
    // 允許所有 Vercel 預覽域名
    if (origin && origin.includes('vercel.app')) {
      return origin;
    }
    
    return allowedOrigins.includes(origin || '') ? origin : false;
  },
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// 健康檢查
app.get('/', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 趨勢主題 API
app.get('/trending', async (c) => {
  try {
    const sortBy = c.req.query('sort') as 'popular' | 'latest' || 'popular';
    
    // 先檢查快取
    const cacheKey = `trending:${sortBy}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return c.json(cached);
    }

    // 呼叫 Gemini API
    const themes = await geminiService.fetchTrendingThemes(sortBy);
    
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

// 搜尋 API
app.get('/search', async (c) => {
  try {
    const mode = c.req.query('mode') as 'theme' | 'stock';
    const query = c.req.query('q');
    
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
    const cacheKey = `search:${mode}:${query}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return c.json(cached);
    }

    let result: StockConcept | StockAnalysisResult;

    if (mode === 'theme') {
      result = await geminiService.fetchStockConcepts(query);
    } else {
      result = await geminiService.fetchConceptsForStock(query);
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

// 新增：概念強度分析 API
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

// 新增：情緒分析 API
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

// 新增：個股歸因分析 API
app.get('/stock-attribution', async (c) => {
  try {
    const stockId = c.req.query('stockId');
    const theme = c.req.query('theme');
    
    if (!stockId || !theme) {
      return c.json({
        success: false,
        error: 'Missing stockId or theme parameter',
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
      error: 'Failed to analyze stock attribution',
      code: 'internal_error'
    }, 500);
  }
});

// 新增：綜合分析 API（一次性獲取主題的所有分析數據）
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

    // 並行呼叫多個 Gemini API
    const [strength, sentiment] = await Promise.all([
      geminiService.analyzeConceptStrength(theme),
      geminiService.analyzeSentiment(theme)
    ]);

    const analysis = {
      theme,
      strength,
      sentiment,
      timestamp: new Date().toISOString()
    };
    
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

// ===== RAG 相關 API =====

// 靜態檔案服務 - 提供RAG檔案
app.get('/rag/manifest.json', async (c) => {
  try {
    // 檢查是否在 Cloudflare Workers 環境中
    const isCloudflareWorkers = typeof globalThis !== 'undefined' && 'Cloudflare' in globalThis;
    
    let manifestUrl: string;
    if (isCloudflareWorkers) {
      // 在雲端環境中，使用公開的 RAG 檔案 URL
      manifestUrl = 'https://concept-stock-screener.vercel.app/rag/manifest.json';
    } else {
      // 在本地開發環境中，使用本地檔案服務
      manifestUrl = 'http://localhost:3001/rag/manifest.json';
    }
    
    const response = await fetch(manifestUrl);
    
    if (!response.ok) {
      // 如果無法讀取，返回預設的manifest
      return c.json({
        theme_overview: 15,
        theme_to_stock: 75,
        total: 90,
        fields: ['doc_id', 'type', 'title', 'text', 'source_urls', 'theme_id', 'theme_name'],
        note: 'Fallback manifest'
      });
    }
    
    const manifest = await response.json();
    return c.json(manifest);
  } catch (error) {
    console.error('Failed to serve manifest:', error);
    // 返回預設的manifest
    return c.json({
      theme_overview: 15,
      theme_to_stock: 75,
      total: 90,
      fields: ['doc_id', 'type', 'title', 'text', 'source_urls', 'theme_id', 'theme_name'],
      note: 'Fallback manifest'
    });
  }
});

app.get('/rag/docs.jsonl', async (c) => {
  try {
    // 檢查是否在 Cloudflare Workers 環境中
    const isCloudflareWorkers = typeof globalThis !== 'undefined' && 'Cloudflare' in globalThis;
    
    let docsUrl: string;
    if (isCloudflareWorkers) {
      // 在雲端環境中，使用公開的 RAG 檔案 URL
      docsUrl = 'https://concept-stock-screener.vercel.app/rag/docs.jsonl';
    } else {
      // 在本地開發環境中，使用本地檔案服務
      docsUrl = 'http://localhost:3001/rag/docs.jsonl';
    }
    
    const response = await fetch(docsUrl);
    
    if (!response.ok) {
      return c.json({
        success: false,
        error: 'Documents file not found'
      }, 404);
    }
    
    const text = await response.text();
    return new Response(text, {
      headers: {
        'Content-Type': 'application/jsonl',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Failed to serve documents:', error);
    return c.json({
      success: false,
      error: 'Failed to load documents'
    }, 500);
  }
});

// RAG 狀態檢查
app.get('/rag/status', async (c) => {
  try {
    const validation = await ragLoaderService.validateRAGData();
    return c.json({
      success: true,
      data: validation
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

// 向量化 RAG 資料
app.post('/rag/vectorize', async (c) => {
  try {
    const documents = await ragLoaderService.loadDocuments();
    const result = await vectorService.upsertDocuments(documents);
    
    return c.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('RAG vectorization failed:', error);
    return c.json({
      success: false,
      error: 'Failed to vectorize RAG data',
      code: 'internal_error'
    }, 500);
  }
});

// 向量搜尋
app.get('/rag/search', async (c) => {
  try {
    const query = c.req.query('q');
    const type = c.req.query('type') as 'theme_overview' | 'theme_to_stock';
    const themeName = c.req.query('theme');
    const topK = parseInt(c.req.query('topK') || '10');
    
    if (!query) {
      return c.json({
        success: false,
        error: 'Missing query parameter',
        code: 'invalid_query'
      }, 400);
    }

    // 檢查快取
    const cacheKey = `rag-search:${query}:${type}:${themeName}:${topK}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return c.json(cached);
    }

    const results = await vectorService.search(query, {
      type,
      theme_name: themeName,
      topK
    });

    const response = {
      success: true,
      data: {
        query,
        results,
        count: results.length
      }
    };

    // 儲存到快取
    await cacheService.set(cacheKey, response, 1800); // 30分鐘快取
    
    return c.json(response);
  } catch (error) {
    console.error('RAG search failed:', error);
    return c.json({
      success: false,
      error: 'Failed to search RAG data',
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

    const results = await vectorService.searchStocksByTheme(themeName, topK);

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

    const results = await vectorService.searchThemesByStock(stockName, topK);

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
      const overview = await vectorService.searchThemeOverview(themeName);
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
