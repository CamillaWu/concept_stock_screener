import { describe, expect, it } from '@jest/globals';
import { ApiResponse, ConceptData } from '@concept-stock-screener/types';
import { conceptHandler } from '../concept';

const createRequest = (url: string) => ({ url }) as Request;

const parseJson = async <T>(response: Response): Promise<ApiResponse<T>> => {
  return (await response.json()) as ApiResponse<T>;
};

describe('conceptHandler', () => {
  it('returns all concepts', async () => {
    const response = await conceptHandler.getConcepts(
      createRequest('https://example.com/api/concepts')
    );
    const body = await parseJson<ConceptData[]>(response);

    expect(response.status).toBe(200);
    expect(body).toEqual(
      expect.objectContaining({
        success: true,
        data: expect.arrayContaining([expect.any(Object)]),
      })
    );
  });

  it('requires an id when fetching a single concept', async () => {
    const response = await conceptHandler.getConcept(
      createRequest('https://example.com/api/concept')
    );
    const body = await parseJson(response);

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
  });

  it('returns 404 when the concept is not found', async () => {
    const response = await conceptHandler.getConcept(
      createRequest('https://example.com/api/concept?id=unknown')
    );
    const body = await parseJson(response);

    expect(response.status).toBe(404);
    expect(body.success).toBe(false);
  });

  it('returns concept details when the id exists', async () => {
    const response = await conceptHandler.getConcept(
      createRequest('https://example.com/api/concept?id=ai-chips')
    );
    const body = await parseJson<ConceptData>(response);

    expect(response.status).toBe(200);
    expect(body).toEqual(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({ id: 'ai-chips' }),
      })
    );
  });
});
