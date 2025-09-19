import './loadEnv.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { Pinecone } from '@pinecone-database/pinecone';
import type {
  PineconeRecord,
  RecordMetadata,
} from '@pinecone-database/pinecone';
import { envOrThrow } from './utils.js';
import { z } from 'zod';

type PineconeVector = PineconeRecord<RecordMetadata>;

type ToolVector = {
  id: string;
  values: number[];
  metadata?: RecordMetadata;
};

function toPineconeVectors(vectors: ToolVector[]): PineconeVector[] {
  return vectors.map(vector => {
    const payload: PineconeVector = {
      id: vector.id,
      values: vector.values,
    };
    if (vector.metadata) {
      payload.metadata = vector.metadata;
    }
    return payload;
  });
}

async function main() {
  const apiKey = envOrThrow('PINECONE_API_KEY');
  const client = new Pinecone({ apiKey });

  const mcp = new McpServer({ name: 'mcp-pinecone', version: '0.1.0' });

  mcp.tool(
    'pinecone_search',
    'Query a Pinecone index by vector.',
    {
      index: z.string().describe('Index name'),
      topK: z.number().int().positive().max(200).default(5),
      namespace: z.string().optional(),
      vector: z.array(z.number()).min(1).describe('Query vector'),
    },
    async ({ index, topK, vector, namespace }) => {
      const idx = client.index(index);
      const scoped = namespace ? idx.namespace(namespace) : idx;
      const res = await scoped.query({ topK, vector });
      return { content: [{ type: 'text', text: JSON.stringify(res) }] };
    }
  );

  mcp.tool(
    'pinecone_upsert',
    'Upsert vectors into a Pinecone index.',
    {
      index: z.string(),
      namespace: z.string().optional(),
      vectors: z
        .array(
          z.object({
            id: z.string(),
            values: z.array(z.number()).min(1),
            metadata: z
              .record(
                z.union([
                  z.string(),
                  z.number(),
                  z.boolean(),
                  z.array(z.string()),
                ])
              )
              .optional(),
          })
        )
        .min(1),
    },
    async ({ index, vectors, namespace }) => {
      const idx = client.index(index);
      const scoped = namespace ? idx.namespace(namespace) : idx;
      const payload = toPineconeVectors(vectors as ToolVector[]);
      await scoped.upsert(payload);
      return {
        content: [
          { type: 'text', text: JSON.stringify({ upserted: payload.length }) },
        ],
      };
    }
  );

  const transport = new StdioServerTransport();
  await mcp.connect(transport);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
