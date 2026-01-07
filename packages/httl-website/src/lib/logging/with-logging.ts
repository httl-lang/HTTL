import { NextRequest } from 'next/server';
import { getClientIP, log } from './logger';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RouteHandler = (request: NextRequest, context?: any) => Promise<Response> | Response;

/**
 * Wraps an App Router API route handler to log requests with response status
 */
export function withLogging<T extends RouteHandler>(handler: T): T {
  const wrappedHandler = async (request: NextRequest, context?: unknown) => {
    const ip = request.headers.get('x-client-ip') || getClientIP(request.headers);
    const method = request.method;
    const url = request.nextUrl.href;
    const userAgent = request.headers.get('x-original-user-agent')
      || request.headers.get('user-agent')
      || '-';

    try {
      const response = await handler(request, context);

      log({
        ip,
        method,
        url,
        status: response.status,
        userAgent,
      });

      return response;
    } catch (error) {
      log({
        ip,
        method,
        url,
        status: 500,
        userAgent,
      });

      throw error;
    }
  };

  return wrappedHandler as T;
}
