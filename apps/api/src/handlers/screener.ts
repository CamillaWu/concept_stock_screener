
import { ApiResponse, StockData } from '@concept-stock-screener/types';
import { generateStockCandidates } from '../lib/gemini';
import { fetchYahooFinance } from '../lib/yahoo';

export const screenerHandler = {
  async filter(request: Request, env: Record<string, string>): Promise<Response> {
    try {
      const url = new URL(request.url);
      const searchParams = url.searchParams;
      
      const keyword = searchParams.get('keyword') || '';
      const minPrice = parseFloat(searchParams.get('minPrice') || '0');
      const maxPrice = parseFloat(searchParams.get('maxPrice') || '10000');
      
      // AI-First: We need a keyword to generate candidates because we don't have a full DB
      if (!keyword.trim()) {
         return new Response(JSON.stringify({ 
             success: false, 
             error: '請輸入篩選關鍵字 (例如: "AI 概念", "高殖利率")',
             message: '需要關鍵字以生成候選清單'
         } as ApiResponse), { status: 400 });
      }

      // 1. AI Generation
      let candidates: string[] = [];
      if (env.GEMINI_API_KEY) {
         candidates = await generateStockCandidates(keyword, env.GEMINI_API_KEY);
      } else {
         throw new Error('Missing GEMINI_API_KEY');
      }

      console.log(`[Screener] AI suggested ${candidates.length} candidates for "${keyword}":`, candidates);

      // 2. Real-Time Verification (Yahoo Finance)
      // Fetch in parallel
      const stockPromises = candidates.map(symbol => fetchYahooFinance(symbol));
      const results = await Promise.all(stockPromises);

      // 3. Filter & Transform
      const validStocks: StockData[] = [];

      for (const result of results) {
          if (!result) continue;

          // Apply filters
          if (result.price < minPrice) continue;
          if (result.price > maxPrice) continue;

          validStocks.push({
              symbol: result.symbol,
              name: result.name, // Logic to get real name might be needed if Yahoo returns symbol as name
              price: result.price,
              change: result.change,
              changePercent: result.changePercent,
              volume: result.volume,
              marketCap: result.marketCap,
              sector: 'AI-Selected', // We don't have sector from Yahoo simple quote
              industry: 'AI-Selected'
          });
      }

      const response: ApiResponse<StockData[]> = {
        success: true,
        data: validStocks,
        message: `AI 篩選出 ${validStocks.length} 檔符合條件的股票 (從 ${candidates.length} 檔候選中驗證)`
      };

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('Screener Error:', error);
      return new Response(JSON.stringify({ 
          success: false, 
          error: '篩選失敗',
          message: error instanceof Error ? error.message : 'Unknown error'
      } as ApiResponse), { status: 500 });
    }
  }
};
