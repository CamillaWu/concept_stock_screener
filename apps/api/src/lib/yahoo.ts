export interface YahooStockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  name: string;
}

export async function fetchYahooFinance(
  symbol: string
): Promise<YahooStockData | null> {
  try {
    const yahooSymbol = symbol.endsWith('.TW') ? symbol : `${symbol}.TW`;
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=1d&range=1d`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0',
        },
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
      name: symbol,
      symbol,
    };
  } catch (e) {
    return null;
  }
}
