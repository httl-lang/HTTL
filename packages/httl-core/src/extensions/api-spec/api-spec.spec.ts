import { ApiSpec } from './api-spec';
import { HttpResponse } from '../../runtime/http/http-response';
import { IHttpClient } from '../../runtime/http/http-client.types';

describe('ApiSpec.fromUrl', () => {
  const minimalSpec = JSON.stringify({
    openapi: '3.0.0',
    info: { title: 'T', version: '1.0.0' },
    servers: [{ url: 'https://example.com/api' }],
    paths: { '/users': { get: { responses: { '200': { description: 'ok' } } } } },
  });

  it('fetches the spec using the provided http client', async () => {
    const request = jest.fn().mockResolvedValue(
      HttpResponse.fromFetch({
        requestUrl: 'https://example.com/api/spec.json',
        requestMethod: 'GET',
        requestHeaders: {},
        requestBody: undefined,
        status: 200,
        statusText: 'OK',
        responseHeaders: [['content-type', 'application/json']],
        data: minimalSpec,
        totalMs: 1,
      }),
    );
    const client: IHttpClient = { request };

    const spec = await ApiSpec.fromUrl('https://example.com/api/spec.json', client);

    expect(request).toHaveBeenCalledTimes(1);
    expect(spec.getEndpoints({ path: '/users', method: 'get' }).length).toBe(1);
  });
});
