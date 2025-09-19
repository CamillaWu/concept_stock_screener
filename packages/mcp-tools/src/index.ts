import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

async function main() {
  const mcp = new McpServer({ name: 'mcp-tools', version: '0.1.0' });
  const transport = new StdioServerTransport();
  await mcp.connect(transport);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
