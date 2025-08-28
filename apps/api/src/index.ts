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
  origin: ['http://localhost:3000', 'https://your-domain.vercel.app'],
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

export default app;
