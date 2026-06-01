import { constants } from '../../common/constants';
import { HttpRequestOptions } from './http-client';
import { HttpResponse } from './http-response';
import { IHttpClient } from './http-client.types';
import { HttlUrl } from '../../common/url';

export class FetchHttpClient implements IHttpClient {
  public async request(url: HttlUrl | string, options: HttpRequestOptions): Promise<HttpResponse> {
    const httlUrl = typeof url === 'string' ? HttlUrl.parse(url) : url;
    const finalUrl = httlUrl.fullUrl;

    const headers: Record<string, string> = {};
    for (const [key, value] of Object.entries(options.headers ?? {})) {
      if (value !== undefined && value !== null) {
        headers[key] = Array.isArray(value) ? value.join(', ') : String(value);
      }
    }
    headers['User-Agent'] = constants.HTTP_AGENT_NAME;

    const body = typeof options.body === 'string' ? options.body : undefined;

    const start = performance.now();
    try {
      const res = await fetch(finalUrl, {
        method: options.method.toUpperCase(),
        headers,
        body,
        redirect: 'follow',
      });

      const data = await res.text();
      const totalMs = performance.now() - start;

      const responseHeaders: [string, string][] = [];
      res.headers.forEach((value, key) => responseHeaders.push([key, value]));

      return HttpResponse.fromFetch({
        requestUrl: finalUrl,
        requestMethod: options.method.toUpperCase(),
        requestHeaders: headers,
        requestBody: body,
        status: res.status,
        statusText: res.statusText,
        responseHeaders,
        data,
        totalMs,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Request error';
      return HttpResponse.error(message);
    }
  }
}
