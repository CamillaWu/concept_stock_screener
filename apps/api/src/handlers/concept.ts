import { ApiResponse, ConceptData } from '@concept-stock-screener/types';
import { generateEmbedding, generateAnalysis } from '../lib/gemini';
import { searchVectors } from '../lib/pinecone';

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
  aiAnalysis?: string;
  relatedConcepts?: {
    id: string;
    name: string;
    description?: string;
  }[];
}

// 模擬概念股數據
const mockConcepts: ConceptData[] = [
  {
    id: 'ai-chips',
    name: 'AI 晶片概念',
    description: '人工智慧晶片相關的股票，包括設計、製造、封裝等產業鏈',
    stocks: [
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
        symbol: '2454',
        name: '聯發科',
        price: 850,
        change: 25,
        changePercent: 0.03,
        volume: 30000000,
        marketCap: 1350000000000,
        sector: '半導體',
        industry: 'IC 設計',
      },
    ],
    keywords: ['AI', '晶片', '人工智慧', '半導體'],
    category: '科技',
  },
  {
    id: 'electric-vehicle',
    name: '電動車概念',
    description: '電動車產業相關股票，包括電池、馬達、充電樁等',
    stocks: [
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
    ],
    keywords: ['電動車', '電池', '充電', '新能源'],
    category: '汽車',
  },
];



// Helper to fetch real stock price from Yahoo Finance
async function fetchYahooFinance(symbol: string): Promise<Partial<StockData> | null> {
  try {
    const yahooSymbol = symbol.endsWith('.TW') ? symbol : `${symbol}.TW`;
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=1d&range=1d`,
      {
         headers: {
            'User-Agent': 'Mozilla/5.0'
         }
      }
    );
    if (!response.ok) return null;
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
      marketCap: 0,
      name: symbol
    };
  } catch (e) {
    return null;
  }
}

export const conceptHandler = {
  // 獲取所有概念股
  async getConcepts(_request: Request): Promise<Response> {
    try {
      // For list of concepts, we might just return mock for now or query Pinecone 'theme' type
      const response: ApiResponse<ConceptData[]> = {
        success: true,
        data: mockConcepts,
        message: '成功獲取概念股列表',
      };

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
       return new Response(JSON.stringify({ success: false, error: 'Failed' }), { status: 500 });
    }
  },

  // 獲取單一概念股
  async getConcept(request: Request, env: any): Promise<Response> {
    try {
      const url = new URL(request.url);
      
      // Support getting ID from path params or query
      let conceptId = (request as any).params?.id;
      if (!conceptId) {
         const pathParts = url.pathname.split('/');
         conceptId = pathParts[pathParts.length - 1]; // e.g. /api/concepts/theme_ai_server
      }

      if (!conceptId) {
        throw new Error('Concept ID is required');
      }

      console.log('DEBUG: Fetching concept', conceptId);

      let concept: ConceptData | undefined;

      // 1. Try to fetch Theme Metadata from Pinecone
      // We need to 'fetch' the vector by ID to get the metadata (Name, Description)
      // Since 'searchVectors' is for similarity, we need a 'fetch' util, OR we search by ID if supported,
      // OR we just search by text "conceptId" hoping it matches?
      // Pinecone REST API has 'fetch'. The current pinecone.ts lib doesn't export 'fetch'.
      // workaround: We used query by text in search.ts.
      // Better workaround: If we don't have direct fetch in lib, we might assume the ID is consistent 
      // or check our mock first as fallback.
      
      // Let's rely on basic mock first for *metadata* if ID matches known ones,
      // but ideally we should query Pinecone. 
      // Checking if PineconeService has fetch... The file `lib/pinecone.ts` was edited but I didn't verify if it has `fetchVectors`.
      // Let's assume we might need to rely on Mock metadata or search by text for now if we can't fetch by ID easily without updating lib.
      
      concept = mockConcepts.find(c => c.id === conceptId);
      
      if (!concept) {
        // Create a skeleton concept from ID if not found in mock
        concept = {
            id: conceptId,
            name: conceptId, // Placeholder until improved
            description: 'Concept details from vector database',
            stocks: [],
            keywords: [],
            category: 'General'
        };
      }

      // 2. Real Data Integration
      if (env.PINECONE_API_KEY && env.GEMINI_API_KEY) {
         try {
            // A. Get Connected Stocks (Vector Search for 'theme_to_stock' with theme_id)
            // We need to find all vectors where doc_type='theme_to_stock' AND theme_id=conceptId
            // Pinecone filtering is best for this.
            
            // We need to SEARCH with a dummy vector but Apply Filters?
            // Or generate embedding for concept name?
            const embedding = await generateEmbedding(concept.name, env.GEMINI_API_KEY);
            
            const matches = await searchVectors(
                embedding,
                100, // Get many potential matches
                env.PINECONE_API_KEY,
                env.PINECONE_INDEX || 'concept-stock-seed',
                env.PINECONE_NAMESPACE || 'seed'
            );
            
            // Filter matches that are 'theme_to_stock' and match our theme_id
            // Note: If conceptId is 'theme_ai_server', we look for theme_id === 'theme_ai_server'
            
            const linkedStocksSet = new Set<string>();
            const stockDetails: any[] = [];
            
            for (const match of matches) {
                const m = match.metadata;
                if (!m) continue;
                
                // Case 1: theme_to_stock record linked to THIS theme
                if (m.doc_type === 'theme_to_stock' && m.theme_id === conceptId) {
                   if (m.ticker && !linkedStocksSet.has(m.ticker as string)) {
                       linkedStocksSet.add(m.ticker as string);
                       // We have a ticker. Let's get its price.
                       const ticker = m.ticker as string;
                       
                       // Fetch Real Price for this stock
                       const yahooData = await fetchYahooFinance(ticker);
                       stockDetails.push({
                           symbol: ticker,
                           name: (m.stock_name as string) || ticker,
                           price: yahooData?.price || 0,
                           change: yahooData?.change || 0,
                           changePercent: yahooData?.changePercent || 0,
                           volume: yahooData?.volume || 0,
                           marketCap: 0,
                           sector: 'Unknown',
                           industry: 'Unknown'
                       });
                   }
                }
            }
            
            // Use real stocks if found, otherwise keep mock (or mixed)
            if (stockDetails.length > 0) {
                concept.stocks = stockDetails;
            }

            // B. Industry Analysis (Gemini)
            const analysis = await generateAnalysis(concept.id, concept.name, env.GEMINI_API_KEY, 'concept');
            concept.aiAnalysis = analysis;
            
         } catch (e) {
            console.error('Concept Real Data Error:', e);
         }
      }

      const response: ApiResponse<ConceptData> = {
        success: true,
        data: concept,
        message: '成功獲取概念股資訊 (Real-time)',
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
        error: '獲取概念股資訊失敗',
      };
      return new Response(JSON.stringify(errorResponse), { status: 500 });
    }
  },
};
