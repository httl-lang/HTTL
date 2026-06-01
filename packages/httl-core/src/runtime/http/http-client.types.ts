import { HttpResponse } from './http-response';
import { HttpRequestOptions } from './http-client';
import { HttlUrl } from '../../common/url';

export interface IHttpClient {
  request(url: HttlUrl | string, options: HttpRequestOptions): Promise<HttpResponse>;
}
