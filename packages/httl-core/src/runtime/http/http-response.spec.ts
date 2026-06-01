import { HttpResponse, HttpSize } from './http-response';

describe('HttpSize.sizeOf', () => {
  it('counts UTF-8 byte length of headers and data without Buffer', () => {
    const size = HttpSize.sizeOf({
      headers: ['Content-Type', 'application/json'],
      data: 'héllo', // 'é' is 2 bytes in UTF-8 => 6 bytes total
    });

    expect(size.data).toBe(6);
    expect(size.headers).toBe('Content-Type'.length + 'application/json'.length);
    expect(size.totalFormatted).toBe('34 bytes');
  });

  it('handles empty data', () => {
    const size = HttpSize.sizeOf({ headers: [], data: '' });
    expect(size.data).toBe(0);
    expect(size.headers).toBe(0);
  });
});

describe('HttpResponse.fromFetch', () => {
  it('builds a response from fetch result data', () => {
    const response = HttpResponse.fromFetch({
      requestUrl: 'https://example.com/users/1',
      requestMethod: 'GET',
      requestHeaders: { accept: 'application/json' },
      requestBody: undefined,
      status: 200,
      statusText: 'OK',
      responseHeaders: [['content-type', 'application/json']],
      data: '{"id":1}',
      totalMs: 12.5,
    });

    expect(response.isError()).toBe(false);
    expect(response.statusCode).toBe(200);
    expect(response.statusMessage).toBe('OK');
    expect(response.res.data).toBe('{"id":1}');
    expect(response.res.headers).toEqual([['content-type', 'application/json']]);
    expect(response.req.method).toBe('GET');
    expect(response.req.url).toBe('https://example.com/users/1');
    expect(response.timings.total).toBe(12.5);
    expect(response.timings.totalFormatted).toBe('12.50');
  });
});
