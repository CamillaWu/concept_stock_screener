import { Router } from 'itty-router';
import { conceptHandler } from './handlers/concept';
import { searchHandler } from './handlers/search';
import { stockHandler } from './handlers/stock';
import { corsMiddleware } from './middleware/cors';

// 建立路由器
const router = Router();

// 中間件 - 使用 any 類型來解決 itty-router 類型兼容性問題
router.all('*', corsMiddleware as any);

// 路由 - 使用 any 類型來解決 itty-router 類型兼容性問題
router.get('/api/health', () => new Response('OK', { status: 200 }));
router.get('/api/stocks', stockHandler.getStocks as any);
router.get('/api/stocks/:symbol', stockHandler.getStock as any);
router.get('/api/concepts', conceptHandler.getConcepts as any);
router.get('/api/concepts/:id', conceptHandler.getConcept as any);
router.get('/api/search', searchHandler.search as any);

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
