MCP Tools (Pinecone, Cloudflare, Vercel)

Overview

- Provides MCP servers exposing:
  - pinecone_search, pinecone_upsert
  - cloudflare_kv_get, cloudflare_kv_put
  - vercel_deployments_list, vercel_logs_get

Environment

- Credentials are loaded automatically from the workspace `.env` (falls back to `packages/mcp-tools/.env`).
- Pinecone: set `PINECONE_API_KEY`, optional `PINECONE_ENVIRONMENT`, namespace per invocation.
- Cloudflare: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.
- Vercel: `VERCEL_TOKEN`, optional `VERCEL_TEAM_ID`.

Scripts

- Build: `pnpm --filter mcp-tools build`
- Dev (tsx):
  - `pnpm --filter mcp-tools dev:pinecone`
  - `pnpm --filter mcp-tools dev:cloudflare`
  - `pnpm --filter mcp-tools dev:vercel`
  - `pnpm --filter mcp-tools dev:all`
- Start (compiled stdio):
  - `pnpm --filter mcp-tools start:pinecone`
  - `pnpm --filter mcp-tools start:cloudflare`
  - `pnpm --filter mcp-tools start:vercel`
  - `pnpm --filter mcp-tools start:all`

Notes

- All tool results return text content with JSON stringified payload for compatibility.
- Pinecone SDK v3 is used; namespace is applied via `index(namespace)` chain.
