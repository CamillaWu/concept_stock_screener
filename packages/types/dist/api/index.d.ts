export interface StockData {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    marketCap: number;
    sector: string;
    industry: string;
}
export interface ConceptData {
    id: string;
    name: string;
    description: string;
    stocks: StockData[];
    keywords: string[];
    category: string;
}
export interface SearchParams {
    query: string;
    filters?: {
        sector?: string;
        industry?: string;
        priceRange?: [number, number];
        marketCapRange?: [number, number];
    };
    pagination: {
        page: number;
        limit: number;
    };
}
export interface SearchResponse {
    stocks: StockData[];
    concepts: ConceptData[];
    total: number;
    suggestions: string[];
}
//# sourceMappingURL=index.d.ts.map