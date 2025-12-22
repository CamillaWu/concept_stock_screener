import { ApiResponse, SearchResponse } from '@concept-stock-screener/types';
import { generateEmbedding } from '../lib/gemini';
import { searchVectors } from '../lib/pinecone';

export const searchHandler = {
  // 搜尋功能
  async search(request: Request, env: any): Promise<Response> {
    try {
      const url = new URL(request.url);
      const query = url.searchParams.get('q') || '';
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '10');

      if (!query.trim()) {
        const errorResponse: ApiResponse = {
          success: false,
          error: '搜尋關鍵字不能為空',
        };

        return new Response(JSON.stringify(errorResponse), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      // Check environment variables
      // 2. Query Pinecone
      // Use configured index or default to seed index
      const targetIndex = env.PINECONE_INDEX || 'concept-stock-seed';

      const matches = await searchVectors(
        vector,
        limit * 2,
        env.PINECONE_API_KEY,
        targetIndex,
        env.PINECONE_NAMESPACE || 'seed'
      );

      // 3. Format Response
      const stocksMap = new Map<string, any>();
      const conceptsMap = new Map<string, any>();

      matches.forEach(match => {
        const m = match.metadata;
        if (!m) return;

        // Handle 'theme_to_stock' relationships
        if (m.doc_type === 'theme_to_stock') {
          // Map Stock
          if (m.ticker && m.stock_name && !stocksMap.has(m.ticker as string)) {
            stocksMap.set(m.ticker as string, {
              symbol: m.ticker,
              name: m.stock_name,
              price: 0, // Placeholder
              change: 0,
              changePercent: 0,
              volume: 0,
              marketCap: 0,
              sector: 'N/A',
              industry: 'N/A'
            });
          }

          // Map Concept
          if (m.theme_id && m.theme_name && !conceptsMap.has(m.theme_id as string)) {
            conceptsMap.set(m.theme_id as string, {
              id: m.theme_id,
              name: m.theme_name,
              description: `與 ${m.theme_name} 相關的投資概念`,
              stocks: [],
              keywords: (m.tags as string[]) || [], // Use tags if available
              category: 'General'
            });
          }
        }
      });

      // Convert Maps to Arrays and Pagination
      const allStocks = Array.from(stocksMap.values());
      const allConcepts = Array.from(conceptsMap.values());
      const total = allStocks.length + allConcepts.length;

      const paginatedStocks = allStocks.slice(0, limit); 
      const paginatedConcepts = allConcepts.slice(0, limit);

      const response: ApiResponse<SearchResponse> = {
        success: true,
        data: {
          stocks: paginatedStocks,
          concepts: paginatedConcepts,
          total,
          suggestions: [], 
        },
        message: `找到 ${total} 個相關結果`,
      };

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Search Error:', error);
      const errorResponse: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : '搜尋失敗',
      };

      return new Response(JSON.stringify(errorResponse), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  },
};
