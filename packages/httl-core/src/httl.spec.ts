import Httl from './httl';
import { NodeHttpClient } from './runtime/http/node-http-client';
import { IHttpClient } from './runtime/http/http-client.types';

describe('httl', () => {
  it('defaults to the Node http client', () => {
    const httl = new Httl({ workdir: '' });
    expect(httl.httpClient).toBeInstanceOf(NodeHttpClient);
  });

  it('uses an injected http client', () => {
    const fake: IHttpClient = { request: jest.fn() };
    const httl = new Httl({ workdir: '', httpClient: fake });
    expect(httl.httpClient).toBe(fake);
  });
});
