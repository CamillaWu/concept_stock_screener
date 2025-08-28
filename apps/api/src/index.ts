import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { geminiService } from './services/gemini';
import { cacheService } from './services/cache';
import type { StockConcept, StockAnalysisResult, ApiResponse } from '@concepts-radar/types';

const app = new Hono();

// 中間件
app.use('*', logger());
app.use('*', cors({
  origin: [
    'http://localhost:3000',
    'https://concept-stock-screener-lt46yhff9-camilla-wus-projects.vercel.app',
    'https://concept-stock-screener.vercel.app'
  ],
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

export default app;
