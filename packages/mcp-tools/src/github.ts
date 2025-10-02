import './loadEnv.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { envOrThrow } from './utils.js';
import { z } from 'zod';

const API_BASE = 'https://api.github.com';

type FetchOptions = {
  method?: string;
  body?: string;
  headers?: Record<string, string>;
};

async function githubFetch(path: string, init: FetchOptions = {}) {
  const token = envOrThrow('GITHUB_TOKEN');
  const { headers: extraHeaders, ...rest } = init;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'concept-mcp-tools/0.1.0',
    ...(extraHeaders ?? {}),
  };

  const res = await fetch(`${API_BASE}${path}`, { ...rest, headers });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API ${res.status}: ${body}`);
  }
  return res.json();
}

async function main() {
  envOrThrow('GITHUB_TOKEN');

  const mcp = new McpServer({ name: 'mcp-github', version: '0.1.0' });

  mcp.tool(
    'github_repo_get',
    'Get metadata for a GitHub repository.',
    {
      owner: z.string(),
      repo: z.string(),
    },
    async ({ owner, repo }) => {
      const data = await githubFetch(`/repos/${owner}/${repo}`);
      return { content: [{ type: 'text', text: JSON.stringify(data) }] };
    }
  );

  mcp.tool(
    'github_issues_list',
    'List issues (and pull requests) for a GitHub repository.',
    {
      owner: z.string(),
      repo: z.string(),
      state: z.enum(['open', 'closed', 'all']).default('open'),
      labels: z.array(z.string()).min(1).optional(),
      limit: z.number().int().positive().max(100).default(30),
    },
    async ({ owner, repo, state, labels, limit }) => {
      const params = new URLSearchParams({
        state,
        per_page: String(limit),
      });
      if (labels?.length) {
        params.set('labels', labels.join(','));
      }
      const data = await githubFetch(
        `/repos/${owner}/${repo}/issues?${params.toString()}`
      );
      return { content: [{ type: 'text', text: JSON.stringify(data) }] };
    }
  );

  const transport = new StdioServerTransport();
  await mcp.connect(transport);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
