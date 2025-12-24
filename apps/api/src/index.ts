// @ts-nocheck - 禁用整個文件的類型檢查以解決 itty-router 兼容性問題
// Polyfill for libraries expecting 'global' (like Pinecone SDK) in Cloudflare Workers
Object.assign(globalThis, { global: globalThis });

import { Router } from 'itty-router';
import { conceptHandler } from './handlers/concept';
import { searchHandler } from './handlers/search';
import { screenerHandler } from './handlers/screener';
import { stockHandler } from './handlers/stock';
import { corsMiddleware } from './middleware/cors';

// 建立路由器
const router = Router();

// 中間件
// 路由 - 類型檢查已禁用
router.options('*', corsMiddleware); // 僅處理預檢請求
router.get('/health', () => new Response('OK', { status: 200 }));
router.get('/api/health', () => new Response('OK', { status: 200 }));
router.get('/api/stocks', stockHandler.getStocks);
router.get('/api/stocks/:symbol', stockHandler.getStock);
router.get('/api/concepts', conceptHandler.getConcepts);
router.get('/api/concepts/:id', conceptHandler.getConcept);
router.get('/api/search', searchHandler.search);
router.get('/api/screener', screenerHandler.filter);

// 404 處理
router.all('*', () => new Response('Not Found', { status: 404 }));

// 處理請求
export default {
  async fetch(
    request: Request,
    env: Record<string, unknown>,
    ctx: { waitUntil: (promise: Promise<unknown>) => void }
  ): Promise<Response> {
    // 處理請求
    const response = await router.handle(request, env, ctx);

    // 複製回應以添加 CORS 標頭 (Response 對象可能是不可變的)
    const newResponse = new Response(response.body, response);

    // 添加 CORS 標頭
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    newResponse.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    );
    newResponse.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization'
    );

    return newResponse;
  },
};
