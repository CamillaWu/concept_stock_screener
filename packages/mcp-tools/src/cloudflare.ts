import './loadEnv.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { envOrThrow } from './utils.js';
import { z } from 'zod';

const API_BASE = 'https://api.cloudflare.com/client/v4';

type FetchOptions = {
  method?: string;
  body?: string;
  headers?: Record<string, string>;
};

async function cfFetch(path: string, init: FetchOptions = {}) {
  const token = envOrThrow('CLOUDFLARE_API_TOKEN');
  const { headers: extraHeaders, ...rest } = init;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...(extraHeaders ?? {}),
  };
  const res = await fetch(`${API_BASE}${path}`, { ...rest, headers });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Cloudflare API ${res.status}: ${body}`);
  }
  return res.json();
}

async function main() {
  const accountId = envOrThrow('CLOUDFLARE_ACCOUNT_ID');
  const mcp = new McpServer({ name: 'mcp-cloudflare', version: '0.1.0' });

  mcp.tool(
    'cloudflare_kv_get',
    'Get a value from Cloudflare KV.',
    { namespaceId: z.string(), key: z.string() },
    async ({ namespaceId, key }) => {
      const token = envOrThrow('CLOUDFLARE_API_TOKEN');
      const res = await fetch(
        `${API_BASE}/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${encodeURIComponent(
          key
        )}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 404)
        return { content: [{ type: 'text', text: '<null>' }] };
      if (!res.ok) throw new Error(`KV get failed: ${res.status}`);
      const text = await res.text();
      return { content: [{ type: 'text', text }] };
    }
  );

  mcp.tool(
    'cloudflare_kv_put',
    'Put a value into Cloudflare KV.',
    { namespaceId: z.string(), key: z.string(), value: z.string() },
    async ({ namespaceId, key, value }) => {
      const data = await cfFetch(
        `/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${encodeURIComponent(
          key
        )}`,
        {
          method: 'PUT',
          body: value,
          headers: { 'Content-Type': 'text/plain' },
        }
      );
      return { content: [{ type: 'text', text: JSON.stringify(data) }] };
    }
  );

  const transport = new StdioServerTransport();
  await mcp.connect(transport);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
