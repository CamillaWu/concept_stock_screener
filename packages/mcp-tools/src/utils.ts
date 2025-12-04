// Shared helpers for MCP servers

export function envOrThrow(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing environment variable: ${name}`);
  return v;
}
