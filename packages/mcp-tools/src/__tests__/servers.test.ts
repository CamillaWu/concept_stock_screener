import type { Mock } from 'jest-mock';

declare global {
  // eslint-disable-next-line no-var
  var fetch: Mock;
}

const mockDotenvConfig = jest.fn(() => ({}));

jest.mock('dotenv', () => ({
  __esModule: true,
  default: { config: mockDotenvConfig },
}));

const mockTool = jest.fn();
const mockConnect = jest.fn();
const mockMcpConstructor = jest.fn();

jest.mock('@modelcontextprotocol/sdk/server/mcp.js', () => ({
  McpServer: jest.fn().mockImplementation(options => {
    mockMcpConstructor(options);
    return {
      tool: mockTool,
      connect: mockConnect,
    };
  }),
}));

const mockTransport = jest.fn();

jest.mock('@modelcontextprotocol/sdk/server/stdio.js', () => ({
  StdioServerTransport: jest.fn().mockImplementation(() => {
    mockTransport();
    return { type: 'stdio' };
  }),
}));

const mockPineconeClient = {
  index: jest.fn(),
};

jest.mock('../loadEnv.js', () => jest.requireActual('../loadEnv.ts'), {
  virtual: true,
});

jest.mock('../utils.js', () => jest.requireActual('../utils.ts'), {
  virtual: true,
});

jest.mock('@pinecone-database/pinecone', () => ({
  Pinecone: jest.fn().mockImplementation(() => mockPineconeClient),
}));

