import { describe, expect, it, jest } from '@jest/globals';
import { ApiResponse, SearchResponse } from '@concept-stock-screener/types';
import { searchHandler } from '../search';

// Mock dependencies
jest.mock('../../lib/gemini', () => ({
  generateEmbedding: jest
    .fn()
    .mockReturnValue(Promise.resolve([0.1, 0.2, 0.3])),
}));

jest.mock('../../lib/pinecone', () => ({
  searchVectors: jest.fn().mockReturnValue(
    Promise.resolve([
      {
        score: 0.9,
        metadata: {
          doc_type: 'theme_to_stock',
          ticker: '2330',
          stock_name: '台積電',
          theme_id: 'ai',
          theme_name: 'AI',
          tags: ['tech'],
        },
      },
    ])
  ),
}));

const createRequest = (url: string) => ({ url }) as Request;
const mockEnv = {
  GEMINI_API_KEY: 'test-key',
  PINECONE_API_KEY: 'test-key',
  PINECONE_INDEX: 'test-index',
};

const parseJson = async <T>(response: Response): Promise<ApiResponse<T>> => {
  return (await response.json()) as ApiResponse<T>;
};

describe('searchHandler.search', () => {
  it('returns 400 when query is empty', async () => {
    const request = createRequest('https://example.com/api/search');

    const response = await searchHandler.search(request, mockEnv);
    const body = await parseJson(response);

    expect(response.status).toBe(400);
    expect(body).toEqual(
      expect.objectContaining({
        success: false,
      })
    );
  });

  it('returns paginated results when query is provided', async () => {
    const request = createRequest(
      'https://example.com/api/search?q=ai&page=1&limit=1'
    );

    const response = await searchHandler.search(request, mockEnv);
    const body = await parseJson<SearchResponse>(response);

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toEqual(expect.any(String));
    expect(body.data).toEqual(
      expect.objectContaining({
        stocks: expect.any(Array),
        concepts: expect.any(Array),
        suggestions: expect.any(Array),
        total: expect.any(Number),
      })
    );
  });
});
