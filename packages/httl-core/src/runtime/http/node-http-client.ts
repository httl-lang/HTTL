import { HttpClient, HttpRequestOptions } from './http-client';
import { HttpResponse } from './http-response';
import { IHttpClient } from './http-client.types';
import { HttlUrl } from '../../common/url';

export class NodeHttpClient implements IHttpClient {
  public request(url: HttlUrl | string, options: HttpRequestOptions): Promise<HttpResponse> {
    return HttpClient.request(url, options);
  }
}
