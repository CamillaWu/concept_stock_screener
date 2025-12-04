export type StockSummary = {
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
};

export type ConceptSummary = {
  name: string;
  description: string;
  keywords: string[];
};

export type SearchResponse = {
  message: string;
  stocks: StockSummary[];
  concepts: ConceptSummary[];
  total: number;
  suggestions: string[];
};