describe('MCP server entrypoints', () => {
  let originalEnv: Record<string, string | undefined>;
  let fetchMock: Mock;

  beforeEach(() => {
    originalEnv = { ...process.env };
    jest.resetModules();
    mockTool.mockReset();
    mockConnect.mockReset();
    mockConnect.mockResolvedValue(undefined);
    mockMcpConstructor.mockReset();
    mockTransport.mockReset();
    mockPineconeClient.index.mockReset();
    fetchMock = jest.fn();
    // @ts-expect-error override global fetch for tests
    global.fetch = fetchMock;
    mockDotenvConfig.mockClear();
  });

  afterEach(() => {
    process.env = originalEnv;
    // @ts-expect-error cleanup
    delete global.fetch;
  });

  it('registers Cloudflare tools and handles KV operations', async () => {
    process.env.CLOUDFLARE_ACCOUNT_ID = 'acct';
    process.env.CLOUDFLARE_API_TOKEN = 'token';

    await import('../cloudflare');

    expect(mockMcpConstructor).toHaveBeenCalledWith({
      name: 'mcp-cloudflare',
      version: '0.1.0',
    });
    expect(mockTool).toHaveBeenCalledTimes(2);
    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(mockTransport).toHaveBeenCalled();

    const getHandler = mockTool.mock.calls[0][3];
    const putHandler = mockTool.mock.calls[1][3];

    fetchMock.mockResolvedValueOnce({
      status: 404,
      ok: false,
      text: async () => '',
      json: async () => ({}),
    });
    const missing = await getHandler({ namespaceId: 'ns', key: 'missing' });
    expect(missing.content[0].text).toBe('<null>');

    fetchMock.mockResolvedValueOnce({
      status: 200,
      ok: true,
      text: async () => 'value',
      json: async () => ({}),
    });
    const found = await getHandler({ namespaceId: 'ns', key: 'existing' });
    expect(found.content[0].text).toBe('value');

    fetchMock.mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: async () => ({ success: true }),
    });
    const put = await putHandler({ namespaceId: 'ns', key: 'k', value: 'v' });
    expect(JSON.parse(put.content[0].text)).toEqual({ success: true });
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining(
        '/accounts/acct/storage/kv/namespaces/ns/values/'
      ),
      expect.objectContaining({ method: 'PUT' })
    );
  });

  it('registers Vercel tools and calls API helpers', async () => {
    process.env.VERCEL_TOKEN = 'token';
    process.env.VERCEL_TEAM_ID = 'team';

    await import('../vercel');

    expect(mockMcpConstructor).toHaveBeenCalledWith({
      name: 'mcp-vercel',
      version: '0.1.0',
    });
    expect(mockTool).toHaveBeenCalledTimes(2);
    expect(mockConnect).toHaveBeenCalledTimes(1);

    const listHandler = mockTool.mock.calls[0][3];
    const logsHandler = mockTool.mock.calls[1][3];

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ deployments: [] }),
    });
    await listHandler({ projectId: 'proj', limit: 5 });
    expect(fetchMock.mock.calls[0][0]).toContain('/v6/deployments?');
    expect(fetchMock.mock.calls[0][0]).toContain('projectId=proj');
    expect(fetchMock.mock.calls[0][0]).toContain('teamId=team');

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ events: [] }),
    });
    await logsHandler({ deploymentId: 'dep', limit: 10 });
    expect(fetchMock.mock.calls[1][0]).toContain('/v2/deployments/dep/events?');
  });

  it('registers Pinecone tools and forwards queries', async () => {
    process.env.PINECONE_API_KEY = 'pine';

    const baseQuery = jest.fn().mockResolvedValue({ matches: [] });
    const namespacedQuery = jest
      .fn()
      .mockResolvedValue({ matches: [{ id: 'n1' }] });
    const baseUpsert = jest.fn().mockResolvedValue(undefined);
    const namespacedUpsert = jest.fn().mockResolvedValue(undefined);
    const namespaceMock = jest.fn().mockImplementation((_namespace: string) => {
      return {
        query: namespacedQuery,
        upsert: namespacedUpsert,
      };
    });

    mockPineconeClient.index.mockReturnValue({
      query: baseQuery,
      upsert: baseUpsert,
      namespace: namespaceMock,
    });

    await import('../pinecone');

    expect(mockMcpConstructor).toHaveBeenCalledWith({
      name: 'mcp-pinecone',
      version: '0.1.0',
    });
    expect(mockTool).toHaveBeenCalledTimes(2);
    expect(mockConnect).toHaveBeenCalledTimes(1);

    const searchHandler = mockTool.mock.calls[0][3];
    const upsertHandler = mockTool.mock.calls[1][3];

    await searchHandler({ index: 'idx', topK: 3, vector: [0.1, 0.2] });
    expect(baseQuery).toHaveBeenCalledWith({ topK: 3, vector: [0.1, 0.2] });

    await searchHandler({
      index: 'idx',
      topK: 2,
      vector: [0.5],
      namespace: 'ns',
    });
    expect(namespaceMock).toHaveBeenCalledWith('ns');
    expect(namespacedQuery).toHaveBeenCalledWith({ topK: 2, vector: [0.5] });

    await upsertHandler({
      index: 'idx',
      vectors: [{ id: 'id1', values: [0.1], metadata: { tag: 'a' } }],
    });
    expect(baseUpsert).toHaveBeenCalledWith([
      { id: 'id1', values: [0.1], metadata: { tag: 'a' } },
    ]);

    await upsertHandler({
      index: 'idx',
      namespace: 'ns',
      vectors: [{ id: 'id2', values: [0.2], metadata: { numbers: ['1'] } }],
    });
    expect(namespacedUpsert).toHaveBeenCalledWith([
      { id: 'id2', values: [0.2], metadata: { numbers: ['1'] } },
    ]);
  });

  it('registers GitHub tools and proxies API calls', async () => {
    process.env.GITHUB_TOKEN = 'ghs_xxx';

    await import('../github');

    expect(mockMcpConstructor).toHaveBeenCalledWith({
      name: 'mcp-github',
      version: '0.1.0',
    });
    expect(mockTool).toHaveBeenCalledTimes(2);

    const repoHandler = mockTool.mock.calls[0][3];
    const issuesHandler = mockTool.mock.calls[1][3];

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ full_name: 'owner/repo' }),
    });
    await repoHandler({ owner: 'owner', repo: 'repo' });
    expect(fetchMock.mock.calls[0][0]).toBe(
      'https://api.github.com/repos/owner/repo'
    );
    expect(fetchMock.mock.calls[0][1]).toEqual(
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: expect.stringMatching(/^Bearer /),
          'User-Agent': 'concept-mcp-tools/0.1.0',
        }),
      })
    );

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ number: 42 }],
    });
    await issuesHandler({
      owner: 'owner',
      repo: 'repo',
      state: 'open',
      labels: ['bug'],
      limit: 10,
    });
    expect(fetchMock.mock.calls[1][0]).toContain('/repos/owner/repo/issues?');
    expect(fetchMock.mock.calls[1][0]).toContain('per_page=10');
    expect(fetchMock.mock.calls[1][0]).toContain('labels=bug');
  });
});
