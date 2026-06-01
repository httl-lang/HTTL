'use client';

import {
  FetchHttpClient,
  HttpResponse,
  HttlUrl,
  IHttpClient,
  HttpRequestOptions,
} from 'httl-core';

/**
 * HTTP client used by the in-browser playground.
 *
 * The site is fully static, so the demo API's dynamic endpoints (auth, create,
 * update, delete) have no server. This client mocks exactly those demo endpoints
 * in the worker — mirroring the behaviour the old Next.js route handlers had —
 * and delegates every other request (the OpenAPI spec, external URLs) to a real
 * fetch. This keeps the QuickRun examples fully working without any backend.
 */

const API_TOKEN = 'WDBuWlWi7z';

const USERS = [
  { id: 1, username: 'jdoe', email: 'jdoe@example.com', firstName: 'John', lastName: 'Doe' },
  { id: 2, username: 'asmith', email: 'asmith@example.com', firstName: 'Alice', lastName: 'Smith' },
  { id: 3, username: 'bwhite', email: 'bwhite@example.com', firstName: 'Bob', lastName: 'White' },
  { id: 4, username: 'cjones', email: 'cjones@example.com', firstName: 'Charlie', lastName: 'Jones' },
  { id: 5, username: 'dgreen', email: 'dgreen@example.com', firstName: 'David', lastName: 'Green' },
  { id: 6, username: 'emartin', email: 'emartin@example.com', firstName: 'Emma', lastName: 'Martin' },
  { id: 7, username: 'fwilson', email: 'fwilson@example.com', firstName: 'Frank', lastName: 'Wilson' },
  { id: 8, username: 'gthomas', email: 'gthomas@example.com', firstName: 'Grace', lastName: 'Thomas' },
  { id: 9, username: 'hlee', email: 'hlee@example.com', firstName: 'Hannah', lastName: 'Lee' },
  { id: 10, username: 'kjohnson', email: 'kjohnson@example.com', firstName: 'Kevin', lastName: 'Johnson' },
];

export class DemoHttpClient implements IHttpClient {
  constructor(private readonly real: IHttpClient = new FetchHttpClient()) { }

  public async request(url: HttlUrl | string, options: HttpRequestOptions): Promise<HttpResponse> {
    const fullUrl = typeof url === 'string' ? url : url.fullUrl;
    const method = options.method.toUpperCase();

    let pathname: string;
    try {
      pathname = new URL(fullUrl).pathname;
    } catch {
      return this.real.request(url, options);
    }

    const mocked = this.mock(fullUrl, pathname, method, options);
    return mocked ?? this.real.request(url, options);
  }

  private mock(
    fullUrl: string,
    pathname: string,
    method: string,
    options: HttpRequestOptions,
  ): HttpResponse | undefined {
    const reply = (status: number, statusText: string, data: unknown) =>
      HttpResponse.fromFetch({
        requestUrl: fullUrl,
        requestMethod: method,
        requestHeaders: options.headers ?? {},
        requestBody: typeof options.body === 'string' ? options.body : undefined,
        status,
        statusText,
        responseHeaders: [['content-type', 'application/json']],
        data: JSON.stringify(data),
        totalMs: 0,
      });

    // POST /api/auth — basic auth -> token
    if (pathname.endsWith('/api/auth') && method === 'POST') {
      const authorization = this.header(options, 'authorization')?.replace('Basic ', '');
      if (!authorization) {
        return reply(400, 'Bad Request', { error: 'Authorization header is required' });
      }
      const [username, password] = this.decodeBase64(authorization).split(':');
      if (username === 'admin' && password === 'admin') {
        return reply(200, 'OK', { token: API_TOKEN });
      }
      return reply(401, 'Unauthorized', { error: 'Invalid credentials' });
    }

    // /api/users collection
    if (pathname.endsWith('/api/users')) {
      if (method === 'GET') {
        return reply(200, 'OK', USERS);
      }
      if (method === 'POST') {
        return reply(200, 'OK', this.parseBody(options));
      }
      return undefined;
    }

    // /api/users/{id}
    const idMatch = pathname.match(/\/api\/users\/(\d+)$/);
    if (idMatch) {
      const id = Number(idMatch[1]);
      const user = USERS.find((u) => u.id === id);

      if (method === 'GET') {
        return user
          ? reply(200, 'OK', user)
          : reply(404, 'Not Found', { error: 'User not found' });
      }

      if (method === 'PUT') {
        const authorization = this.header(options, 'authorization')?.replace('Bearer ', '');
        if (!authorization) {
          return reply(400, 'Bad Request', { error: 'Authorization header is required' });
        }
        if (authorization !== API_TOKEN) {
          return reply(401, 'Unauthorized', { error: 'Invalid token' });
        }
        if (!user) {
          return reply(404, 'Not Found', { error: 'User not found' });
        }
        return reply(200, 'OK', { ...user, ...this.parseBody(options) });
      }

      if (method === 'DELETE') {
        return user
          ? reply(200, 'OK', { message: 'User deleted' })
          : reply(404, 'Not Found', { error: 'User not found' });
      }
    }

    return undefined;
  }

  private header(options: HttpRequestOptions, name: string): string | undefined {
    const headers = options.headers ?? {};
    const key = Object.keys(headers).find((k) => k.toLowerCase() === name.toLowerCase());
    return key ? String((headers as Record<string, unknown>)[key]) : undefined;
  }

  private parseBody(options: HttpRequestOptions): Record<string, unknown> {
    if (typeof options.body !== 'string') {
      return {};
    }
    try {
      const parsed = JSON.parse(options.body);
      return parsed && typeof parsed === 'object' ? parsed as Record<string, unknown> : {};
    } catch {
      return {};
    }
  }

  private decodeBase64(value: string): string {
    try {
      return atob(value);
    } catch {
      return '';
    }
  }
}
