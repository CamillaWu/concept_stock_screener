import { generateEmbedding, generateAnalysis } from '../lib/gemini';
import { searchVectors } from '../lib/pinecone';

// 內聯類型定義
interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  sector: string;
  industry: string;
  // New fields
  aiAnalysis?: string;
  relatedConcepts?: {
    id: string;
    name: string;
    description?: string;
  }[];
}

// 模擬股票數據
const mockStocks: StockData[] = [
  {
    symbol: '2330',
    name: '台積電',
    price: 580,
    change: 15,
    changePercent: 0.026,
    volume: 50000000,
    marketCap: 15000000000000,
    sector: '半導體',
    industry: '晶圓代工',
  },
  {
    symbol: '2317',
    name: '鴻海',
    price: 105,
    change: -2,
    changePercent: -0.019,
    volume: 80000000,
    marketCap: 1450000000000,
    sector: '電子零組件',
    industry: '電子製造服務',
  },
];

// Helper to fetch real stock price from Yahoo Finance
async function fetchYahooFinance(
  symbol: string
): Promise<Partial<StockData> | null> {
  try {
    // Append .TW for Taiwan stocks if not present
    const yahooSymbol = symbol.endsWith('.TW') ? symbol : `${symbol}.TW`;
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=1d&range=1d`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      }
    );

    if (!response.ok) throw new Error(`Yahoo API error: ${response.status}`);

    const data: any = await response.json();
    const result = data.chart?.result?.[0];

    if (!result) return null;

    const meta = result.meta;
    const price = meta.regularMarketPrice;
    const prevClose = meta.chartPreviousClose;
    const change = price - prevClose;
    const changePercent = change / prevClose;

    return {
      price,
      change: parseFloat(change.toFixed(2)),
      changePercent,
      volume: meta.regularMarketVolume || 0,
      marketCap: 0, // Yahoo chart API doesn't always return market cap in this endpoint
      name: symbol, // We might not get the localized Chinese name here easily, keeping symbol or existing mock name
    };
  } catch (e) {
    console.error('Yahoo Finance Fetch Error:', e);
    return null;
  }
}

export const stockHandler = {
  // 獲取所有股票
  async getStocks(_request: Request): Promise<Response> {
    try {
      const response: ApiResponse<StockData[]> = {
        success: true,
        data: mockStocks,
        message: '成功獲取股票列表',
      };

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      const errorResponse: ApiResponse = {
        success: false,
        error: '獲取股票列表失敗',
      };

      return new Response(JSON.stringify(errorResponse), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  },

  // 獲取單一股票
  async getStock(request: Request, env: any): Promise<Response> {
    try {
      const url = new URL(request.url);

      // Fallback logic for symbol
      let symbol = (request as any).params?.symbol;
      if (!symbol) {
        symbol = url.searchParams.get('symbol');
      }
      if (!symbol) {
        const pathParts = url.pathname.split('/');
        const lastPart = pathParts[pathParts.length - 1];
        if (lastPart !== 'stock' && lastPart !== 'stocks') {
          symbol = lastPart;
        }
      }

      if (!symbol) {
        throw new Error('Stock symbol is required');
      }

      // 1. Get Basic Data: Try Yahoo First, then Fallback to Mock
      let stock: StockData | undefined = mockStocks.find(
        s => s.symbol === symbol
      );

      // Try fetching real price
      const realData = await fetchYahooFinance(symbol);

      if (realData) {
        // If we found the stock in mock list, merge real price
        if (stock) {
          stock = { ...stock, ...realData };
        } else {
          // Create new stock object from real data
          stock = {
            symbol,
            name: symbol, // Only have symbol for now if not in mock
            price: realData.price!,
            change: realData.change!,
            changePercent: realData.changePercent!,
            volume: realData.volume!,
            marketCap: 0,
            sector: 'Unknown',
            industry: 'Unknown',
            ...realData,
          } as StockData;
        }
      } else if (!stock) {
        // Fallback to purely random mock if Yahoo fails AND not in seed list
        console.warn('Using random mock data for', symbol);
        stock = {
          symbol,
          name: symbol,
          price: Math.floor(Math.random() * 1000) + 10,
          change: Math.floor(Math.random() * 20) - 10,
          changePercent: Math.random() * 0.1 - 0.05,
          volume: Math.floor(Math.random() * 5000000),
          marketCap: 0,
          sector: 'Unknown',
          industry: 'Unknown',
        };
      }

      // 2. Fetch Real Data: AI Analysis & Concepts
      try {
        if (env.GEMINI_API_KEY && env.PINECONE_API_KEY) {
          const targetIndex = env.PINECONE_INDEX || 'concept-stock-seed';

          // A. AI Analysis
          // A. AI Analysis
          console.log('DEBUG: Generating analysis for', stock.symbol);
          // type 'stock' is default, but being explicit helps
          const analysisPromise = generateAnalysis(
            stock.symbol,
            stock.name,
            env.GEMINI_API_KEY,
            'stock'
          );

          // B. Related Concepts (Vector Search)
          // Search by "Symbol + Name" to find associated concept vectors
          const queryText = `${stock.symbol} ${stock.name}`;
          const vector = await generateEmbedding(queryText, env.GEMINI_API_KEY);

          const vectorMatches = await searchVectors(
            vector,
            50, // Fetch enough candidate matches
            env.PINECONE_API_KEY,
            targetIndex,
            env.PINECONE_NAMESPACE || 'seed'
          );

          // Filter for 'theme_to_stock' documents where ticker matches,
          // OR standard concept documents that are highly relevant.
          // Since we are doing a reverse lookup "What concepts contain this stock?",
          // ideally we find 'theme_to_stock' edges.

          const relatedConceptsMap = new Map<
            string,
            { id: string; name: string }
          >();

          vectorMatches.forEach(match => {
            const m = match.metadata;
            if (!m) return;

            // If we matched a 'theme_to_stock' record for THIS stock
            if (m.doc_type === 'theme_to_stock' && m.ticker === stock?.symbol) {
              if (m.theme_id && m.theme_name) {
                relatedConceptsMap.set(m.theme_id as string, {
                  id: m.theme_id as string,
                  name: m.theme_name as string,
                });
              }
            }
            // Also include if we matched a Concept directly and it's highly relevant to the stock text query
            else if (m.doc_type === 'theme' && match.score > 0.82) {
              relatedConceptsMap.set(m.theme_id as string, {
                id: m.theme_id as string,
                name: m.theme_name as string,
              });
            }
          });

          const [analysisResult] = await Promise.all([analysisPromise]);

          stock = {
            ...stock,
            aiAnalysis: analysisResult,
            relatedConcepts: Array.from(relatedConceptsMap.values()),
          };
        }
      } catch (err) {
        console.error('Error fetching AI/Vector data:', err);
        // Continue with basic data if AI fails
      }

      const response: ApiResponse<StockData> = {
        success: true,
        data: stock,
        message: '成功獲取股票資訊 (Real-time AI Enhanced)',
      };

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      const errorResponse: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : '獲取股票資訊失敗',
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
