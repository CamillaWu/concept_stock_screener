import { Pinecone } from '@pinecone-database/pinecone';

// Helper to get Pinecone client
// We create a new client per request or rely on lightweight instantiation as connection pooling 
// isn't the same in serverless workers as in Node.js long-running processes.

export const getPineconeClient = (apiKey: string) => {
  return new Pinecone({
    apiKey: apiKey,
  });
};

export interface SearchResult {
  id: string;
  score: number;
  metadata?: Record<string, any>;
}

export const searchVectors = async (
  vector: number[],
  topK: number,
  apiKey: string,
  indexName: string,
  namespace: string = ''
): Promise<SearchResult[]> => {
  const pinecone = getPineconeClient(apiKey);
  const index = pinecone.index(indexName);
  
  // Use namespace if provided
  const queryTarget = namespace ? index.namespace(namespace) : index;

  const queryResponse = await queryTarget.query({
    vector,
    topK,
    includeMetadata: true,
  });

  return queryResponse.matches.map(match => ({
    id: match.id,
    score: match.score || 0,
    metadata: match.metadata,
  }));
};
