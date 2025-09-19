import './loadEnv.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { envOrThrow } from './utils.js';
import { z } from 'zod';

const API_BASE = 'https://api.vercel.com';

type FetchOptions = {
  method?: string;
  body?: string;
  headers?: Record<string, string>;
};

async function vercelFetch(path: string, init: FetchOptions = {}) {
  const token = envOrThrow('VERCEL_TOKEN');
  const { headers: extraHeaders, ...rest } = init;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...(extraHeaders ?? {}),
  };
  const res = await fetch(`${API_BASE}${path}`, { ...rest, headers });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Vercel API ${res.status}: ${body}`);
  }
  return res.json();
}

async function main() {
  const teamId = process.env['VERCEL_TEAM_ID'];
  envOrThrow('VERCEL_TOKEN');
  const mcp = new McpServer({ name: 'mcp-vercel', version: '0.1.0' });

  mcp.tool(
    'vercel_deployments_list',
    'List Vercel deployments for a project.',
    {
      projectId: z.string(),
      limit: z.number().int().positive().max(100).default(10),
    },
    async ({ projectId, limit }) => {
      const params = new URLSearchParams({ projectId, limit: String(limit) });
      if (teamId) params.set('teamId', teamId);
      const data = await vercelFetch(`/v6/deployments?${params.toString()}`);
      return { content: [{ type: 'text', text: JSON.stringify(data) }] };
    }
  );

  mcp.tool(
    'vercel_logs_get',
    'Get logs for a Vercel deployment.',
    {
      deploymentId: z.string(),
      limit: z.number().int().positive().max(500).default(100),
    },
    async ({ deploymentId, limit }) => {
      const params = new URLSearchParams({ limit: String(limit) });
      if (teamId) params.set('teamId', teamId);
      const data = await vercelFetch(
        `/v2/deployments/${deploymentId}/events?${params.toString()}`
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
