import { Router } from 'itty-router';
import { conceptHandler } from './handlers/concept';
import { searchHandler } from './handlers/search';
import { stockHandler } from './handlers/stock';
import { corsMiddleware } from './middleware/cors';
import {
  toCompatibleHandler,
  toCompatibleHandlerNoParams,
} from './types/router';

// 建立路由器
const router = Router();

// 中間件
router.all('*', corsMiddleware);

// 路由 - 使用類型轉換函數確保類型安全
router.get(
  '/api/health',
  toCompatibleHandlerNoParams(() => new Response('OK', { status: 200 }))
);
router.get('/api/stocks', toCompatibleHandler(stockHandler.getStocks));
router.get('/api/stocks/:symbol', toCompatibleHandler(stockHandler.getStock));
router.get('/api/concepts', toCompatibleHandler(conceptHandler.getConcepts));
router.get('/api/concepts/:id', toCompatibleHandler(conceptHandler.getConcept));
router.get('/api/search', toCompatibleHandler(searchHandler.search));

// 404 處理
router.all('*', () => new Response('Not Found', { status: 404 }));

// 處理請求
export default {
  async fetch(
    request: Request,
    env: Record<string, unknown>,
    ctx: { waitUntil: (promise: Promise<unknown>) => void }
  ): Promise<Response> {
    return router.handle(request, env, ctx);
  },
};
