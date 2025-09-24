import { stockHandler } from '../stock';

const createRequest = (url: string) => ({ url }) as Request;

describe('stockHandler', () => {
  it('returns all stocks', async () => {
    const response = await stockHandler.getStocks(
      createRequest('https://example.com/api/stocks')
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual(
      expect.objectContaining({
        success: true,
        data: expect.arrayContaining([expect.any(Object)]),
      })
    );
  });

  it('requires a symbol when fetching a single stock', async () => {
    const response = await stockHandler.getStock(
      createRequest('https://example.com/api/stock')
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
  });

  it('returns 404 when the stock is not found', async () => {
    const response = await stockHandler.getStock(
      createRequest('https://example.com/api/stock?symbol=9999')
    );
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.success).toBe(false);
  });

  it('returns stock details when the symbol exists', async () => {
    const response = await stockHandler.getStock(
      createRequest('https://example.com/api/stock?symbol=2330')
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({ symbol: '2330' }),
      })
    );
  });
});
