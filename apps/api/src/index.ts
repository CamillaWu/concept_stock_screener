import { Router } from 'itty-router';
import { conceptHandler } from './handlers/concept';
import { searchHandler } from './handlers/search';
import { stockHandler } from './handlers/stock';
import { corsMiddleware } from './middleware/cors';

// 創建一個兼容的類型定義
type CompatibleHandler = (...args: any[]) => Response | Promise<Response>;

// 建立路由器
const router = Router();

// 中間件
router.all('*', corsMiddleware);

// 路由
router.get(
  '/api/health',
  (() => new Response('OK', { status: 200 })) as CompatibleHandler
);
router.get('/api/stocks', stockHandler.getStocks as CompatibleHandler);
router.get('/api/stocks/:symbol', stockHandler.getStock as CompatibleHandler);
router.get('/api/concepts', conceptHandler.getConcepts as CompatibleHandler);
router.get('/api/concepts/:id', conceptHandler.getConcept as CompatibleHandler);
router.get('/api/search', searchHandler.search as CompatibleHandler);

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
