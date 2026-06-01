import { FetchHttpClient } from './fetch-http-client';

describe('FetchHttpClient', () => {
  const makeResponse = (body: string) =>
    new Response(body, {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
    });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('performs a GET and maps the response', async () => {
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue(makeResponse('{"id":1}'));

    const client = new FetchHttpClient();
    const response = await client.request('https://example.com/users/1', {
      method: 'GET',
      headers: { accept: 'application/json' },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.com/users/1',
      expect.objectContaining({ method: 'GET' }),
    );
    expect(response.isError()).toBe(false);
    expect(response.statusCode).toBe(200);
    expect(response.res.data).toBe('{"id":1}');
    expect(response.res.headers).toContainEqual(['content-type', 'application/json']);
    expect(typeof response.timings.total).toBe('number');
  });

  it('sends a string body for POST', async () => {
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue(makeResponse('{}'));

    const client = new FetchHttpClient();
    await client.request('https://example.com/users', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{"name":"x"}',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.com/users',
      expect.objectContaining({ method: 'POST', body: '{"name":"x"}' }),
    );
  });

  it('returns an error response when fetch rejects', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'));

    const client = new FetchHttpClient();
    const response = await client.request('https://blocked.example.com', {
      method: 'GET',
      headers: {},
    });

    expect(response.isError()).toBe(true);
    expect(String(response.error)).toContain('Failed to fetch');
  });
});
