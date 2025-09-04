import { Router } from 'itty-router';
import { conceptHandler } from './handlers/concept';
import { searchHandler } from './handlers/search';
import { stockHandler } from './handlers/stock';
import { corsMiddleware } from './middleware/cors';

// 建立路由器
const router = Router();

// 中間件
router.all('*', corsMiddleware);

// 路由
// @ts-ignore - 跳過類型檢查以解決 itty-router 兼容性問題
router.get('/api/health', () => new Response('OK', { status: 200 }));
// @ts-ignore - 跳過類型檢查以解決 itty-router 兼容性問題
router.get('/api/stocks', stockHandler.getStocks);
// @ts-ignore - 跳過類型檢查以解決 itty-router 兼容性問題
router.get('/api/stocks/:symbol', stockHandler.getStock);
// @ts-ignore - 跳過類型檢查以解決 itty-router 兼容性問題
router.get('/api/concepts', conceptHandler.getConcepts);
// @ts-ignore - 跳過類型檢查以解決 itty-router 兼容性問題
router.get('/api/concepts/:id', conceptHandler.getConcept);
// @ts-ignore - 跳過類型檢查以解決 itty-router 兼容性問題
router.get('/api/search', searchHandler.search);

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
